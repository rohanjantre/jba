import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusStamp from "../components/StatusStamp";

const STATUS_OPTIONS = ["applied", "under review", "shortlisted", "rejected", "hired"];

const HRDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs/mine/list");
      setJobs(data.jobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openApplicants = async (job) => {
    setSelectedJob(job);
    setApplicantsLoading(true);
    try {
      const { data } = await api.get(`/applications/job/${job._id}`);
      setApplicants(data.applications);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    const { data } = await api.patch(`/applications/${applicationId}/status`, { status });
    setApplicants((prev) =>
      prev.map((a) => (a._id === applicationId ? { ...a, status: data.application.status } : a))
    );
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    if (selectedJob?._id === jobId) setSelectedJob(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ledger mb-2">HR dashboard</p>
          <h1 className="font-display text-3xl font-semibold">Your postings</h1>
        </div>
        <Link
          to="/hr/jobs/new"
          className="px-4 py-2 bg-ink text-paper rounded-sm hover:bg-ledger transition-colors text-sm"
        >
          + Post a job
        </Link>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-slate-650">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-650">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className={`border rounded-sm p-4 cursor-pointer transition-colors ${
                  selectedJob?._id === job._id ? "border-ledger bg-ledger/5" : "border-ink/10 hover:border-ink/30"
                }`}
                onClick={() => openApplicants(job)}
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display font-semibold">{job.title}</h3>
                  <StatusStamp status={job.status} />
                </div>
                <p className="text-sm text-slate-650 mt-1">{job.location} · {job.jobType}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-mono text-xs text-slate-650">
                    {job.applicantCount} applicant{job.applicantCount === 1 ? "" : "s"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteJob(job._id);
                    }}
                    className="text-xs text-rose-stamp hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            {!selectedJob ? (
              <p className="text-slate-650 text-sm">Select a job to view applicants.</p>
            ) : (
              <div>
                <h2 className="font-display text-lg font-semibold mb-4">
                  Applicants — {selectedJob.title}
                </h2>
                {applicantsLoading ? (
                  <p className="font-mono text-sm text-slate-650">Loading…</p>
                ) : applicants.length === 0 ? (
                  <p className="text-slate-650 text-sm">No applicants yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((app) => (
                      <div key={app._id} className="border border-ink/10 rounded-sm p-4">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold">{app.candidate?.name}</p>
                            <p className="text-sm text-slate-650">{app.candidate?.email}</p>
                          </div>
                          <StatusStamp status={app.status} />
                        </div>
                        {app.coverLetter && (
                          <p className="text-sm text-ink/80 mt-2 whitespace-pre-line">{app.coverLetter}</p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-ledger hover:underline"
                          >
                            View resume ↗
                          </a>
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="ml-auto text-xs border border-ink/20 rounded-sm px-2 py-1 bg-white"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
