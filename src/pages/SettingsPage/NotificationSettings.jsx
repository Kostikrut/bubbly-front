import { useState } from "react";
import { Bell, BellOff, Clock3, Volume2, VolumeX, Play } from "lucide-react";

import { useChatStore } from "../../store/useChatStore";

const NotificationSettings = () => {
  const {
    isNotificationsSoundMuted,
    toggleNotificationSound,
    notificationsSound,
    setNotificationsSound,
    toggleMuteNotifications,
    isNotificationsMuted,
  } = useChatStore();

  const [selectedSound, setSelectedSound] = useState(notificationsSound);

  const notificationSounds = [
    { label: "Default", fileName: "default-notification.mp3" },
    { label: "Apear", fileName: "apear-notification.mp3" },
    { label: "Bell", fileName: "bell-notification.mp3" },
    { label: "Glow", fileName: "glow-notification.mp3" },
    { label: "Happy", fileName: "happy-notification.mp3" },
    { label: "Offset", fileName: "offset-notification.mp3" },
    { label: "Perfume", fileName: "perfume-notification.mp3" },
    { label: "Tear", fileName: "tear-notification.mp3" },
    { label: "Train", fileName: "train-notification.mp3" },
  ];

  const playSound = () => {
    const audio = new Audio(`/sounds/notifications/${notificationsSound}`);
    audio.play().catch(() => console.log("Sound play interrupted"));
  };

  const handleUpdateNotificationSound = (soundId) => {
    const sound = notificationSounds.find((sound) => sound.fileName === soundId);

    setNotificationsSound(sound.fileName);
    setSelectedSound(sound.fileName);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg text-blue-500 font-semibold">Notification Settings</h1>

      {/* notification togle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="checkbox"
          checked={!isNotificationsMuted}
          onChange={toggleMuteNotifications}
        />
        {!isNotificationsMuted ? <Bell size={18} /> : <BellOff size={18} />}
        {!isNotificationsMuted ? "Enable Notifications" : "Disable Notifications"}
      </label>

      {/* notifications sound */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="checkbox"
          checked={!isNotificationsSoundMuted}
          onChange={toggleNotificationSound}
          disabled={isNotificationsMuted}
        />
        {!isNotificationsSoundMuted ? <Volume2 size={18} /> : <VolumeX size={18} />}
        Enable Notification Sound
      </label>

      {/* sound picker */}
      {!isNotificationsMuted && !isNotificationsSoundMuted && (
        <div className="form-control w-full max-w-sm">
          <label className="label">
            <span className="label-text">Select Notification Sound</span>
          </label>
          <div className="flex gap-3.5">
            <select
              className="select select-bordered mt-3"
              value={selectedSound}
              onChange={(e) => handleUpdateNotificationSound(e.target.value)}
            >
              {notificationSounds.map((sound) => (
                <option key={sound.fileName} value={sound.fileName}>
                  {sound.label}
                </option>
              ))}
            </select>

            <button className="btn btn-primary my-3" onClick={() => playSound()}>
              <Play size={16} />
              Preview Sound
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
