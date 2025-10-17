import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  Email,
  MarkEmailRead,
  CheckCircle,
  Info,
  Warning,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { PageWrapper } from "../../assets/wrappers/AllJobsWrapper";

function InboxJobSeeker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    try {
      const res = await customFetch.get("/jobseekers/notifications");
      setItems(res.data.notifications || []);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await customFetch.patch(`/jobseekers/notifications/${id}/read`, null);
      setItems((list) =>
        list.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      const unreadIds = items
        .filter((item) => !item.read)
        .map((item) => item._id);

      await Promise.all(
        unreadIds.map((id) =>
          customFetch.patch(`/jobseekers/notifications/${id}/read`, null)
        )
      );

      setItems((list) => list.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type.toLowerCase()) {
      case "success":
      case "accepted":
        return <CheckCircle className="text-green-500" />;
      case "warning":
        return <Warning className="text-yellow-500" />;
      case "error":
      case "rejected":
        return <ErrorIcon className="text-red-500" />;
      default:
        return <Info className="text-blue-500" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type.toLowerCase()) {
      case "success":
      case "accepted":
        return "border-l-4 border-green-500 bg-green-50";
      case "warning":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "error":
      case "rejected":
        return "border-l-4 border-red-500 bg-red-50";
      default:
        return "border-l-4 border-blue-500 bg-blue-50";
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "read") return item.read;
    return true;
  });

  const unreadCount = items.filter((item) => !item.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
            Inbox
          </h1>
          <p className="text-[var(--text-secondary-color)]">
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "All caught up!"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-hipster mt-4 sm:mt-0">
            <MarkEmailRead className="mr-2" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--grey-200)]">
        {[
          { key: "all", label: "All", count: items.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "read", label: "Read", count: items.length - unreadCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              filter === tab.key
                ? "border-[var(--primary-500)] text-[var(--primary-500)] font-medium"
                : "border-transparent text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Email className="mx-auto mb-4 text-6xl text-[var(--grey-400)]" />
            <h3 className="text-xl font-semibold text-[var(--text-secondary-color)] mb-2">
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                ? "No read notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-[var(--text-secondary-color)]">
              {filter === "all" &&
                "Notifications will appear here when you receive them"}
            </p>
          </div>
        ) : (
          filteredItems.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border border-[var(--grey-200)] transition-all duration-300 hover:shadow-md ${
                !notification.read
                  ? "bg-[var(--background-secondary-color)]"
                  : "bg-[var(--grey-50)]"
              } ${getNotificationStyle(notification.type)}`}
              style={{
                boxShadow: !notification.read ? "var(--shadow-1)" : "none",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold ${
                          !notification.read
                            ? "text-[var(--text-color)]"
                            : "text-[var(--text-secondary-color)]"
                        }`}
                      >
                        {notification.type}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[var(--primary-500)] rounded-full"></span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        !notification.read
                          ? "text-[var(--text-color)]"
                          : "text-[var(--text-secondary-color)]"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-[var(--text-secondary-color)] mt-2">
                      {new Date(
                        notification.createdAt || Date.now()
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!notification.read && (
                  <button
                    className="btn-hipster text-sm px-3 py-1"
                    onClick={() => markRead(notification._id)}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredItems.length > 0 && (
        <div className="mt-6 text-center text-[var(--text-secondary-color)] text-sm">
          Showing {filteredItems.length} of {items.length} notifications
        </div>
      )}
    </PageWrapper>
  );
}

export default InboxJobSeeker;
