const Job = require("../models/Job");
const Application = require("../models/Application");

// @route POST /api/jobs   (HR only)
const createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, jobType, category, salaryMin, salaryMax, deadline } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required" });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements || [],
      location,
      jobType,
      category,
      salaryMin,
      salaryMax,
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
};

// @route GET /api/jobs   (public - search + filter + pagination)
const getJobs = async (req, res) => {
  try {
    const { search, location, jobType, category, page = 1, limit = 10 } = req.query;

    const query = { status: "open" };

    if (search) {
      query.$text = { $search: search };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      query.jobType = jobType;
    }
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("postedBy", "name company")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name company email");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job", error: err.message });
  }
};

// @route GET /api/jobs/mine/list   (HR only - jobs they posted)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

    // Attach applicant counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicantCount: count };
      })
    );

    res.json({ jobs: jobsWithCounts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your jobs", error: err.message });
  }
};

// @route PUT /api/jobs/:id   (HR only, must own the job)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit jobs you posted" });
    }

    const allowedFields = [
      "title", "description", "requirements", "location",
      "jobType", "category", "salaryMin", "salaryMax", "deadline", "status",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
};

// @route DELETE /api/jobs/:id   (HR only, must own the job)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete jobs you posted" });
    }

    await job.deleteOne();
    await Application.deleteMany({ job: job._id });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
};

module.exports = { createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob };
