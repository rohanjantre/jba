const express = require("express");
const router = express.Router();
const {
  createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

// Public
router.get("/", getJobs);

// HR only - must come before /:id to avoid route collision
router.get("/mine/list", protect, authorize("hr"), getMyJobs);
router.post("/", protect, authorize("hr"), createJob);
router.put("/:id", protect, authorize("hr"), updateJob);
router.delete("/:id", protect, authorize("hr"), deleteJob);

// Public - single job detail
router.get("/:id", getJobById);

module.exports = router;
