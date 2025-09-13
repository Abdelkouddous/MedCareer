import { Form, Link, useSubmit, useSearchParams } from "react-router-dom";
import { SearchFormWrapper } from "../../assets/wrappers/AllJobsWrapper";
import {
  JOB_TYPE,
  JOB_STATUS,
  JOB_SORT_BY,
  MEDICAL_SPECIALIZATION,
} from "../../../../utils/constants";
import FormRowSelect from "./FormRowSelect";
import FormRow from "./FormRow";

export const SearchContainer = () => {
  // component logic
  const debounce = (onChange) => {
    let timeOut;
    clearTimeout(timeOut);

    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        onChange(form);
      }, 500);
    };
  };
  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const current = {
    search: searchParams.get("search") || "",
    jobStatus: searchParams.get("jobStatus") || "all",
    jobType: searchParams.get("jobType") || "all",
    specialization: searchParams.get("specialization") || "all",
    sort: searchParams.get("sort") || "latest",
  };
  // return the component
  return (
    <div className="search-container">
      <SearchFormWrapper>
        <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-color)] mb-6">
          Medical Job
          <span className="text-[var(--primary-500)]"> Search</span>
        </h1>
        <Form className="form" method="GET">
          <div className="form-center">
            <div className="form-row">
              <FormRow
                type="search"
                id="search"
                name="search"
                className="form-input"
                placeholder="Search by position or company"
                defaultValue={current.search}
                onChange={
                  debounce((form) => {
                    submit(form);
                  })
                  // submit(e.currentTarget.form);
                }
              />
            </div>

            <div className="form-row">
              <FormRowSelect
                name="jobStatus"
                id="jobStatus"
                className="form-select"
                defaultValue={current.jobStatus}
                onChange={(e) => {
                  submit(e.currentTarget.form);
                }}
                list={["all", ...Object.values(JOB_STATUS)]}
              >
                {/* <option value="all">All</option> */}
              </FormRowSelect>
            </div>

            <div className="form-row">
              <FormRowSelect
                name="specialization"
                id="specialization"
                className="form-select"
                defaultValue={current.specialization}
                list={["all", ...Object.values(MEDICAL_SPECIALIZATION)]}
                onChange={(e) => {
                  submit(e.currentTarget.form);
                }}
              ></FormRowSelect>
            </div>

            <div className="form-row">
              <FormRowSelect
                name="jobType"
                id="jobType"
                className="form-select"
                defaultValue={current.jobType}
                list={["all", ...Object.values(JOB_TYPE)]}
              ></FormRowSelect>
            </div>

            <div className="form-row">
              <FormRowSelect
                name="sort"
                id="sort"
                className="form-select"
                defaultValue={current.sort}
                list={Object.values(JOB_SORT_BY)}
                onChange={(e) => {
                  submit(e.currentTarget.form);
                }}
              ></FormRowSelect>
            </div>

            <Link to="/dashboard/all-jobs" className="btn btn-block">
              Clear
            </Link>
          </div>
        </Form>{" "}
      </SearchFormWrapper>
    </div>
  );
};

export default SearchContainer;
