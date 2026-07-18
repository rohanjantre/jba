import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    company: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(user.role === "hr" ? "/hr/dashboard" : "/candidate/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-ledger mb-2">Get started</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Create an account</h1>

      <div className="flex gap-2 mb-6">
        {["candidate", "hr"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setForm({ ...form, role: r })}
            className={`flex-1 py-2 rounded-sm border font-mono text-xs uppercase tracking-widest transition-colors ${
              form.role === r
                ? "bg-ink text-paper border-ink"
                : "border-ink/20 text-slate-650 hover:border-ink/40"
            }`}
          >
            {r === "hr" ? "I'm hiring" : "I'm job hunting"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1.5">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
          />
        </div>

        {form.role === "hr" && (
          <div>
            <label className="block text-sm mb-1.5">Company</label>
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus:border-ledger outline-none"
          />
        </div>

        {error && <p className="text-sm text-rose-stamp">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper py-2.5 rounded-sm hover:bg-ledger transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-slate-650 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-ledger hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
