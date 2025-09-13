const RecentActivityItem = ({ title, time, status, type }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center">
      <div
        className={`w-2 h-2 rounded-full ${
          status === "completed"
            ? "bg-green-500"
            : status === "pending"
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      />
      <div className="ml-3">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        type === "user"
          ? "bg-blue-100 text-blue-800"
          : type === "order"
          ? "bg-green-100 text-green-800"
          : "bg-purple-100 text-purple-800"
      }`}
    >
      {type}
    </span>
  </div>
);

export default RecentActivityItem;
