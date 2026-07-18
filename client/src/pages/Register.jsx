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
        "Registration failed"
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
py-12
">



      <div className="
max-w-6xl
w-full
grid
md:grid-cols-2
rounded-3xl
overflow-hidden
border
border-slate-200
bg-white
shadow-xl
">





        {/* Brand Section */}


        <div className="
hidden
md:flex
bg-slate-950
text-white
p-12
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
              Connect talent.
              <br />
              Create opportunities.
            </h2>



            <p className="
mt-6
text-slate-400
leading-relaxed
">
              Join a modern hiring ecosystem where
              companies discover talent and candidates
              find meaningful careers.
            </p>


          </div>




          <div className="
text-sm
text-slate-500
">
            Simple hiring. Better decisions.
          </div>


        </div>






        {/* Register Form */}

        <div className="
p-8
md:p-12
">


          <p className="
font-mono
text-xs
uppercase
tracking-[0.3em]
text-slate-500
mb-4
">
            Get started
          </p>



          <h1 className="
text-4xl
font-semibold
text-slate-950
mb-8
">
            Create account
          </h1>





          {/* Role Selector */}

          <div className="
grid
grid-cols-2
gap-4
mb-8
">


            <button

              type="button"

              onClick={() =>
                setForm({
                  ...form,
                  role: "candidate"
                })
              }

              className={`

h-12
rounded-xl
border
font-medium
transition

${form.role === "candidate"

                  ?

                  "bg-slate-950 text-white border-slate-950"

                  :

                  "border-slate-300 text-slate-600 hover:border-slate-950"

                }

`}

            >

              Candidate

            </button>





            <button

              type="button"

              onClick={() =>
                setForm({
                  ...form,
                  role: "hr"
                })
              }

              className={`

h-12
rounded-xl
border
font-medium
transition

${form.role === "hr"

                  ?

                  "bg-slate-950 text-white border-slate-950"

                  :

                  "border-slate-300 text-slate-600 hover:border-slate-950"

                }

`}

            >

              Recruiter

            </button>



          </div>






          <form

            onSubmit={handleSubmit}

            className="
space-y-5
"

          >



            <div>

              <label className="
block
text-sm
font-medium
mb-2
">
                Full name
              </label>


              <input

                required

                value={form.name}

                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
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
"

              />

            </div>







            {
              form.role === "hr" && (

                <div>

                  <label className="
block
text-sm
font-medium
mb-2
">
                    Company name
                  </label>



                  <input

                    value={form.company}

                    onChange={(e) =>
                      setForm({
                        ...form,
                        company: e.target.value
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
"

                  />


                </div>

              )

            }






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

                minLength={6}

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
"

              />


            </div>






            {
              error && (

                <p className="
text-sm
text-red-500
">
                  {error}
                </p>

              )

            }





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
                  "Creating account..."
                  :
                  "Create Account"
              }


            </button>



          </form>






          <p className="
text-sm
text-slate-600
mt-8
">

            Already have an account?


            {" "}


            <Link

              to="/login"

              className="
font-medium
text-slate-950
underline
"

            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>

  );

};


export default Register;