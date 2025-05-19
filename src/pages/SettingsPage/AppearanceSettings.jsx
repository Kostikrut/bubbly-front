import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { useThemeStore } from "../../store/useThemeStore";

import ColorPicker from "../../components/ColorPicker";
import setErrorToast from "../../utils/errorToast";
import { useChatStore } from "../../store/useChatStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const AppearanceSettings = () => {
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

  const { isShowTyping, toggleShowTyping } = useChatStore();

  const [activePicker, setActivePicker] = useState(null);
  const [wallpaper, setWallpaper] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (wallpaper) {
      setChatWallpaper(wallpaper);
    }
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
    <div className="space-y-6 p-6">
      <h1 className="text-lg text-blue-500 font-semibold">Theme & Wallpaper Settings</h1>

      {/* bubble colors */}
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

      {/* wallpaper */}
      {chatWallpaper && (
        <div className="space-y-3">
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

      {/* color picker*/}
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
              <div
                className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto"
                style={{
                  backgroundImage: chatWallpaper ? `url(${chatWallpaper})` : "none",
                  backgroundSize: chatWallpaperSize,
                  backgroundPosition: chatWallpaperPosition,
                  backgroundRepeat: chatWallpaperRepeat,
                }}
              >
                {PREVIEW_MESSAGES.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-xl p-3 shadow-sm ${msg.isSent ? senderBubble : receiverBubble}`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] mt-1.5">12:00 PM</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-base-300 bg-base-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-10"
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

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="checkbox" checked={isShowTyping} onChange={toggleShowTyping} />
        {/* {!isShowTyping ? <Volume2 size={18} /> : <VolumeX size={18} />} */}
        Show Typing Indicator
      </label>
    </div>
  );
};

export default AppearanceSettings;
