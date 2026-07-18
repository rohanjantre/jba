const express = require("express");
const router = express.Router();
const {
  applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const upload = require("../middleware/upload");

// Candidate only
router.post("/:jobId", protect, authorize("candidate"), upload.single("resume"), applyToJob);
router.get("/mine", protect, authorize("candidate"), getMyApplications);

// HR only
router.get("/job/:jobId", protect, authorize("hr"), getApplicationsForJob);
router.patch("/:id/status", protect, authorize("hr"), updateApplicationStatus);

module.exports = router;
