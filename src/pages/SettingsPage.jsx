import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import ColorPicker from "../components/ColorPicker";
import setErrorToast from "../utils/errorToast";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const {
    senderBubble,
    receiverBubble,
    setSenderBubble,
    setReceiverBubble,
    setChatWallpaper,
    chatWallpaper,
    chatWallpaperSize,
    chatWallpaperPosition,
    chatWallpaperRepeat,
    setChatWallpaperSize,
    setChatWallpaperPosition,
    setChatWallpaperRepeat,
    resetChatWallpaper,
  } = useThemeStore();

  const [activePicker, setActivePicker] = useState(null);
  const [wallpaper, setWallpaper] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!wallpaper) return;
    setChatWallpaper(wallpaper);
  }, [wallpaper, setChatWallpaper]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setErrorToast(null, "Invalid file type. Please select an image.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setErrorToast(null, "File size exceeds 1MB. Please select a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setWallpaper(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Bubble Colors</h2>
            <p className="text-sm text-base-content/70">Choose colors for your message bubbles.</p>
          </div>

          {/* colors */}
          <div className="flex flex-wrap gap-4">
            <button className={`btn btn-outline ${receiverBubble}`} onClick={() => setActivePicker("receiver")}>
              Choose Receiver Color
            </button>
            <button className={`btn btn-outline ${senderBubble}`} onClick={() => setActivePicker("sender")}>
              Choose Sender Color
            </button>

            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
              Update Chat Wallpaper
            </button>
          </div>

          {/* wallpaper settings */}
          {chatWallpaper && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Wallpaper Settings</h2>

              <div className="form-control">
                <label className="label mx-3">
                  <span className="label-text">Wallpaper Size</span>
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={chatWallpaperSize}
                  onChange={(e) => setChatWallpaperSize(e.target.value)}
                >
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label mx-3">
                  <span className="label-text">Wallpaper Position</span>
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={chatWallpaperPosition}
                  onChange={(e) => setChatWallpaperPosition(e.target.value)}
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="top left">Top Left</option>
                  <option value="top right">Top Right</option>
                  <option value="bottom left">Bottom Left</option>
                  <option value="bottom right">Bottom Right</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label mx-3">
                  <span className="label-text">Wallpaper Repeat</span>
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={chatWallpaperRepeat}
                  onChange={(e) => setChatWallpaperRepeat(e.target.value)}
                >
                  <option value="no-repeat">No Repeat</option>
                  <option value="repeat">Repeat</option>
                  <option value="repeat-x">Repeat X</option>
                  <option value="repeat-y">Repeat Y</option>
                </select>
              </div>

              <button className="btn btn-error mt-2" onClick={resetChatWallpaper}>
                Reset Wallpaper
              </button>
            </div>
          )}

          {activePicker === "sender" && (
            <ColorPicker
              action={(color) => {
                setSenderBubble(color);
                setActivePicker(null);
              }}
              onCancel={() => setActivePicker(null)}
            />
          )}

          {activePicker === "receiver" && (
            <ColorPicker
              action={(color) => {
                setReceiverBubble(color);
                setActivePicker(null);
              }}
              onCancel={() => setActivePicker(null)}
            />
          )}

          {/* preview */}
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
            <div className="p-4 bg-base-200">
              <div className="max-w-lg mx-auto">
                <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium"></div>
                      <div>
                        <h3 className="font-medium text-sm">John Doe</h3>
                        <p className="text-xs text-base-content/70">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* messages */}
                  <div
                    className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100"
                    style={{
                      backgroundImage: chatWallpaper ? `url(${chatWallpaper})` : "none",
                      backgroundSize: chatWallpaperSize,
                      backgroundPosition: chatWallpaperPosition,
                      backgroundRepeat: chatWallpaperRepeat,
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    {PREVIEW_MESSAGES.map((message) => (
                      <div key={message.id} className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                            message.isSent ? senderBubble : receiverBubble
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-[10px] mt-1.5">12:00 PM</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* input */}
                  <div className="p-4 border-t border-base-300 bg-base-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-10"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <button className="btn btn-primary h-10 min-h-0">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
