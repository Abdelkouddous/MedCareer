import CV from "../models/CVModel.js";
import JobSeeker from "../models/JobSeekerModel.js";
import { StatusCodes } from "http-status-codes";

export const uploadCV = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    if (!jobSeekerId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "No CV file provided" });
    }

    const { filename, mimetype, size, originalname } = req.file;
    const fileUrl = `/uploads/${filename}`;

    // Safely Upsert the CV Document
    const cv = await CV.findOneAndUpdate(
      { jobSeekerId: jobSeekerId },
      {
        jobSeekerId: jobSeekerId,
        cvType: "uploaded",
        cvUrl: fileUrl,
        cvPublicId: filename,
        originalFileName: originalname,
      },
      { new: true, upsert: true }
    );

    // Sync the URL tightly with the JobSeeker profile so it natively populates on page refresh
    await JobSeeker.findByIdAndUpdate(jobSeekerId, {
      curriculumVitae: fileUrl,
    });

    res.status(StatusCodes.OK).json({ msg: "CV uploaded successfully", cv });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
