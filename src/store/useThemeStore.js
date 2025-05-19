import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "../utils/axios";
import setErrorToast from "../utils/errorToast";

const textColor = function (color) {
  const shade = parseInt(color.split("-")[2], 10);
  const textColor = shade > 300 ? " text-white" : " text-black";

  return textColor;
};

export const useThemeStore = create(
  persist(
    (set) => ({
      senderBubble: "bg-blue-600 text-white",
      receiverBubble: "bg-blue-900 text-white",
      isDarkMode: false,
      chatWallpaper: null,
      chatWallpaperSize: "contain",
      chatWallpaperPosition: "center",
      chatWallpaperRepeat: "no-repeat",

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      setSenderBubble: (color) => set({ senderBubble: color + textColor(color) }),

      setReceiverBubble: (color) => set({ receiverBubble: color + textColor(color) }),

      setChatWallpaper: async (wallpaper) => {
        try {
          const res = await axiosInstance.post("/users/setChatWallpaper", { wallpaper });

          set({ chatWallpaper: res.data.data.wallpaper });
        } catch (err) {
          setErrorToast(err, "Failed to upload wallpaper.");
        }
      },
      setChatWallpaperSize: (size) => set({ chatWallpaperSize: size }),
      setChatWallpaperPosition: (position) => set({ chatWallpaperPosition: position }),
      resetChatWallpaper: () => set({ chatWallpaper: null }),
      setChatWallpaperRepeat: (repeat) => set({ chatWallpaperRepeat: repeat }),
    }),
    {
      name: "chat-theme",
      getStorage: () => localStorage,
    }
  )
);
