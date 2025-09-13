import { NotFoundError } from "../errors/customErrors.js";
import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Job from "../models/JobModel.js"; // Ensure this path is correct
import day from "dayjs";
import { s } from "framer-motion/client";

// Get all jobs controller
export const getAllJobs = async (req, res) => {
  // get all jobs created by the user
  console.log(req.user?.userId);

  try {
    const { search, sort, jobType, jobStatus, specialization, notes } =
      req.query;

    const query = {};
    const userId = req.user?.userId;

    // Only limit by createdBy for authenticated (non-guest) users
    if (userId && userId !== "guest") {
      query.createdBy = userId;
    }

    // Text search across a few fields if provided and non-empty
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { position: regex },
        { company: regex },
        { jobLocation: regex },
        { specialization: regex },
        { notes: regex },
      ];
    }

    if (jobType && jobType !== "all") query.jobType = jobType;
    if (jobStatus && jobStatus !== "all") query.jobStatus = jobStatus;
    if (specialization && specialization !== "all")
      query.specialization = specialization;
    if (notes && notes !== "all") query.notes = notes;
    console.log("QQ", query);

    // Map sort values (support both 'sort' and 'sortOptions' query keys)
    const sortOptions = {
      newest: "-createdAt",
      oldest: "createdAt",
    };
    const sortKey = sortOptions[sort];
    console.log(sortKey);

    // Execute query with sorting
    let queryExec = Job.find(query).sort(sortKey);

    // // Ensure case-insensitive alphabetical sort when sorting by position
    // if (sortKey.includes("position")) {
    //   queryExec = queryExec.collation({ locale: "en", strength: 2 });
    // }

    const jobs = await queryExec;
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single job by ID
// This function retrieves a job by its ID from the database
// It uses the Job model to find the job and returns it in the response.
// If the job is not found, it throws a NotFoundError.
// The ID is passed as a parameter in the request.
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // Use findById to fetch by MongoDB ID

    res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    if (error.name === "CastError") {
      throw new NotFoundError(`Job with id ${req.params.id} not found`);
    }
    console.error(error);
  }
};

// Create a new job

export const createJob = async (req, res) => {
  try {
    const {
      position,
      company,
      jobLocation,
      jobType,
      jobStatus, // Assuming this is the default status
      specialization,
      applicationDate,
      notes,
    } = req.body;

    // Validate required fields
    if (!position || !company || !jobLocation) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide all required fields" });
    }

    // Create job in the database
    const job = await Job.create({
      position,
      company,
      jobLocation,
      jobType,
      jobStatus,
      specialization,
      applicationDate,
      notes,
      createdBy: req.user.userId, // Assuming `req.user` contains the authenticated user
    });

    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// Update a job by ID
export const updateJob = async (req, res) => {
  try {
    const {
      position,
      company,
      jobLocation,
      jobType,
      jobStatus,
      specialization,
      applicationDate,
      notes,
    } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        position,
        company,
        jobLocation,
        jobType,
        jobStatus,
        specialization,
        applicationDate,
        notes,
      },
      { new: true }
    ); // Updates job in database and returns the updated document

    if (!job) {
      throw new NotFoundError(`Job with id ${req.params.id} not found`);
    }

    res.status(StatusCodes.OK).json({ updatedJob: job });
  } catch (error) {
    console.error(error);
    throw new NotFoundError(`Job with id ${req.params.id} not found`);
  }
};

// Delete a job by ID -- creating database logics
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id); // Deletes job by ID
    res.status(StatusCodes.OK).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);

    // res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobsCount = async (req, res) => {
  // this is the funcntion for authorized users aka logged in
  // find all jobs in this fct
  // filter them for logged users
  try {
    const {
      search,
      sort,
      jobType,
      jobStatus,
      jobLocation,
      specialization,
      notes,
    } = req.query;

    const query = {};
    const userId = req.user?.userId;

    // Only limit by createdBy for authenticated (non-guest) users
    if (userId && userId !== "guest") {
      query.createdBy = userId;
    }

    // Text search across a few fields if provided and non-empty
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { position: regex },
        { company: regex },
        { jobLocation: regex },
        { jobType: regex },
        { jobStatus: regex },
        { specialization: regex },
        { notes: regex },
      ];
    }

    if (jobType && jobType !== "all") query.jobType = jobType;
    if (jobStatus && jobStatus !== "all") query.jobStatus = jobStatus;
    if (jobLocation && jobLocation !== "all") query.jobLocation = jobLocation;
    if (jobStatus && jobStatus !== "all") query.jobStatus = jobStatus;
    if (specialization && specialization !== "all")
      query.specialization = specialization;
    if (notes && notes !== "all") query.notes = notes;

    const sortOptions = {
      newest: "-createdAt",
      oldest: "createdAt",
      az: "position",
      za: "-position",
      type: "jobType",
      status: "jobStatus",
      location: "jobLocation",
      specialization: "specialization",
      notes: "notes",
    };

    const sortQuery = sortOptions[sort] || sort.newest;

    const jobs = await Job.find(query).sort(sortQuery);
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
//

export const showStats = async (req, res) => {
  try {
    // Check if user is authenticated (optional, since this might be a public route)
    const userId = req.user?.userId;

    let stats;
    let monthlyApplications;

    if (userId) {
      // If user is authenticated, get their specific stats
      stats = await Job.aggregate([
        // Getting all the jobs of the specific user
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$jobStatus",
            count: { $sum: 1 },
          },
        },
      ]);
      // consoleStats = stats.reduce((acc, cur) => {
      //   acc[cur._id] = cur.count;
      //   return acc;
      // }, {});
      // console.log(consoleStats);

      // Get monthly applications for the authenticated user
      monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 }, // Last 6 months
        {
          $project: {
            date: {
              $dateToString: {
                format: "%b %Y",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: 1,
                  },
                },
              },
            },
            count: 1,
            _id: 0,
          },
        },
      ]);

      // Convert aggregation results to the expected format
      const defaultStats = {
        pending: stats.find((item) => item._id === "pending")?.count || 0,
        interview: stats.find((item) => item._id === "interview")?.count || 0,
        declined: stats.find((item) => item._id === "declined")?.count || 0,
      };

      // Get total counts
      const totalJobs = await Job.countDocuments({
        createdBy: new mongoose.Types.ObjectId(userId),
      });

      res.status(StatusCodes.OK).json({
        defaultStats,
        monthlyApplications,
        totalJobs,
        appliedJobs: totalJobs, // Assuming all jobs are applied jobs
        pendingJobs: defaultStats.pending,
        declinedJobs: defaultStats.declined,
      });
    } else {
      // If user is not authenticated, return demo data
      const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0, // stats.interview || 0,
        declined: stats.declined || 0,
      };

      monthlyApplications = [
        { date: "May 23", count: 10 },
        { date: "June 23", count: 15 },
        { date: "July 23", count: 8 },
        { date: "August 23", count: 1 },
        { date: "Sep 23", count: 12 },
        { date: "Oct 23", count: 18 },
      ];

      // Get total users for demo (public info)
      const totalUsers = await User.countDocuments();

      const demoData = {
        defaultStats,
        monthlyApplications,
        totalJobs: 32,
        appliedJobs: 28,
        pendingJobs: 12,
        declinedJobs: 3,
        totalUsers,
      };
      console.log("📤 Sending demo data:", demoData);

      res.status(StatusCodes.OK).json(demoData);
    }
  } catch (error) {
    console.error("❌ Error in showStats:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching statistics",
      error: error.message,
    });
  }
};
