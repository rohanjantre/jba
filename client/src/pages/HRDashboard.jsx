import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusStamp from "../components/StatusStamp";

const STATUS_OPTIONS = [
  "applied",
  "under review",
  "shortlisted",
  "rejected",
  "hired",
];

const HRDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);


  const fetchJobs = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/jobs/mine/list");
      setJobs(data.jobs);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchJobs();
  }, []);



  const openApplicants = async (job) => {

    setSelectedJob(job);
    setApplicantsLoading(true);

    try {
      const { data } = await api.get(
        `/applications/job/${job._id}`
      );

      setApplicants(data.applications);

    } finally {
      setApplicantsLoading(false);
    }
  };



  const updateStatus = async (
    applicationId,
    status
  ) => {

    const { data } =
      await api.patch(
        `/applications/${applicationId}/status`,
        { status }
      );


    setApplicants((prev) =>
      prev.map((a) =>
        a._id === applicationId
          ? {
            ...a,
            status: data.application.status,
          }
          : a
      )
    );

  };



  const deleteJob = async (jobId) => {

    if (
      !confirm(
        "Delete this job posting? This cannot be undone."
      )
    )
      return;


    await api.delete(`/jobs/${jobId}`);


    setJobs((prev) =>
      prev.filter(
        (j) => j._id !== jobId
      )
    );


    if (selectedJob?._id === jobId)
      setSelectedJob(null);

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
max-w-7xl
mx-auto
px-6
py-16
">


        {/* Header */}

        <div className="
flex
flex-col
md:flex-row
md:items-center
md:justify-between
gap-6
mb-12
">


          <div>

            <p className="
font-mono
text-xs
uppercase
tracking-[0.3em]
text-slate-500
mb-3
">
              Recruiter Workspace
            </p>


            <h1 className="
text-4xl
font-semibold
text-slate-950
">
              Manage your hiring pipeline
            </h1>


            <p className="
text-slate-600
mt-3
">
              Review applications, update candidate stages,
              and manage open positions.
            </p>

          </div>



          <Link
            to="/hr/jobs/new"
            className="
px-6
py-3
bg-slate-950
text-white
rounded-xl
font-medium
hover:bg-slate-800
transition
shadow-lg
"
          >
            Post New Position
          </Link>


        </div>





        {loading ? (

          <p className="
text-slate-500
font-mono
">
            Loading dashboard...
          </p>


        ) : jobs.length === 0 ? (

          <div className="
bg-white
border
border-slate-200
rounded-2xl
p-10
text-center
">

            <h3 className="
text-xl
font-semibold
">
              No job postings yet
            </h3>

            <p className="
text-slate-500
mt-2
">
              Create your first opening and start receiving applications.
            </p>

          </div>


        ) : (


          <div className="
grid
lg:grid-cols-5
gap-8
">



            {/* Jobs List */}

            <div className="
lg:col-span-2
space-y-4
">


              <h2 className="
font-semibold
text-lg
mb-4
">
                Active Positions
              </h2>



              {jobs.map((job) => (


                <div
                  key={job._id}
                  onClick={() => openApplicants(job)}
                  className={`
cursor-pointer
rounded-2xl
border
p-6
transition-all
duration-300

${selectedJob?._id === job._id

                      ?
                      "bg-slate-950 text-white border-slate-950 shadow-xl"

                      :

                      "bg-white border-slate-200 hover:border-slate-400 hover:shadow-lg"

                    }

`}
                >



                  <div className="
flex
justify-between
gap-3
">


                    <h3 className="
font-semibold
text-lg
">
                      {job.title}
                    </h3>


                    <StatusStamp status={job.status} />


                  </div>



                  <p className="
text-sm
mt-3
opacity-70
">
                    {job.location} · {job.jobType}
                  </p>



                  <div className="
flex
justify-between
items-center
mt-6
">


                    <span className="
text-xs
font-mono
opacity-70
">
                      {job.applicantCount}
                      applicants
                    </span>



                    <button

                      onClick={(e) => {
                        e.stopPropagation();
                        deleteJob(job._id);
                      }}

                      className="
text-xs
text-red-500
hover:underline
"
                    >
                      Delete
                    </button>


                  </div>


                </div>


              ))}



            </div>





            {/* Applicant Panel */}

            <div className="
lg:col-span-3
bg-white
rounded-3xl
border
border-slate-200
p-8
min-h-[500px]
">


              {!selectedJob ? (


                <div className="
h-full
flex
items-center
justify-center
text-slate-500
">

                  Select a position to view candidates

                </div>



              ) : (


                <>


                  <div className="
mb-8
">

                    <h2 className="
text-2xl
font-semibold
">
                      Applicants
                    </h2>


                    <p className="
text-slate-500
mt-1
">
                      {selectedJob.title}
                    </p>


                  </div>




                  {applicantsLoading ? (

                    <p className="
font-mono
text-sm
text-slate-500
">
                      Loading applicants...
                    </p>


                  ) : applicants.length === 0 ? (

                    <p className="
text-slate-500
">
                      No applicants yet.
                    </p>


                  ) : (


                    <div className="
space-y-5
">


                      {applicants.map((app) => (


                        <div
                          key={app._id}
                          className="
border
border-slate-200
rounded-2xl
p-6
hover:shadow-md
transition
"
                        >



                          <div className="
flex
justify-between
gap-5
">


                            <div>

                              <h3 className="
font-semibold
">
                                {app.candidate?.name}
                              </h3>


                              <p className="
text-sm
text-slate-500
">
                                {app.candidate?.email}
                              </p>


                            </div>


                            <StatusStamp status={app.status} />


                          </div>



                          {app.coverLetter && (

                            <p className="
text-sm
text-slate-600
mt-5
leading-relaxed
">
                              {app.coverLetter}
                            </p>

                          )}



                          <div className="
flex
items-center
gap-4
mt-6
">


                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="
text-sm
font-medium
text-slate-950
underline
"
                            >
                              View Resume
                            </a>



                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateStatus(
                                  app._id,
                                  e.target.value
                                )
                              }
                              className="
ml-auto
rounded-lg
border
border-slate-300
px-3
py-2
text-sm
bg-white
"
                            >

                              {
                                STATUS_OPTIONS.map((s) => (

                                  <option
                                    key={s}
                                    value={s}
                                  >
                                    {s}
                                  </option>

                                ))
                              }

                            </select>


                          </div>


                        </div>


                      ))}


                    </div>

                  )}



                </>


              )}


            </div>



          </div>


        )}



      </section>

    </div>


  );
};

export default HRDashboard;