import { X, Plus, Minus, UserMinus, UserPlus, BookX } from "lucide-react";
import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ClearChatsModal from "../pages/SettingsPage/ClearChatsModal";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser, removeFromContacts, addToContacts, blockUser, unblockUser } = useAuthStore();

  const [showClearChat, setShowClearChat] = useState(false);

  if (!selectedUser) return null;

  const isContact = authUser.contacts.includes(selectedUser._id);
  const isBlocked = authUser.blockedUsers.includes(selectedUser._id);
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
              </div>
            </div>

            <div>
              <h3 className="font-medium">{selectedUser.name}</h3>
              <p className="text-sm text-base-content/70">{isOnline ? "Online" : ""}</p>
            </div>
          </div>
        </div>

        <div>
          {/* add contact */}
          <button
            className="btn btn-sm"
            title={isContact ? "Remove from contacts" : "Add to contacts"}
            onClick={() => (isContact ? removeFromContacts(selectedUser._id) : addToContacts(selectedUser._id))}
          >
            {isContact ? <Minus size={16} /> : <Plus size={16} />}
          </button>

          {/* block */}
          <button
            className="btn btn-sm"
            title={isBlocked ? "Unblock user" : "Block user"}
            onClick={() => (isBlocked ? unblockUser(selectedUser._id) : blockUser(selectedUser._id))}
          >
            {isBlocked ? <UserPlus size={16} /> : <UserMinus size={16} />}
          </button>

          {/* clear history */}
          <button className="btn btn-sm" title="Clear chat history" onClick={() => setShowClearChat(true)}>
            <BookX size={16} />
          </button>

          <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-sm" title="Close chat">
            <X size={18} />
          </button>

          <ClearChatsModal isOpen={showClearChat} onClose={() => setShowClearChat(false)} userId={selectedUser._id} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
