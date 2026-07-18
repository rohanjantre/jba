import { Link } from "react-router-dom";
import StatusStamp from "./StatusStamp";

const formatSalary = (min, max) => {
  if (!min && !max) return null;
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  return `$${(min || max).toLocaleString()}+`;
};

const JobCard = ({ job }) => {
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group flex items-start gap-4 border-b border-ink/10 py-5 hover:bg-ink/[0.02] transition-colors -mx-4 px-4"
    >
      <div className="w-1 self-stretch bg-ledger/70 group-hover:bg-ledger transition-colors" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg font-semibold truncate">{job.title}</h3>
          <span className="font-mono text-xs text-slate-650 whitespace-nowrap">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-slate-650 mt-1">
          {job.postedBy?.company || job.postedBy?.name} · {job.location} · {job.jobType}
        </p>
        <div className="flex items-center gap-3 mt-3">
          {job.category && (
            <span className="font-mono text-xs uppercase tracking-widest text-slate-650">
              {job.category}
            </span>
          )}
          {salary && <span className="font-mono text-xs text-ledger">{salary}</span>}
          {job.applicantCount !== undefined && (
            <StatusStamp status={job.status} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
