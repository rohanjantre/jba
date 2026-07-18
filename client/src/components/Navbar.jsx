import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-ink/10 bg-paper sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">Hirely</span>
          <span className="font-mono text-[0.65rem] text-slate-650 uppercase tracking-widest hidden sm:inline">
            Applicant Tracking
          </span>
        </Link>

        <nav className="flex items-center gap-6 font-body text-sm">
          <Link to="/jobs" className="hover:text-ledger transition-colors">
            Browse jobs
          </Link>

          {user?.role === "hr" && (
            <>
              <Link to="/hr/dashboard" className="hover:text-ledger transition-colors">
                Dashboard
              </Link>
              <Link
                to="/hr/jobs/new"
                className="px-3 py-1.5 border border-ink text-ink rounded-sm hover:bg-ink hover:text-paper transition-colors"
              >
                Post a job
              </Link>
            </>
          )}

          {user?.role === "candidate" && (
            <Link to="/candidate/dashboard" className="hover:text-ledger transition-colors">
              My applications
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-ink/10">
              <span className="font-mono text-xs text-slate-650">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-rose-stamp hover:underline"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-ink/10">
              <Link to="/login" className="hover:text-ledger transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 bg-ledger text-paper rounded-sm hover:bg-ink transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
