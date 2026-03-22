import Message from "../models/MessageModel.js";
import Conversation from "../models/ConversationModel.js";
import Application from "../models/ApplicationModel.js";

// Maps lowercase role strings from req.user.role to Mongoose enum values
const normalizeRole = (role) => {
  const map = { employer: "Employer", jobseeker: "JobSeeker" };
  return map[role?.toLowerCase()] || role;
};

export const sendMessage = async (req, res) => {
  try {
    const {content, receiverId, receiverModel, jobId} = req.body;
    const senderId = req.user.userId;
    const senderModel = normalizeRole(req.user.role);
    const normalizedReceiverModel = normalizeRole(receiverModel);
    let conversation = await Conversation.findOne({
      $or: [
        { employerId: senderId, jobId: jobId },
        { jobSeekerId: senderId, jobId: jobId },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        employerId: senderModel === "Employer" ? senderId : receiverId,
        jobSeekerId: senderModel === "JobSeeker" ? senderId : receiverId,
        jobId: jobId,
      });
    }
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      senderModel: senderModel,
      receiver: receiverId,
      receiverModel: normalizedReceiverModel,
      content: content,
    });
    await conversation.save();

    await message.populate("sender");
    await message.populate("receiver");

    res.status(201).json({ msg: "Message sent successfully!", message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export const getConversation = async (req, res) => {
  try {
    const {jobId} = req.params;
    const senderId = req.user.userId;
    const senderModel = req.user.role;
    let conversation = await Conversation.findOne({
      $or: [
        { employerId: senderId, jobId: jobId },
        { jobSeekerId: senderId, jobId: jobId },
      ],
    });
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    res.status(200).json({ conversation });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  } 

}

export const getMessages = async (req, res) => {
  try {
    const {conversationId} = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    
    // Fetch and populate messages directly from the collection
    const messages = await Message.find({ conversationId })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: 1 });
      
    res.status(200).json({ messages });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

// ─── Job Seeker Messaging Endpoints ───────────────────────────────────────────

/**
 * Get all conversations for the authenticated job seeker.
 * Only returns conversations where the linked application is "accepted".
 */
export const getJobSeekerConversations = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker.jobSeekerId;

    // Find all accepted applications for this job seeker
    const acceptedApps = await Application.find({
      jobSeeker: jobSeekerId,
      status: "accepted",
    }).select("job");
    const acceptedJobIds = acceptedApps.map((a) => a.job);

    // Find conversations that match this jobSeeker AND an accepted job
    const conversations = await Conversation.find({
      jobSeekerId,
      jobId: { $in: acceptedJobIds },
    })
      .populate("employerId", "name lastName email avatar")
      .populate("jobId", "position company")
      .sort({ updatedAt: -1 });

    // Attach last message preview to each conversation
    const results = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .select("content createdAt senderModel");
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiver: jobSeekerId,
          read: false,
        });
        return {
          ...conv.toObject(),
          lastMessage: lastMsg || null,
          unreadCount,
        };
      })
    );

    res.status(200).json({ conversations: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Send a message as a job seeker.
 * If no conversation exists yet, one is created (only if application is accepted).
 */
export const sendMessageAsJobSeeker = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker.jobSeekerId;
    const { content, receiverId, jobId } = req.body;

    // Verify the application is accepted before allowing chat
    const application = await Application.findOne({
      job: jobId,
      jobSeeker: jobSeekerId,
      status: "accepted",
    });
    if (!application) {
      return res
        .status(403)
        .json({ msg: "You can only message employers who accepted your application" });
    }

    let conversation = await Conversation.findOne({
      jobSeekerId,
      jobId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        employerId: receiverId,
        jobSeekerId,
        jobId,
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: jobSeekerId,
      senderModel: "JobSeeker",
      receiver: receiverId,
      receiverModel: "Employer",
      content,
    });

    conversation.updatedAt = new Date();
    await conversation.save();
    await message.populate("sender");
    await message.populate("receiver");

    res.status(201).json({ msg: "Message sent successfully!", message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Get messages for a specific conversation as a job seeker.
 * Verifies the job seeker is a participant and marks messages as read.
 */
export const getMessagesAsJobSeeker = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker.jobSeekerId;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    if (conversation.jobSeekerId.toString() !== jobSeekerId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Mark all incoming messages as read
    await Message.updateMany(
      { conversationId, receiver: jobSeekerId, read: false },
      { read: true }
    );

    const messages = await Message.find({ conversationId })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

