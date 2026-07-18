import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSubmitting(true);


    try {

      const user = await login(
        form.email,
        form.password
      );


      navigate(
        user.role === "hr"
          ?
          "/hr/dashboard"
          :
          "/candidate/dashboard"
      );


    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Login failed"
      );


    } finally {

      setSubmitting(false);

    }

  };



  return (

    <div className="
min-h-screen
bg-gradient-to-b
from-white
via-slate-50
to-white
flex
items-center
justify-center
px-6
py-16
">



      <div className="
max-w-6xl
w-full
min-h-[650px]
grid
md:grid-cols-2
rounded-3xl
overflow-hidden
border
border-slate-200
bg-white
shadow-xl
">





        {/* Left Branding */}

        <div className="
hidden
md:flex
bg-slate-950
text-white
p-14
flex-col
justify-between
">


          <div>


            <p className="
font-mono
text-xs
uppercase
tracking-[0.3em]
text-slate-400
mb-6
">
              Hirely Platform
            </p>



            <h2 className="
text-4xl
font-semibold
leading-tight
">
              Manage hiring.
              <br />
              Build careers.
            </h2>



            <p className="
mt-6
text-slate-400
leading-relaxed
">
              A centralized applicant tracking system
              built for recruiters and candidates.
            </p>


          </div>




          <p className="
text-sm
text-slate-500
">
            Professional hiring workflow management
          </p>


        </div>






        {/* Login Form */}

        <div className="
p-10
md:p-14
">


          <p className="
font-mono
text-xs
uppercase
tracking-[0.3em]
text-slate-500
mb-4
">
            Welcome back
          </p>



          <h1 className="
text-4xl
font-semibold
text-slate-950
mb-8
">
            Sign in
          </h1>




          <form

            onSubmit={handleSubmit}

            className="
space-y-6
"

          >


            <div>


              <label className="
block
text-sm
font-medium
mb-2
">
                Email address
              </label>



              <input

                type="email"

                required

                value={form.email}

                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }

                className="
w-full
h-12
rounded-xl
border
border-slate-300
px-4
outline-none
focus:border-slate-950
transition
"

              />


            </div>





            <div>


              <label className="
block
text-sm
font-medium
mb-2
">
                Password
              </label>



              <input

                type="password"

                required

                value={form.password}

                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }

                className="
w-full
h-12
rounded-xl
border
border-slate-300
px-4
outline-none
focus:border-slate-950
transition
"

              />


            </div>





            {error && (

              <p className="
text-sm
text-red-500
">
                {error}
              </p>

            )}




            <button

              type="submit"

              disabled={submitting}

              className="
w-full
h-12
rounded-xl
bg-slate-950
text-white
font-medium
hover:bg-slate-800
transition
disabled:opacity-50
"

            >

              {
                submitting
                  ?
                  "Signing in..."
                  :
                  "Sign In"
              }

            </button>




          </form>





          <p className="
text-sm
text-slate-600
mt-8
">


            Don't have an account?


            {" "}


            <Link

              to="/register"

              className="
font-medium
text-slate-950
underline
"

            >
              Create account
            </Link>



          </p>



        </div>



      </div>



    </div>


  );

};


export default Login;