import { Form, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  JOB_STATUS,
  JOB_TYPE,
  MEDICAL_SPECIALIZATION,
} from "../../../../utils/constants";
import { FormRow, FormRowSelect } from "../components";
import customFetch from "../../utils/customFetch";
import { SubmitBtn } from "../components/SubmitBtn";

// position: {
//       type: String,
//     },
//     company: {
//       type: String,
//     },
//     jobLocation: {
//       type: String,
//     },
//     jobType: {
//       type: String,
//       enum: Object.values(JOB_TYPE),
//       default: JOB_TYPE.FULL_TIME,
//     },
//     jobStatus: {
//       type: String,
//       enum: Object.values(JOB_STATUS),
//       default: JOB_STATUS.PENDING,
//     },
//     // med spec
//     specialization: {
//       type: String,
//       enum: Object.values(MEDICAL_SPECIALIZATION),
//       default: MEDICAL_SPECIALIZATION.GENERAL,
//     },
//     applicationDate: {
//       type: Date,
//     },
//     notes: {
//       type: String,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await customFetch.post("/jobs", data);
    if (response.status === 201) {
      toast.success("Job added successfully");
    }
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

export const AddJob = () => {
  const { user } = useOutletContext();

  return (
    <div>
      <Form method="post" className="form">
        <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-color)] mb-6">
          Add Medical
          <span className="text-[var(--primary-500)]"> Position</span>
        </h1>
        <div className="form-center">
          {/* Position */}
          <FormRow
            type="text"
            name="position"
            labelText="Position Title"
            defaultValue={user.position}
            placeholder={"Your position"}
          />
          <FormRow
            type="text"
            name="company"
            labelText="Company Name"
            defaultValue={user.company}
            placeholder={"Your company"}
          />
          <FormRow
            type="text"
            name="jobLocation"
            labelText="Job Location"
            defaultValue={user.jobLocation}
            placeholder={"Your location"}
          />
          <FormRowSelect
            name="jobType"
            labelText="Job Type"
            list={Object.values(JOB_TYPE)}
            defaultValue={user.jobType}
            options={JOB_TYPE}
          />
          <FormRowSelect
            name="jobStatus"
            labelText="Job Status"
            list={Object.values(JOB_STATUS)}
            defaultValue={user.jobStatus}
            options={JOB_STATUS}
          />
          <FormRowSelect
            name="specialization"
            labelText="Medical Specialization"
            defaultValue={user.specialization}
            list={Object.values(MEDICAL_SPECIALIZATION)}
          />
          <FormRow
            type="date"
            name="applicationDate"
            labelText="Application Date"
            defaultValue={user.applicationDate}
            placeholder={"Your application date"}
          />

          <FormRow
            type="text"
            name="notes"
            labelText="Notes"
            defaultValue={user.notes}
            placeholder={"Your notes"}
          />
        </div>
        <SubmitBtn fromBtn>Add Job</SubmitBtn>
      </Form>
    </div>
  );
};

export default AddJob;

// // export const action = async ({ request }) => {
// //   const formData = await request.formData();
// //   const data = Object.fromEntries(formData);
// //   try {
// //     const response = await customFetch.post("/jobs", data);
// //     if (response.status === 201) {
// //       toast.success("Job added successfully");
// //     }
// //     return response;
// //   } catch (error) {
// //     toast.error(error?.response?.data?.msg);
// //     return error;
// //   }
// // };
// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const data = Object.fromEntries(formData);
//   try {
//     await customFetch.post("/jobs", data);
//     toast.success("Added job successfully");
//     return redirect("/dashboard/all-jobs");
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Something went wrong");
//     return error;
//   }
// };

// const AddJob = () => {
//   const { user } = useOutletContext();

//   const navigation = useNavigation();
//   const isSubmitting = navigation.state === "submitting";

//   return (
//     <Wrapper>
//       <Form method="post" className="form">
//         <h4 className="form-title">Add Medical Position</h4>
//         <div className="form-center">
//           {/* Position */}
//           <FormRow
//             type="text"
//             name="position"
//             labelText="Position Title"
//             defaultValue={user.position}
//             placeholder={"Your position"}
//           />

//           {/* Company/Hospital */}
//           <FormRow
//             type="text"
//             name="company"
//             labelText="Hospital/Clinic"
//             defaultValue={user.company}
//             placeholder={"Your company"}
//           />

//           <FormRow
//             type="text"
//             name="jobLocation"
//             labelText="Job Location"
//             defaultValue={user.jobLocation}
//             placeholder={"Your location"}
//           />

//           {/* Medical Specialization */}
//           <FormRowSelect
//             name="specialization"
//             labelText="Medical Specialization"
//             defaultValue={user.specialization}
//             list={Object.values(MEDICAL_SPECIALIZATION)}
//           />

//           {/* Job Status */}
//           <FormRowSelect
//             name="jobStatus"
//             labelText="Job Status"
//             defaultValue={user.jobStatus}
//             list={Object.values(JOB_STATUS)}
//           />

//           {/* Job Type */}
//           <FormRowSelect
//             name="jobType"
//             labelText="Position Type"
//             defaultValue={user.jobType}
//             list={Object.values(JOB_TYPE)}
//           />

//           {/* Additional Fields */}
//           <FormRow
//             type="date"
//             name="applicationDate"
//             labelText="Application Date"
//             defaultValue={user.applicationDate}
//           />

//           <FormRow
//             type="textarea"
//             name="notes"
//             labelText="Additional Notes"
//             defaultValue={user.notes}
//             className="form-textarea"
//             placeholder={"Extra hours will be payed per hour"}
//           />

//           <button
//             type="submit"
//             className="btn btn-block form-btn"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "Submit Application"}
//           </button>
//         </div>
//       </Form>
//     </Wrapper>
//   );
// };

// export default AddJob;
