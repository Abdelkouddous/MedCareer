import { redirect } from "react-router";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ params }) => {
  try {
    console.log(`deleted job with id ${params.id}`);
    const res = await customFetch.delete(`/jobs/${params.id}`);
    console.log(res.data);
    toast.success("Job Deleted");
    return redirect("/dashboard/all-jobs");
  } catch (error) {
    toast.error("Could not delete job");
    return error?.response?.data?.msg;
  }
};

const DeleteJob = () => {
  return <div>Job deleted successfully... Redirecting to all jobs page</div>;
};

export default DeleteJob;
