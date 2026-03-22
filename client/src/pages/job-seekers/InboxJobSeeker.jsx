import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  Email,
  MarkEmailRead,
  CheckCircle,
  Info,
  Warning,
  Error as ErrorIcon,
  Send,
  Chat,
  Notifications,
  ArrowBack,
} from "@mui/icons-material";

function InboxJobSeeker() {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 border-b border-[var(--border-color)]">
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === "messages"
              ? "border-[var(--primary-500)] text-[var(--primary-500)]"
              : "border-transparent text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
          }`}
        >
          <Chat fontSize="small" />
          Messages
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === "notifications"
              ? "border-[var(--primary-500)] text-[var(--primary-500)]"
              : "border-transparent text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
          }`}
        >
          <Notifications fontSize="small" />
          Notifications
        </button>
      </div>

      {activeTab === "messages" ? <MessagesPanel /> : <NotificationsPanel />}
    </div>
  );
}

// ─── Messages Panel (LinkedIn-style) ──────────────────────────────────────────

function MessagesPanel() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await customFetch.get("/jobseekers/me");
        setCurrentUser(data.jobSeeker);
      } catch {
        // silent
      }
    };
    fetchUser();
  }, []);

  // Socket connection
  useEffect(() => {
    const isDev = import.meta.env.MODE === "development";
    const socketURL = isDev ? "http://localhost:5100" : "/";
    const newSocket = io(socketURL);
    setSocket(newSocket);

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
      // Update conversation list last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === data.conversationId
            ? {
                ...c,
                lastMessage: {
                  content: data.message.content,
                  createdAt: data.message.createdAt,
                  senderModel: data.message.senderModel,
                },
              }
            : c
        )
      );
    });

    return () => newSocket.disconnect();
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await customFetch.get("/jobseekers/conversations");
        setConversations(data.conversations || []);
      } catch {
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      setMsgLoading(true);
      try {
        const { data } = await customFetch.get(
          `/jobseekers/messages/${activeConv._id}`
        );
        setMessages(data.messages || []);
        // Join socket room
        socket?.emit("join_chat", activeConv._id);
        // Reset unread count in local state
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConv._id ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch {
        toast.error("Failed to load messages");
      } finally {
        setMsgLoading(false);
      }
    };
    fetchMessages();
  }, [activeConv?._id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    try {
      const { data } = await customFetch.post("/jobseekers/messages/send", {
        content: newMessage,
        receiverId: activeConv.employerId?._id,
        jobId: activeConv.jobId?._id,
      });

      socket?.emit("send_message", {
        conversationId: activeConv._id,
        message: data.message,
      });

      setMessages((prev) => [...prev, data.message]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConv._id
            ? {
                ...c,
                lastMessage: {
                  content: newMessage,
                  createdAt: new Date().toISOString(),
                  senderModel: "JobSeeker",
                },
              }
            : c
        )
      );
      setNewMessage("");
    } catch (error) {
      toast.error(
        error?.response?.data?.msg || "Failed to send message"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-16">
        <Chat
          style={{ fontSize: 64 }}
          className="mx-auto mb-4 text-[var(--grey-400)]"
        />
        <h3 className="text-xl font-semibold text-[var(--text-secondary-color)] mb-2">
          No conversations yet
        </h3>
        <p className="text-[var(--text-secondary-color)]">
          When an employer accepts your application, you'll be able to chat
          with them here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex rounded-xl overflow-hidden border border-[var(--border-color)]"
      style={{
        height: "calc(100vh - 220px)",
        minHeight: "500px",
        background: "var(--surface-primary)",
      }}
    >
      {/* ── Left Panel: Conversation List ── */}
      <div
        className={`${
          activeConv ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-[340px] border-r border-[var(--border-color)]`}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-color)] m-0">
            Messaging
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const employer = conv.employerId;
            const job = conv.jobId;
            const isActive = activeConv?._id === conv._id;
            const lastMsg = conv.lastMessage;

            return (
              <button
                key={conv._id}
                onClick={() => setActiveConv(conv)}
                className={`w-full text-left p-4 flex gap-3 items-start transition-all border-b border-[var(--border-color)] hover:bg-[var(--background-secondary-color)] ${
                  isActive
                    ? "bg-[var(--background-secondary-color)] border-l-2 border-l-[var(--primary-500)]"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--primary-500)] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {employer?.name?.charAt(0)?.toUpperCase() || "E"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-[var(--text-color)] truncate">
                      {employer?.name} {employer?.lastName}
                    </span>
                    {lastMsg?.createdAt && (
                      <span className="text-[10px] text-[var(--text-secondary-color)] flex-shrink-0 ml-2">
                        {new Date(lastMsg.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary-color)] truncate mt-0.5">
                    {job?.position} — {job?.company}
                  </p>
                  {lastMsg && (
                    <p className="text-xs text-[var(--text-secondary-color)] truncate mt-1">
                      {lastMsg.senderModel === "JobSeeker" ? "You: " : ""}
                      {lastMsg.content}
                    </p>
                  )}
                </div>

                {/* Unread Badge */}
                {conv.unreadCount > 0 && (
                  <span className="bg-[var(--primary-500)] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel: Active Conversation ── */}
      <div
        className={`${
          activeConv ? "flex" : "hidden md:flex"
        } flex-col flex-1`}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[var(--border-color)] bg-[var(--surface-primary)]">
              <button
                onClick={() => setActiveConv(null)}
                className="md:hidden text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
              >
                <ArrowBack />
              </button>
              <div className="w-9 h-9 rounded-full bg-[var(--primary-500)] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {activeConv.employerId?.name?.charAt(0)?.toUpperCase() || "E"}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-color)] m-0">
                  {activeConv.employerId?.name}{" "}
                  {activeConv.employerId?.lastName}
                </h3>
                <p className="text-xs text-[var(--text-secondary-color)] m-0">
                  {activeConv.jobId?.position} — {activeConv.jobId?.company}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ background: "var(--background-secondary-color)" }}
            >
              {msgLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="loading"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[var(--text-secondary-color)] text-sm">
                  No messages yet — start the conversation!
                </div>
              ) : (
                messages.map((msg) => {
                  const isSender =
                    msg.sender?._id === currentUser?._id ||
                    msg.sender === currentUser?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isSender
                            ? "bg-[var(--primary-500)] text-white rounded-br-md"
                            : "bg-[var(--surface-primary)] text-[var(--text-color)] border border-[var(--border-color)] rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words m-0">
                          {msg.content}
                        </p>
                        <p
                          className={`text-[10px] mt-1 m-0 ${
                            isSender
                              ? "text-white/70 text-right"
                              : "text-[var(--text-secondary-color)]"
                          }`}
                        >
                          {msg.createdAt &&
                            new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-[var(--border-color)] bg-[var(--surface-primary)] flex gap-2 items-center"
            >
              <input
                type="text"
                className="flex-1 p-2.5 rounded-full bg-[var(--background-secondary-color)] border border-[var(--border-color)] text-sm text-[var(--text-color)] focus:outline-none focus:border-[var(--primary-500)] transition-colors"
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-9 h-9 rounded-full bg-[var(--primary-500)] text-white flex items-center justify-center hover:bg-[var(--primary-600)] transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send fontSize="small" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Chat
              style={{ fontSize: 56 }}
              className="text-[var(--grey-300)] mb-4"
            />
            <h3 className="text-lg font-semibold text-[var(--text-secondary-color)] mb-1">
              Select a conversation
            </h3>
            <p className="text-sm text-[var(--text-secondary-color)]">
              Choose a conversation from the left to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notifications Panel (Preserved from original) ───────────────────────────

function NotificationsPanel() {
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
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
    </div>
  );
}

export default InboxJobSeeker;
