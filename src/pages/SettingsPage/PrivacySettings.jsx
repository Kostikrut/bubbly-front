import { useEffect, useState } from "react";
import { Trash2, Download, EyeOff, UserMinus } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../utils/axios";
import setErrorToast from "../../utils/errorToast";
import ClearChatsModal from "./ClearChatsModal";

const PrivacySettings = () => {
  const { unblockUser, authUser, updateOnlineStatus } = useAuthStore();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isPreparingExport, setIsPreparingExport] = useState(false);
  const [showClearChats, setShowClearChats] = useState(false);

  useEffect(() => {
    const getBlockedUsers = async () => {
      const res = await axiosInstance.get("/users/blockedusers");
      if (res.status !== 200) return;

      setBlockedUsers(res.data.data.users);
    };

    getBlockedUsers();
  }, []);

  const toggleOnlineStatus = async () => {
    updateOnlineStatus({ showOnlineStatus: !authUser.showOnlineStatus });
  };

  const handleDownloadData = async () => {
    setIsPreparingExport(true);
    try {
      const res = await axiosInstance.get("/users/export", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "chat-export.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorToast(err, "Failed to download your data.");
    } finally {
      setIsPreparingExport(false);
    }
  };

  const handleUnblock = (id) => {
    unblockUser(id);
    setBlockedUsers((prev) => prev.filter((user) => user._id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg text-blue-500 font-semibold">Privacy Settings</h1>

      {/* controls */}
      <div className="flex flex-col gap-7">
        <div>
          <button className="btn btn-primary w-full " onClick={() => setShowClearChats(true)}>
            <Trash2 size={18} className="mr-2" />
            Clear Chats History
          </button>

          <ClearChatsModal isOpen={showClearChats} onClose={() => setShowClearChats(false)} />
        </div>

        {isPreparingExport ? (
          <button className="btn btn-primary w-full" disabled>
            <div className="mr-2  loading self-center" />
            Preparing Export File...
          </button>
        ) : (
          <button className="btn btn-primary w-full" onClick={handleDownloadData}>
            <Download size={18} className="mr-2" />
            Download My Data
          </button>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox"
            checked={!authUser.showOnlineStatus}
            onChange={toggleOnlineStatus}
          />
          <EyeOff size={18} />
          Hide Online Status
        </label>
      </div>

      {/* blocked users */}
      <div>
        <h3 className="font-semibold mt-6 mb-2">Blocked Users</h3>
        {blockedUsers.length === 0 ? (
          <p className="text-sm text-base-content/60">You haven’t blocked anyone.</p>
        ) : (
          <ul className="space-y-2">
            {blockedUsers.map((user) => (
              <li
                key={user}
                className="flex justify-between items-center border border-base-300 rounded p-3 text-sm bg-base-100"
              >
                <span>{user.name}</span>
                <span>{user.nickname}</span>
                <button className="btn btn-sm btn-outline btn-error" onClick={() => handleUnblock(user._id)}>
                  <UserMinus size={16} className="mr-1" />
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;
