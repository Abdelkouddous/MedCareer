import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const ChatWindow = ({ jobId, currentUser, recipientUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const isDevelopment = import.meta.env.MODE === "development";
    const socketURL = isDevelopment ? "http://localhost:5100" : "/";
    const newSocket = io(socketURL);
    setSocket(newSocket);

    const initChat = async () => {
      try {
        // 1. Get conversation ID
        const convRes = await customFetch.get(`/messages/get-conversation/${jobId}`);
        const cid = convRes.data?.conversation?._id;
        if (cid) {
          setConversationId(cid);
          // Join socket room
          newSocket.emit("join_chat", cid);
          // 2. Fetch messages
          const msgRes = await customFetch.get(`/messages/get-messages/${cid}`);
          setMessages(msgRes.data?.messages || []);
        }
      } catch (error) {
        if (error?.response?.status !== 404) {
          // 404 just means no conversation exists yet, ignore
          console.error("Failed to load chat:", error);
        }
      }
    };

    if (jobId && recipientUser) {
      initChat();
    }

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => newSocket.disconnect();
  }, [jobId, recipientUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipientUser) return;

    try {
      const { data } = await customFetch.post("/messages/send-message", {
        content: newMessage,
        receiverId: recipientUser._id,
        receiverModel: recipientUser.role || "JobSeeker",
        jobId: jobId,
      });

      // Optimistically update conversation ID if it's the first message
      let currentConvId = conversationId;
      if (!currentConvId && data.message?.conversationId) {
        currentConvId = data.message.conversationId;
        setConversationId(currentConvId);
        socket?.emit("join_chat", currentConvId);
      }

      if (socket && currentConvId) {
        socket.emit("send_message", {
          conversationId: currentConvId,
          message: data.message,
        });
      }

      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white shadow-md relative w-full lg:w-[400px]">
      <div className="p-4 bg-[var(--primary-500)] text-white font-bold rounded-t-lg shadow-sm">
        Chat with {recipientUser?.name || "User"}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="m-auto text-gray-400 text-sm">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isSender =
              msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;
            return (
              <div
                key={msg._id}
                className={`max-w-[75%] p-3 rounded-lg text-sm shadow-sm ${
                  isSender
                    ? "bg-[var(--primary-500)] text-white self-end rounded-br-none"
                    : "bg-white border text-[var(--text-color)] self-start rounded-bl-none"
                }`}
              >
                <div className="text-xs opacity-75 mb-1 font-semibold flex justify-between gap-2">
                  <span>{isSender ? "You" : msg.sender?.name || recipientUser?.name}</span>
                  <span className="text-[10px] font-normal">
                    {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t rounded-b-lg flex gap-2 items-center"
      >
        <input
          type="text"
          className="flex-1 p-2 border rounded-md focus:outline-none focus:border-[var(--primary-500)] text-sm"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-[var(--primary-500)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-600)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
