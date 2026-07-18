import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "Full-time",
    category: "",
    salaryMin: "",
    salaryMax: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      const { data } = await api.post("/jobs", payload);
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-ledger mb-2">New posting</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Post a job</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1.5">Job title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Description</label>
          <textarea
            required
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Requirements (one per line)</label>
          <textarea
            rows={4}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1.5">Location</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5">Job type</label>
            <select
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1.5">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5">Salary min</label>
            <input
              type="number"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5">Salary max</label>
            <input
              type="number"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1.5">Application deadline</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
          />
        </div>

        {error && <p className="text-sm text-rose-stamp">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper py-2.5 rounded-sm hover:bg-ledger transition-colors disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Post job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
