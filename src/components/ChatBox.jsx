import { useEffect, useRef, useState } from "react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageBubbleContent from "./MessageBubbleContent";
import MessageInput from "./MessageInput/index";
import ImageViewer from "./ImageViewer";
import VideoViewer from "./VideoViewer";

import DoubleCheckIcon from "./icons/DoubleCheckIcon";
import SingleCheckIcon from "./icons/SingleCheckIcon";

import { formatMessageTime } from "../utils/timeFormat";

function ChatBox() {
  const { senderBubble, receiverBubble, chatWallpaper, chatWallpaperSize, chatWallpaperPosition, chatWallpaperRepeat } =
    useThemeStore();

  const { authUser, markAsRead } = useAuthStore();
  const { messages, getMessages, isMessagesLoading, selectedUser, isTyping } = useChatStore();

  const messageEndRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const isBlocked = selectedUser && authUser.blockedUsers.includes(selectedUser._id);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    markAsRead(selectedUser._id);
  }, [getMessages, selectedUser?._id, markAsRead]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput disabled />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {isBlocked ? (
        <div className="flex-1 flex items-center justify-center text-center p-4 text-sm text-red-500">
          You have blocked this user. Unblock them to continue the conversation.
        </div>
      ) : (
        <>
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              backgroundImage: chatWallpaper ? `url(${chatWallpaper})` : "none",
              backgroundSize: chatWallpaperSize,
              backgroundPosition: chatWallpaperPosition,
              backgroundRepeat: chatWallpaperRepeat,
              height: "100%",
              width: "100%",
            }}
          >
            {messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`px-5 py-2 flex mx-4 rounded-xl ${
                    message.senderId === authUser._id ? senderBubble : receiverBubble
                  }`}
                >
                  <MessageBubbleContent message={message} onImageClick={setActiveImage} onVideoClick={setActiveVideo} />

                  <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 pl-4 mt-auto">{formatMessageTime(message.createdAt)}</time>

                    {message.senderId === authUser._id && (
                      <div className="text-xs opacity-50 mt-auto">
                        {message.isRead ? (
                          <DoubleCheckIcon color={senderBubble} size={20} />
                        ) : (
                          <SingleCheckIcon color={senderBubble} size={16} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat chat-start">
                <div className="px-5 py-2 flex items-center mx-4 rounded-xl bg-gray-200 dark:bg-gray-700">
                  <div className="flex gap-1">
                    <span
                      className="dot w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <span
                      className="dot w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="dot w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {activeImage && <ImageViewer imageUrl={activeImage} onClose={() => setActiveImage(null)} />}
          {activeVideo && <VideoViewer videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />}
        </>
      )}

      <MessageInput disabled={isBlocked} />
    </div>
  );
}

export default ChatBox;
