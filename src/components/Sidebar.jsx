import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const {
    getContacts,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    newMessageFromUsers,
    getUnreadMessagesCount,
    unreadMessagesCount,
  } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (authUser) {
      const fetchContacts = async () => {
        if (!cancelled) await getContacts();
      };
      fetchContacts();
    }

    return () => {
      cancelled = true;
    };
  }, [authUser, getContacts]);

  useEffect(() => {
    if (users.length > 0) {
      getUnreadMessagesCount();
    }
  }, [users, getUnreadMessagesCount]);

  const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium block">Contacts</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            {/* avatar */}
            <div className="relative mx-0">
              {/* unread message count */}
              {unreadMessagesCount[user._id] > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
                  {unreadMessagesCount[user._id]}
                </div>
              )}

              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className={`size-12 object-cover rounded-full ${
                  newMessageFromUsers.includes(user._id) ? "ring-2 ring-green-500" : ""
                }`}
              />

              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* user info */}
            <div className="block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && <div className="text-center text-zinc-500 py-4">No online users</div>}
      </div>
    </aside>
  );
};

export default Sidebar;
