import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusStamp from "../components/StatusStamp";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyStatus, setApplyStatus] = useState({ submitting: false, error: "", success: false });

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => setJob(data.job))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setApplyStatus({ submitting: false, error: "Please attach a resume file", success: false });
      return;
    }
    setApplyStatus({ submitting: true, error: "", success: false });

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("coverLetter", coverLetter);

    try {
      await api.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApplyStatus({ submitting: false, error: "", success: true });
    } catch (err) {
      setApplyStatus({
        submitting: false,
        error: err.response?.data?.message || "Failed to submit application",
        success: false,
      });
    }
  };

  if (loading) return <p className="font-mono text-sm text-slate-650 px-6 py-14">Loading…</p>;
  if (!job) return <p className="px-6 py-14 text-slate-650">Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="font-display text-4xl font-semibold">{job.title}</h1>
        <StatusStamp status={job.status} />
      </div>
      <p className="text-slate-650 mb-8">
        {job.postedBy?.company || job.postedBy?.name} · {job.location} · {job.jobType}
      </p>

      <div className="prose-sm whitespace-pre-line text-ink/90 leading-relaxed mb-8">
        {job.description}
      </div>

      {job.requirements?.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-3">Requirements</h2>
          <ul className="list-disc list-inside space-y-1 text-ink/90">
            {job.requirements.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-ink/10 pt-8">
        {!user && (
          <p className="text-slate-650">
            <button onClick={() => navigate("/login")} className="text-ledger hover:underline">
              Log in
            </button>{" "}
            as a candidate to apply for this role.
          </p>
        )}

        {user?.role === "hr" && (
          <p className="text-slate-650 font-mono text-sm">HR accounts cannot apply to jobs.</p>
        )}

        {user?.role === "candidate" && job.status === "open" && !applyStatus.success && (
          <form onSubmit={handleApply} className="space-y-5">
            <h2 className="font-display text-lg font-semibold">Apply for this role</h2>
            <div>
              <label className="block text-sm mb-1.5">Resume (PDF or Word, max 5MB)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5">Cover letter (optional)</label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
              />
            </div>
            {applyStatus.error && <p className="text-sm text-rose-stamp">{applyStatus.error}</p>}
            <button
              type="submit"
              disabled={applyStatus.submitting}
              className="px-5 py-2.5 bg-ink text-paper rounded-sm hover:bg-ledger transition-colors disabled:opacity-50"
            >
              {applyStatus.submitting ? "Submitting…" : "Submit application"}
            </button>
          </form>
        )}

        {applyStatus.success && (
          <p className="stamp border-ledger text-ledger">Application submitted</p>
        )}

        {job.status !== "open" && (
          <p className="text-slate-650 font-mono text-sm">This role is no longer accepting applications.</p>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
