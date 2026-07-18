import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ledger mb-4">
        01 · Post · 02 · Apply · 03 · Track
      </p>
      <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] mb-6">
        Hiring, tracked
        <br />
        end to end.
      </h1>
      <p className="text-lg text-slate-650 max-w-xl mb-10">
        Hirely is a lightweight applicant tracking system. Employers post roles
        and manage applicants in one place; candidates apply and follow their
        status from submission to offer.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/jobs"
          className="px-5 py-2.5 bg-ink text-paper rounded-sm hover:bg-ledger transition-colors"
        >
          Browse open roles
        </Link>
        {!user && (
          <Link
            to="/register"
            className="px-5 py-2.5 border border-ink rounded-sm hover:bg-ink hover:text-paper transition-colors"
          >
            Create an account
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-20 border-t border-ink/10 pt-10">
        {[
          { stamp: "applied", label: "Submit", desc: "Upload a resume, add a cover note, apply in seconds." },
          { stamp: "under review", label: "Track", desc: "Every status change is logged and emailed to you." },
          { stamp: "hired", label: "Land it", desc: "Employers move candidates through a clear pipeline." },
        ].map((item) => (
          <div key={item.label}>
            <span className={`stamp border-ledger text-ledger mb-3`}>{item.stamp}</span>
            <h3 className="font-display font-semibold mt-3">{item.label}</h3>
            <p className="text-sm text-slate-650 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
