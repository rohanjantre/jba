import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateJob = () => {

  const navigate = useNavigate();


  const [form, setForm] = useState({

    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "Full-time",
    category: "",
    salaryMin: "",
    salaryMax: "",
    deadline: "",

  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {

        ...form,

        requirements:
          form.requirements
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean),
        salaryMin:
          form.salaryMin
            ? Number(form.salaryMin)
            : undefined,

        salaryMax:
          form.salaryMax
            ? Number(form.salaryMax)
            : undefined,


      };

      const { data } = await api.post(
        "/jobs",
        payload
      );

      navigate(
        `/jobs/${data.job._id}`
      );


    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to create job"
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
">
      <section className="
max-w-5xl
mx-auto
px-6
py-16
">
        {/* Header */}

        <div className="
mb-12
">
          <p className="
font-mono
text-xs
uppercase
tracking-[0.3em]
text-slate-500
mb-4
">
            Recruiter Portal
          </p>
          <h1 className="
text-5xl
font-semibold
text-slate-950
">
            Create a new position
          </h1>
          <p className="
mt-4
text-slate-600
max-w-2xl
">
            Publish a professional job listing and start
            receiving applications from candidates.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}

          className="
bg-white
border
border-slate-200
rounded-3xl
p-8
md:p-12
shadow-sm
space-y-10
"

        >
          {/* Basic Information */}

          <div>

            <h2 className="
text-xl
font-semibold
mb-6
">
              Position Information
            </h2>
            <div className="
space-y-6
">
              <div>
                <label className="
block
text-sm
font-medium
mb-2
">
                  Job title
                </label>
                <input

                  required

                  value={form.title}

                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value
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
                  Description
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value
                    })
                  }

                  className="
w-full
rounded-xl
border
border-slate-300
p-4
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
                  Requirements
                </label>
                <p className="
text-xs
text-slate-500
mb-2
">
                  Add each requirement on a new line.
                </p>
                <textarea
                  rows={5}
                  value={form.requirements}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requirements: e.target.value
                    })
                  }
                  className="
w-full
rounded-xl
border
border-slate-300
p-4
outline-none
focus:border-slate-950
"

                />
              </div>
            </div>
          </div>
          {/* Job Details */}


          <div>


            <h2 className="
text-xl
font-semibold
mb-6
">
              Job Details
            </h2>
            <div className="
grid
md:grid-cols-2
gap-6
">
              <div>
                <label className="
block
text-sm
font-medium
mb-2
">
                  Location
                </label>
                <input
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value
                    })
                  }
                  className="
w-full
h-12
rounded-xl
border
border-slate-300
px-4
focus:border-slate-950
outline-none
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
                  Employment type
                </label>
                <select
                  value={form.jobType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobType: e.target.value
                    })
                  }

                  className="
w-full
h-12
rounded-xl
border
border-slate-300
px-4
bg-white
outline-none
focus:border-slate-950
"

                >
                  <option>
                    Full-time
                  </option>
                  <option>
                    Part-time
                  </option>
                  <option>
                    Contract
                  </option>
                  <option>
                    Internship
                  </option>
                  <option>
                    Remote
                  </option>
                </select>
              </div>
            </div>
          </div>
          {/* Compensation */}

          <div>
            <h2 className="
text-xl
font-semibold
mb-6
">
              Additional Information
            </h2>
            <div className="
grid
md:grid-cols-3
gap-6
">
              <div>
                <label className="
block
text-sm
font-medium
mb-2
">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value
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
                  Minimum salary
                </label>
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      salaryMin: e.target.value
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
"/>
              </div>
              <div>

                <label className="
block
text-sm
font-medium
mb-2
">
                  Maximum salary
                </label>
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      salaryMax: e.target.value
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
            </div>
          </div>
          <div>

            <label className="
block
text-sm
font-medium
mb-2
">
              Application deadline
            </label>
            <input

              type="date"

              value={form.deadline}

              onChange={(e) =>
                setForm({
                  ...form,
                  deadline: e.target.value
                })
              }
              className="
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
          {error && (

            <p className="
text-sm
text-red-500
">
              {error}
            </p>

          )}
          <button
            disabled={submitting}

            className="
w-full
h-14
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
                "Publishing..."
                :
                "Publish Job"
            }
          </button>
        </form>
      </section>
    </div>
  );


};


export default CreateJob;