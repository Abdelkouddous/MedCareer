import Wrapper from "../../../assets/wrappers/StatItem";
// // admin card of stats !!
// const AdminCard = ({
//   icon: Icon,
//   title,
//   value,
//   description,
//   trend,
//   color,
//   bgColor,
// }) => (
//   <Wrapper>
//     <div className=" rounded-lg shadow-sm p-6 border border-gray-100">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm  mb-1">{title}</p>
//           <h3 className="text-2xl font-bold mb-1">{value}</h3>
//           <p className="text-sm text-gray-500">{description}</p>
//         </div>
//         <div className="rounded-full p-3 bg-primary-50">
//           <Icon className="h-6 w-6 text-primary-500" />
//         </div>
//       </div>
//       {trend && (
//         <div className="mt-4 flex items-center text-sm">
//           <span
//             className={`font-medium ${
//               trend.isPositive ? "text-primary-500" : "text-red-600"
//             }`}
//           >
//             {trend.value}
//           </span>
//           <span className=" ml-2">{trend.text}</span>
//         </div>
//       )}
//     </div>
//   </Wrapper>
// );
// export default AdminCard;
// admin card of stats !!
const AdminCard = ({
  icon: Icon,
  title,
  value,
  description,
  trend,
  color,
  bgColor,
}) => (
  <Wrapper>
    <div className="rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm ">{title}</p>
          <h3 className="text-2xl font-bold  mb-1">{value}</h3>
          <p className="text-sm ">{description}</p>
        </div>
        <div className={`rounded-full p-3 ${color || "bg-blue-500"}`}>
          <Icon className="h-6 w-6 " />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={`font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.value}
          </span>
          <span className="ml-2 ">{trend.text}</span>
        </div>
      )}
    </div>
  </Wrapper>
);

export default AdminCard;
