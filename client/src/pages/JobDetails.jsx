import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusStamp from "../components/StatusStamp";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [applyStatus, setApplyStatus] = useState({
    submitting: false,
    error: "",
    success: false,
  });


  useEffect(() => {

    api
      .get(`/jobs/${id}`)
      .then(({ data }) => setJob(data.job))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));

  }, [id]);



  const handleApply = async (e) => {
    e.preventDefault();

    if (!resume) {

      setApplyStatus({
        submitting: false,
        error: "Please attach a resume file",
        success: false
      });

      return;
    }


    setApplyStatus({
      submitting: true,
      error: "",
      success: false
    });


    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("coverLetter", coverLetter);


    try {

      await api.post(
        `/applications/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );


      setApplyStatus({
        submitting: false,
        error: "",
        success: true
      });


    } catch (err) {

      setApplyStatus({
        submitting: false,
        error:
          err.response?.data?.message ||
          "Failed to submit application",
        success: false
      });

    }

  };



  if (loading)

    return (

      <div className="px-6 py-20 text-slate-500">
        Loading job details...
      </div>

    );



  if (!job)

    return (

      <div className="px-6 py-20 text-slate-500">
        Job not found.
      </div>

    );



  return (

    <div className="
min-h-screen
bg-gradient-to-b
from-white
via-slate-50
to-white
">


      <section className="
max-w-6xl
mx-auto
px-6
py-16
">



        {/* Job Header */}

        <div className="
bg-slate-950
rounded-3xl
p-8
md:p-12
text-white
shadow-xl
">


          <div className="
flex
flex-col
md:flex-row
justify-between
gap-6
">


            <div>


              <p className="
text-xs
uppercase
tracking-[0.3em]
text-slate-400
font-mono
mb-5
">
                Open Position
              </p>



              <h1 className="
text-4xl
md:text-5xl
font-semibold
leading-tight
">
                {job.title}
              </h1>


              <p className="
mt-5
text-slate-300
text-lg
">
                {job.postedBy?.company ||
                  job.postedBy?.name}
              </p>


              <p className="
mt-2
text-slate-400
">
                {job.location} · {job.jobType}
              </p>


            </div>


            <StatusStamp status={job.status} />


          </div>


        </div>





        {/* Main Content */}

        <div className="
grid
lg:grid-cols-3
gap-10
mt-10
">



          {/* Description */}

          <div className="
lg:col-span-2
space-y-10
">


            <div className="
bg-white
border
border-slate-200
rounded-3xl
p-8
">

              <h2 className="
text-2xl
font-semibold
mb-5
">
                About this role
              </h2>


              <p className="
text-slate-600
leading-relaxed
whitespace-pre-line
">
                {job.description}
              </p>


            </div>




            {job.requirements?.length > 0 && (

              <div className="
bg-white
border
border-slate-200
rounded-3xl
p-8
">


                <h2 className="
text-2xl
font-semibold
mb-5
">
                  Requirements
                </h2>



                <ul className="
space-y-3
">

                  {
                    job.requirements.map((r, i) => (

                      <li
                        key={i}
                        className="
text-slate-600
border-b
border-slate-100
pb-3
"
                      >
                        {r}
                      </li>

                    ))
                  }

                </ul>


              </div>

            )}



          </div>





          {/* Apply Section */}

          <div>


            <div className="
bg-white
border
border-slate-200
rounded-3xl
p-8
sticky
top-8
">


              <h2 className="
text-2xl
font-semibold
mb-6
">
                Apply Now
              </h2>



              {!user && (

                <p className="
text-slate-600
">

                  <button

                    onClick={() => navigate("/login")}

                    className="
font-medium
underline
text-slate-950
"
                  >
                    Login
                  </button>

                  {" "}
                  as a candidate to continue.

                </p>

              )}




              {user?.role === "hr" && (

                <p className="
text-slate-500
font-mono
text-sm
">
                  HR accounts cannot apply.
                </p>

              )}




              {user?.role === "candidate" &&
                job.status === "open" &&
                !applyStatus.success && (


                  <form
                    onSubmit={handleApply}
                    className="
space-y-6
"
                  >


                    <div>

                      <label className="
text-sm
font-medium
block
mb-2
">
                        Resume
                      </label>


                      <label className="
block
border
border-dashed
border-slate-300
rounded-xl
p-5
cursor-pointer
hover:border-slate-500
transition
">


                        <input

                          type="file"

                          accept=".pdf,.doc,.docx"

                          onChange={(e) =>
                            setResume(e.target.files[0])
                          }

                          className="hidden"

                        />


                        <span className="
text-sm
text-slate-500
">
                          {
                            resume
                              ?
                              resume.name
                              :
                              "Upload PDF or Word document"
                          }
                        </span>


                      </label>


                    </div>




                    <div>

                      <label className="
text-sm
font-medium
block
mb-2
">
                        Cover Letter
                      </label>


                      <textarea

                        rows={5}

                        value={coverLetter}

                        onChange={(e) =>
                          setCoverLetter(e.target.value)
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




                    {applyStatus.error && (

                      <p className="
text-sm
text-red-500
">
                        {applyStatus.error}
                      </p>

                    )}



                    <button

                      disabled={applyStatus.submitting}

                      className="
w-full
bg-slate-950
text-white
py-3
rounded-xl
font-medium
hover:bg-slate-800
transition
disabled:opacity-50
"

                    >

                      {
                        applyStatus.submitting
                          ?
                          "Submitting..."
                          :
                          "Submit Application"
                      }


                    </button>


                  </form>


                )}





              {applyStatus.success && (

                <div className="
bg-slate-100
rounded-xl
p-5
text-center
font-medium
">
                  Application submitted successfully.
                </div>

              )}





              {job.status !== "open" && (

                <p className="
text-slate-500
text-sm
">
                  This role is no longer accepting applications.
                </p>

              )}



            </div>


          </div>



        </div>


      </section>


    </div>

  );

};


export default JobDetails;