import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      stamp: "01",
      label: "Submit",
      desc: "Candidates apply with their profile, resume, and professional details in seconds.",
    },
    {
      stamp: "02",
      label: "Track",
      desc: "Monitor every application stage with a transparent hiring workflow.",
    },
    {
      stamp: "03",
      label: "Hire",
      desc: "Move the right candidates through your pipeline with confidence.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">

        <div className="max-w-4xl">

          <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-500 mb-6">
            Applicant Tracking System · Hiring Workflow · Talent Management
          </p>


          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight text-slate-950">
            Hiring,
            <br />
            managed from
            <br />
            application to offer.
          </h1>


          <p className="mt-8 text-lg md:text-xl leading-relaxed text-slate-600 max-w-2xl">
            Hirely helps companies manage recruitment efficiently and allows
            candidates to track their journey through every hiring stage.
            One platform for modern hiring teams.
          </p>


          <div className="flex flex-wrap gap-4 mt-10">

            <Link
              to="/jobs"
              className="
              px-7 py-3.5
              bg-slate-950
              text-white
              rounded-xl
              font-medium
              transition-all
              duration-300
              hover:bg-slate-800
              hover:-translate-y-1
              shadow-lg
              shadow-slate-300
              "
            >
              Browse Open Roles
            </Link>


            {!user && (
              <Link
                to="/register"
                className="
                px-7 py-3.5
                border
                border-slate-300
                rounded-xl
                font-medium
                text-slate-800
                transition-all
                duration-300
                hover:bg-slate-950
                hover:text-white
                hover:border-slate-950
                "
              >
                Create Account
              </Link>
            )}

          </div>

        </div>


        {/* Workflow Cards */}

        <div className="
        grid
        md:grid-cols-3
        gap-6
        mt-24
        ">

          {features.map((item) => (

            <div
              key={item.label}
              className="
              group
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-7
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
              hover:border-slate-300
              "
            >

              <span
                className="
                inline-flex
                text-xs
                font-mono
                tracking-widest
                text-slate-500
                mb-6
                "
              >
                {item.stamp}
              </span>


              <h3
                className="
                text-2xl
                font-semibold
                text-slate-950
                mb-3
                "
              >
                {item.label}
              </h3>


              <p
                className="
                text-sm
                leading-relaxed
                text-slate-600
                "
              >
                {item.desc}
              </p>

            </div>

          ))}

        </div>


        {/* Bottom Highlight */}

        <div
          className="
          mt-20
          rounded-3xl
          bg-slate-950
          px-8
          py-12
          md:px-14
          flex
          flex-col
          md:flex-row
          justify-between
          gap-8
          items-center
          "
        >

          <div>

            <h2
              className="
              text-3xl
              md:text-4xl
              font-semibold
              text-white
              "
            >
              Build a smarter hiring process.
            </h2>

            <p
              className="
              mt-3
              text-slate-300
              max-w-xl
              "
            >
              Reduce hiring complexity with a centralized platform designed
              for recruiters and candidates.
            </p>

          </div>


          <Link
            to="/jobs"
            className="
            bg-white
            text-slate-950
            px-6
            py-3
            rounded-xl
            font-medium
            hover:bg-slate-200
            transition
            "
          >
            Explore Jobs
          </Link>

        </div>


      </section>

    </div>
  );
};

export default Home;