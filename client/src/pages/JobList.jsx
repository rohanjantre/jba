import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });



  const fetchJobs = async (page = 1) => {

    setLoading(true);

    try {

      const params = {
        page,
        limit: 10,
      };


      if (filters.search)
        params.search = filters.search;

      if (filters.location)
        params.location = filters.location;

      if (filters.jobType)
        params.jobType = filters.jobType;



      const { data } = await api.get(
        "/jobs",
        {
          params,
        }
      );


      setJobs(data.jobs);


      setPagination({

        page: data.pagination.page,
        pages: data.pagination.pages,
        total: data.pagination.total,

      });



    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };




  useEffect(() => {

    fetchJobs(1);

  }, []);



  const handleSearch = (e) => {

    e.preventDefault();

    fetchJobs(1);

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
            Career Opportunities
          </p>


          <h1 className="
text-5xl
font-semibold
text-slate-950
">
            Find your next opportunity
          </h1>


          <p className="
mt-4
text-lg
text-slate-600
max-w-2xl
">
            Explore open positions from companies looking
            for talented professionals.
          </p>



          <div className="
mt-6
inline-flex
px-4
py-2
rounded-full
bg-white
border
border-slate-200
text-sm
text-slate-600
">

            {pagination.total} open positions

          </div>


        </div>






        {/* Search Box */}

        <form

          onSubmit={handleSearch}

          className="
bg-white
border
border-slate-200
rounded-3xl
p-6
shadow-sm
mb-12
"


        >


          <div className="
grid
md:grid-cols-4
gap-4
">



            <input

              placeholder="Search job title or keyword"

              value={filters.search}

              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value
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



            <input

              placeholder="Location"

              value={filters.location}

              onChange={(e) =>
                setFilters({
                  ...filters,
                  location: e.target.value
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




            <select

              value={filters.jobType}

              onChange={(e) =>
                setFilters({
                  ...filters,
                  jobType: e.target.value
                })
              }

              className="
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


              <option value="">
                All job types
              </option>

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





            <button

              type="submit"

              className="
h-12
rounded-xl
bg-slate-950
text-white
font-medium
hover:bg-slate-800
transition
"

            >

              Search Jobs

            </button>




          </div>


        </form>






        {/* Job Results */}


        {

          loading ? (

            <div className="
text-slate-500
font-mono
">
              Loading opportunities...
            </div>


          )

            :

            jobs.length === 0 ? (

              <div className="
bg-white
border
border-slate-200
rounded-3xl
p-10
text-center
">

                <h3 className="
text-xl
font-semibold
">
                  No positions found
                </h3>


                <p className="
text-slate-500
mt-2
">
                  Try changing your search filters.
                </p>


              </div>


            )

              :

              (


                <div className="
space-y-5
">

                  {
                    jobs.map((job) => (

                      <div
                        key={job._id}
                        className="
transition
hover:-translate-y-1
duration-300
"
                      >

                        <JobCard job={job} />


                      </div>


                    ))
                  }


                </div>


              )


        }






        {/* Pagination */}


        {

          pagination.pages > 1 && (

            <div className="
flex
justify-center
items-center
gap-6
mt-12
">


              <button

                disabled={
                  pagination.page <= 1
                }

                onClick={() =>
                  fetchJobs(
                    pagination.page - 1
                  )
                }

                className="
px-5
py-2
rounded-xl
border
border-slate-300
disabled:opacity-40
hover:bg-slate-950
hover:text-white
transition
"

              >

                Previous

              </button>



              <span className="
text-sm
text-slate-500
font-mono
">

                Page {pagination.page}
                of {pagination.pages}

              </span>



              <button

                disabled={
                  pagination.page >= pagination.pages
                }

                onClick={() =>
                  fetchJobs(
                    pagination.page + 1
                  )
                }

                className="
px-5
py-2
rounded-xl
border
border-slate-300
disabled:opacity-40
hover:bg-slate-950
hover:text-white
transition
"

              >

                Next

              </button>


            </div>

          )

        }



      </section>


    </div>

  );

};


export default JobList;