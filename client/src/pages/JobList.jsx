import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", location: "", jobType: "" });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;

      const { data } = await api.get("/jobs", { params });
      setJobs(data.jobs);
      setPagination({ page: data.pagination.page, pages: data.pagination.pages, total: data.pagination.total });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-ledger mb-2">
        {pagination.total} open roles
      </p>
      <h1 className="font-display text-4xl font-semibold mb-8">Find your next role</h1>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-10">
        <input
          placeholder="Search title, keyword…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="flex-1 min-w-[180px] border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
        />
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-40 border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
        />
        <select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          className="border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
        >
          <option value="">All types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 bg-ink text-paper rounded-sm hover:bg-ledger transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="font-mono text-sm text-slate-650">Loading roles…</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-650">No open roles match your search right now.</p>
      ) : (
        <div>
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center gap-3 mt-8 font-mono text-sm">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchJobs(pagination.page - 1)}
            className="disabled:opacity-30 hover:text-ledger"
          >
            ← Prev
          </button>
          <span className="text-slate-650">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchJobs(pagination.page + 1)}
            className="disabled:opacity-30 hover:text-ledger"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;
