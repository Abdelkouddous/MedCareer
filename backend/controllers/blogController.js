import { NotFoundError, BadRequestError } from "../errors/customErrors.js";
import { StatusCodes } from "http-status-codes";
import Blog from "../models/BlogModel.js";
import Employer from "../models/EmployerModel.js";
import JobSeeker from "../models/JobSeekerModel.js";

// Get all published blogs (public access)
export const getAllBlogs = async (req, res) => {
  try {
    const { search, sort, category, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };
    const userId = req.user?.userId;

    // Text search across title, content, and tags
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: regex },
        { content: regex },
        { tags: { $in: [regex] } },
      ];
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Sort options
    const sortOptions = {
      newest: "-createdAt",
      oldest: "createdAt",
      popular: "-likeCount",
      trending: "-viewCount",
    };
    const sortKey = sortOptions[sort] || "-createdAt";

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .populate("author", "name lastName email avatar profilePicture")
      .sort(sortKey)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);

    // Check if user has liked each blog
    if (userId) {
      blogs.forEach((blog) => {
        blog.isLiked = blog.likes.some(
          (like) => like.user && like.user.toString() === userId.toString()
        );
      });
    }

    res.status(StatusCodes.OK).json({
      blogs,
      totalBlogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBlogs / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching blogs",
    });
  }
};

// Get a single blog by ID (public access)
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const blog = await Blog.findOne({ _id: id, isPublished: true })
      .populate("author", "name lastName email avatar profilePicture")
      .populate("comments.user", "name lastName avatar profilePicture");

    if (!blog) {
      throw new NotFoundError(`Blog with id ${id} not found`);
    }

    // Increment view count
    await Blog.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    // Check if user has liked this blog
    if (userId) {
      blog.isLiked = blog.likes.some(
        (like) => like.user && like.user.toString() === userId.toString()
      );
    }

    res.status(StatusCodes.OK).json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    if (error instanceof NotFoundError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching blog",
    });
  }
};

// Create a new blog (employers and job seekers)
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featuredImage } = req.body;

    // Validate required fields
    if (!title || !content) {
      throw new BadRequestError("Title and content are required");
    }

    // Generate excerpt if not provided
    const blogExcerpt = excerpt || content.substring(0, 300) + "...";

    // Determine author type based on user role
    const userRole = req.user.role;
    let authorType;

    if (userRole === "admin") {
      authorType = "Employer"; // Admins are treated as employers for blog authorship
    } else if (userRole === "employer") {
      authorType = "Employer";
    } else if (userRole === "jobseeker") {
      authorType = "JobSeeker";
    } else {
      throw new BadRequestError("Invalid user role for blog creation");
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt: blogExcerpt,
      category,
      tags: tags || [],
      featuredImage: featuredImage || "",
      author: req.user.userId,
      authorType,
    });

    // Populate author info
    await blog.populate("author", "name lastName email avatar profilePicture");

    res.status(StatusCodes.CREATED).json({ blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    if (error instanceof BadRequestError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while creating blog",
    });
  }
};

// Update a blog (admin only)
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      isPublished,
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    ).populate("author", "name lastName email avatar profilePicture");

    if (!blog) {
      throw new NotFoundError(`Blog with id ${id} not found`);
    }

    res.status(StatusCodes.OK).json({ blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error instanceof NotFoundError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while updating blog",
    });
  }
};

// Delete a blog (admin only)
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      throw new NotFoundError(`Blog with id ${id} not found`);
    }

    res.status(StatusCodes.OK).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    if (error instanceof NotFoundError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while deleting blog",
    });
  }
};

// Like/Unlike a blog (authenticated users only)
export const toggleBlogLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const blog = await Blog.findById(id);

    if (!blog) {
      throw new NotFoundError(`Blog with id ${id} not found`);
    }

    // Determine user type for like
    let userType;
    if (userRole === "admin" || userRole === "employer") {
      userType = "Employer";
    } else if (userRole === "jobseeker") {
      userType = "JobSeeker";
    } else {
      throw new BadRequestError("Invalid user role for liking blogs");
    }

    const isLiked = blog.likes.some(
      (like) => like.user && like.user.toString() === userId.toString()
    );

    if (isLiked) {
      // Unlike the blog
      blog.likes = blog.likes.filter(
        (like) => !(like.user && like.user.toString() === userId.toString())
      );
    } else {
      // Like the blog
      blog.likes.push({
        user: userId,
        userType: userType,
      });
    }

    await blog.save();

    res.status(StatusCodes.OK).json({
      message: isLiked
        ? "Blog unliked successfully"
        : "Blog liked successfully",
      isLiked: !isLiked,
      likeCount: blog.likes.length,
    });
  } catch (error) {
    console.error("Error toggling blog like:", error);
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while updating blog like",
    });
  }
};

// Add comment to a blog (authenticated users only)
export const addBlogComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (!content || content.trim() === "") {
      throw new BadRequestError("Comment content is required");
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      throw new NotFoundError(`Blog with id ${id} not found`);
    }

    // Determine user type for comment
    let userType;
    if (userRole === "admin" || userRole === "employer") {
      userType = "Employer";
    } else if (userRole === "jobseeker") {
      userType = "JobSeeker";
    } else {
      throw new BadRequestError("Invalid user role for commenting");
    }

    // Add comment
    blog.comments.push({
      user: userId,
      userType: userType,
      content: content.trim(),
    });

    await blog.save();

    // Populate the new comment with user info
    await blog.populate("comments.user", "name lastName avatar profilePicture");

    const newComment = blog.comments[blog.comments.length - 1];

    res.status(StatusCodes.CREATED).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding blog comment:", error);
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while adding comment",
    });
  }
};

// Delete a comment (authenticated users only - can delete their own comments or admin can delete any)
export const deleteBlogComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const blog = await Blog.findById(id);

    if (!blog) {
      throw new NotFoundError(`Blog with id ${id} not found`);
    }

    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      throw new NotFoundError(`Comment with id ${commentId} not found`);
    }

    const comment = blog.comments[commentIndex];

    // Check if user can delete this comment
    if (userRole !== "admin" && comment.user.toString() !== userId.toString()) {
      throw new BadRequestError("You can only delete your own comments");
    }

    // Remove the comment
    blog.comments.splice(commentIndex, 1);
    await blog.save();

    res.status(StatusCodes.OK).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog comment:", error);
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while deleting comment",
    });
  }
};

// Get blog categories (public)
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category", { isPublished: true });
    res.status(StatusCodes.OK).json({ categories });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching categories",
    });
  }
};

// Get popular blogs (public)
export const getPopularBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "name lastName avatar profilePicture")
      .sort("-viewCount")
      .limit(parseInt(limit))
      .lean();

    res.status(StatusCodes.OK).json({ blogs });
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching popular blogs",
    });
  }
};
