import { FormRow, FormRowSelect } from "../components/";
// import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useLoaderData } from "react-router-dom";
import {
  JOB_STATUS,
  JOB_TYPE,
  MEDICAL_SPECIALIZATION,
} from "../../../../utils/constants";
import { Form, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { SubmitBtn } from "../components/SubmitBtn";

export const loader = async ({ params }) => {
  try {
    console.log("🔍 EditJob Loader - params:", params);
    console.log("🆔 Job ID:", params.id);

    const res = await customFetch.get(`/jobs/${params.id}`);

    // More detailed logging
    console.log("📡 Full Response:", res);
    console.log("📊 Response Data:", res.data);
    console.log("📋 Response Status:", res.status);
    console.log("🏗️ Data Structure:", JSON.stringify(res.data, null, 2));

    // Check if res.data has the job directly or nested
    if (res.data.job) {
      console.log("✅ Job found in res.data.job:", res.data.job);
      return res.data; // Return the whole response if job is nested
    } else if (res.data._id || res.data.id) {
      console.log("✅ Job found directly in res.data:", res.data);
      return { job: res.data }; // Wrap it in job property
    } else {
      console.log("❌ No job found in response");
      console.log("🔍 Available keys:", Object.keys(res.data));
    }

    return res.data;
  } catch (err) {
    console.error("❌ Loader Error:", err);
    console.error("❌ Error Response:", err?.response?.data);
    console.error("❌ Error Status:", err?.response?.status);

    toast.error(err?.response?.data?.msg || "Failed to load job");
    return redirect("/dashboard/all-jobs");
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  // problem was here
  //  if u use const {data } =Object.fromEntries(formData) so u will not update correctly
  const data = Object.fromEntries(formData);
  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success("Job updated successfully");
    return redirect("/dashboard/all-jobs");
    // return redirect(`/dashboard/edit-job/${params.id}`);
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg);
    return null;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();
  console.log(job);

  return (
    <Form method="post" className="form">
      <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-color)] mb-6">
        Edit
        <span className="text-[var(--primary-500)]"> Job</span>
      </h1>
      <div className="form-center">
        {/* <FormRow
            type="text"
            name="title"
            defaultValue={job.title}
            placeholder="Enter job title"
            disabled
          /> */}

        <FormRow
          type="text"
          name="position"
          labelText="Job Position"
          defaultValue={job?.position}
          placeholder="Enter job position"
        />
        <FormRow
          type="text"
          name="company"
          labelText="Hospital/Clinic"
          defaultValue={job?.company}
          placeholder="Enter company name"
        />
        <FormRow
          type="text"
          name="jobLocation"
          labelText="Job Location"
          defaultValue={job?.jobLocation}
          placeholder="Enter location"
        />
        <FormRowSelect
          name="jobStatus"
          labelText="Job Status"
          defaultValue={job?.jobStatus}
          list={Object.values(JOB_STATUS)}
        />
        <FormRowSelect
          name="jobType"
          labelText="Job Type"
          defaultValue={job?.jobType}
          list={Object.values(JOB_TYPE)}
        />
        <FormRowSelect
          type="text"
          name="specialization"
          labelText="Medical Speciality"
          defaultValue={job?.specialization}
          list={Object.values(MEDICAL_SPECIALIZATION)}
        />
        <FormRow
          type="textarea"
          name="notes"
          labelText="Edit Notes"
          defaultValue={job?.notes}
          placeholder="Enter notes"
          className="p-3"
        />
      </div>
      <SubmitBtn formBtn />
    </Form>
  );
};

export default EditJob;
