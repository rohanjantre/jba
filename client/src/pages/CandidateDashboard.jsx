import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusStamp from "../components/StatusStamp";

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications/mine")
      .then(({ data }) => setApplications(data.applications))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-ledger mb-2">Your progress</p>
      <h1 className="font-display text-3xl font-semibold mb-8">My applications</h1>

      {loading ? (
        <p className="font-mono text-sm text-slate-650">Loading…</p>
      ) : applications.length === 0 ? (
        <p className="text-slate-650">
          You haven't applied to anything yet.{" "}
          <Link to="/jobs" className="text-ledger hover:underline">
            Browse open roles
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app._id}
              className="flex items-center justify-between border border-ink/10 rounded-sm p-4"
            >
              <div>
                <Link
                  to={`/jobs/${app.job?._id}`}
                  className="font-display font-semibold hover:text-ledger transition-colors"
                >
                  {app.job?.title || "Job removed"}
                </Link>
                <p className="text-sm text-slate-650">
                  {app.job?.location} · Applied {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusStamp status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
