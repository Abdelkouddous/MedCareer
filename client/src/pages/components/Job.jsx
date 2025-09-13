// import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import Wrapper from "../../assets/wrappers/Job";
// import JobInfo from "../components/JobInfo";
// import { Form } from "react-router-dom";
// import day from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// day.extend(advancedFormat);

// const Job = ({
//   _id,
//   position,
//   company,
//   jobLocation,
//   jobType,
//   createdAt,
//   jobStatus,
// }) => {
//   const date = day(createdAt).format("MMM Do, YYYY");

//   return (
//     <Wrapper>
//       <header>
//         <div className="main-icon">{company.charAt(0)}</div>
//         <div className="info">
//           <h5>{position}</h5>
//           <p>{company}</p>
//         </div>
//       </header>
//       <div className="content">
//         <div className="content-center">
//           <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
//           <JobInfo icon={<FaCalendarAlt />} text={date} />
//           <JobInfo icon={<FaBriefcase />} text={jobType} />
//           <div className={`status ${jobStatus}`}>{jobStatus}</div>
//         </div>

//         <footer className="actions">
//           <Link className="btn edit-btn">Edit</Link>
//           <Form>
//             <button type="submit" className="btn delete-btn">
//               Delete
//             </button>
//           </Form>
//         </footer>
//       </div>
//     </Wrapper>
//   );
// };

// export default Job;

import {
  FaLocationArrow,
  FaBriefcase,
  FaCalendarAlt,
  FaHandHoldingMedical,
  FaNotesMedical,
  FaRegEye,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import JobInfo from "../components/JobInfo";
import { Form } from "react-router-dom";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import Wrapper from "../../assets/wrappers/Job";
import { MdOutlinePendingActions } from "react-icons/md";

day.extend(advancedFormat);

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  jobStatus,
  specialization,
  notes,
}) => {
  const date = day(createdAt).format("MMM DD, YYYY");
  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          {jobStatus === "pending" ? (
            <JobInfo
              icon={<MdOutlinePendingActions className="pending" />}
              text={jobStatus.toUpperCase()}
              className="pending"
            />
          ) : jobStatus === "interview" ? (
            <JobInfo
              icon={<FaRegEye className="interview" />}
              text={jobStatus.toUpperCase()}
              className="interview"
            />
          ) : (
            <JobInfo
              icon={<FaCheckCircle className="success" />}
              text={jobStatus.toUpperCase()}
              className="success"
            />
          )}

          {/* <JobInfo icon={<MdOutlinePendingActions />} text={jobStatus} /> */}

          {/* <div className={`status ${jobStatus}`}>{jobStatus}</div> */}
          <JobInfo icon={<FaHandHoldingMedical />} text={specialization} />

          {/* <div className="notes">{notes}</div> */}
          <JobInfo icon={<FaNotesMedical />} text={notes} />
        </div>
        <footer className="actions">
          <Link className="btn edit-btn " to={`/dashboard/edit-job/${_id}`}>
            {/* to={`/${_id}`}> */}
            Edit
          </Link>
          <Form method="POST" action={`/dashboard/delete-job/${_id}`}>
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
