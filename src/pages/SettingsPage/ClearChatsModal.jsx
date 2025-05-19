import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { axiosInstance } from "../../utils/axios";
import { useChatStore } from "../../store/useChatStore";

const ClearChatsModal = ({ isOpen, onClose, userId = null }) => {
  const [isSending, setIsSending] = useState(false);
  const [onlyForMe, setOnlyForMe] = useState(false);
  const [forUserId, setForUserId] = useState("");
  const [permission, setPermission] = useState(false);
  const { users: contacts } = useChatStore();

  useEffect(() => {
    setPermission(false);
    setOnlyForMe(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (userId) {
        setForUserId(userId);
      }
    }
  }, [userId, isOpen]);

  if (!isOpen) return null;

  const handleClearChats = async () => {
    setIsSending(true);
    try {
      await axiosInstance.patch("/messages/deleteMany", {
        onlyForMe,
        forUserId,
      });

      toast.success("Chats deleted successfully.");
    } catch (err) {
      toast.error(err.response.data.message || "Failed to delete chats.");
    } finally {
      setIsSending(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md relative z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 hover:bg-black text-white p-1 rounded-full"
          disabled={isSending}
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Clear Chats</h2>

        {/* user selector */}
        {!userId && (
          <label className="block mb-3 text-sm">
            Select user (optional)
            <select
              value={forUserId}
              onChange={(e) => setForUserId(e.target.value)}
              className="mt-1 block w-full border border-zinc-700 rounded p-2 bg-base-200"
              disabled={isSending}
            >
              <option value="">All Contacts</option>
              {contacts.length !== 0 &&
                contacts.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.nickname}
                  </option>
                ))}
            </select>
          </label>
        )}

        {/* only for me  */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={onlyForMe}
            onChange={() => setOnlyForMe((prev) => !prev)}
            disabled={isSending}
          />
          Only delete my messages
        </label>

        {/* permission  */}
        <label className="flex items-center gap-2 mb-4 mt-10">
          <input
            type="checkbox"
            checked={permission}
            onChange={() => setPermission((prev) => !prev)}
            disabled={isSending}
          />
          I understand that this action is irreversible and will result in the permanent deletion of all chat history
          associated with the selected option.{" "}
        </label>

        {/* action buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleClearChats}
            className="cursor-pointer px-4 py-2 bg-blue-500 rounded text-white  hover:bg-blue-700 disabled:opacity-50"
            disabled={isSending || !permission}
          >
            {isSending ? <Loader2 className="animate-spin size-4" /> : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500"
            disabled={isSending}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-40" onClick={onClose} />
    </div>
  );
};

export default ClearChatsModal;
