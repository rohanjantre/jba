const Application = require("../models/Application");
const Job = require("../models/Job");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const sendEmail = require("../utils/sendEmail");

// @route POST /api/applications/:jobId   (Candidate only)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.status !== "open") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, "ats/resumes");

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl: uploadResult.secure_url,
      resumePublicId: uploadResult.public_id,
      coverLetter,
    });

    // Notify candidate (fire and forget, doesn't block response)
    sendEmail({
      to: req.user.email,
      subject: `Application received: ${job.title}`,
      html: `<p>Hi ${req.user.name},</p><p>We've received your application for <strong>${job.title}</strong>. We'll notify you when your status changes.</p>`,
    });

    res.status(201).json({ application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }
    res.status(500).json({ message: "Failed to submit application", error: err.message });
  }
};

// @route GET /api/applications/mine   (Candidate only - their applications)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job", "title location jobType status")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// @route GET /api/applications/job/:jobId   (HR only, must own job - applicants for a job)
const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only view applicants for jobs you posted" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
};

// @route PATCH /api/applications/:id/status   (HR only, must own the related job)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["applied", "under review", "shortlisted", "rejected", "hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const application = await Application.findById(req.params.id)
      .populate("job", "title postedBy")
      .populate("candidate", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update applications for jobs you posted" });
    }

    application.status = status;
    await application.save();

    // Notify candidate of status change
    sendEmail({
      to: application.candidate.email,
      subject: `Application update: ${application.job.title}`,
      html: `<p>Hi ${application.candidate.name},</p><p>Your application status for <strong>${application.job.title}</strong> has been updated to: <strong>${status}</strong>.</p>`,
    });

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus };
