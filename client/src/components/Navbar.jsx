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

    <header className="
    sticky
    top-0
    z-50
    bg-white/80
    backdrop-blur-xl
    border-b
    border-slate-200
    ">

      <div className="
       max-w-7xl
       mx-auto
       px-6
       h-20
       flex 
       items-center
       justify-between
       ">

        {/* Brand */}
        <Link
          to="/"
          className="
        flex
        items-center
        gap-3
        group
        "
        >
          <div>
            <h1 className="
        text-2xl
        font-semibold
        tracking-tight
        text-slate-950
        group-hover:text-slate-700
        transition
        ">
              Hirely
            </h1>
            <p className="
        hidden
        sm:block
        text-[10px]
        font-mono
        uppercase
        tracking-[0.3em]
        text-slate-500
        ">
              Applicant Tracking System
            </p>
          </div>
        </Link>
        {/* Navigation */}
        <nav className="
         flex
         items-center
         gap-6
         text-sm
         font-medium
         ">

          <Link
            to="/jobs"
            className="
           text-slate-600
           hover:text-slate-950
          transition
         "
          >
            Jobs
          </Link>
          {
            user?.role === "hr" && (
              <>
                <Link
                  to="/hr/dashboard"
                  className="
                text-slate-600
                hover:text-slate-950
                transition
                "
                >
                  Dashboard
                </Link>
                <Link
                  to="/hr/jobs/new"
                  className="
                 px-5
                 py-2.5
                 rounded-xl
                 bg-slate-950
                 text-white
                 hover:bg-slate-800
                 transition
                  "
                >
                  Post Job
                </Link>
              </>
            )
          }
          {
            user?.role === "candidate" && (
              <Link
                to="/candidate/dashboard"

                className="
                 text-slate-600
                  hover:text-slate-950
                  transition
                 "
              >
                Applications
              </Link>
            )
          }
          {
            user ? (
              <div className="
flex
items-center
gap-4
pl-6
border-l
border-slate-200
">
                <div className="
hidden
md:block
text-right
">
                  <p className="
text-sm
font-medium
text-slate-950
">
                    {user.name}
                  </p>
                  <p className="
text-xs
text-slate-500
capitalize
">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="
text-sm
text-red-500
hover:text-red-700
transition
"
                >
                  Logout
                </button>
              </div>
            )
              :
              (
                <div className="
flex
items-center
gap-4
pl-6
border-l
border-slate-200
">
                  <Link
                    to="/login"
                    className="
text-slate-600
hover:text-slate-950
transition
"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="
px-5
py-2.5
rounded-xl
bg-slate-950
text-white
hover:bg-slate-800
transition
"                  >
                    Get Started
                  </Link>
                </div>

              )
          }
        </nav>
      </div>
    </header>
  );
};


export default Navbar;