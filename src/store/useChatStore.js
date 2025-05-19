import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useAuthStore } from "./useAuthStore.js";
import { axiosInstance } from "../utils/axios.js";
import setErrorToast from "../utils/errorToast.js";

const playNotificationSound = (get) => {
  const messageSound = new Audio(`/sounds/notifications/${get().notificationsSound}`);
  if (!get().isNotificationsSoundMuted) return messageSound.play().catch(() => console.log("Sound play interrupted")); // chrome blocks autoplay if user didnt interact with the page yet, after that it usualy works
};

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      users: [],
      selectedUser: null,
      notificationsSound: "default-notification.mp3",
      isUsersLoading: false,
      isMessagesLoading: false,
      isSendingMessage: false,
      isTyping: false,
      isShowTyping: true,
      isNotificationsSoundMuted: false,
      isNotificationsMuted: false,
      newMessageFromUsers: [],
      unreadMessagesCount: {},
      isSubscribed: false,

      getContacts: async () => {
        set({ isUsersLoading: true });

        if (!useAuthStore.getState().authUser) {
          set({ isUsersLoading: false });
          return;
        }

        try {
          const res = await axiosInstance.get("/users/contacts");

          if (useAuthStore.getState().authUser) {
            set({ users: res.data.data.users });
          }
        } catch (err) {
          const status = err.response?.status;

          if (status === 401) {
            if (useAuthStore.getState().authUser) {
              useAuthStore.getState().logout();
            }
          }
        } finally {
          if (useAuthStore.getState().authUser) {
            set({ isUsersLoading: false });
          }
        }
      },

      getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data.data.messages });
        } catch (err) {
          setErrorToast(err, "Failed to load messages.");
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      sendMessage: async (message) => {
        const { selectedUser, messages } = get();
        set({ isSendingMessage: true });

        try {
          const res = await axiosInstance.post(`/messages/${selectedUser._id}`, message);
          set({ messages: [...messages, res.data.data.message] });
        } catch (err) {
          setErrorToast(err, "Failed to send message.");
        } finally {
          set({ isSendingMessage: false });
        }
      },

      subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;

        // prevent duplicate subscriptions
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");

        socket.on("newMessage", (newMessage) => {
          const { selectedUser, addNewMessageFromUser } = get();
          const { socket } = useAuthStore.getState();
          if (!socket) return;

          if (!selectedUser || newMessage.senderId !== selectedUser._id) {
            addNewMessageFromUser(newMessage.senderId);
            return playNotificationSound(get);
          }

          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
          playNotificationSound(get);
          socket.emit("markAsRead", { fromUserId: selectedUser._id });
        });

        socket.on("messagesRead", ({ byUserId }) => {
          const { selectedUser, messages } = get();
          if (!selectedUser || selectedUser._id !== byUserId) return;

          const updatedMessages = messages.map((msg) => (msg.receiverId === byUserId ? { ...msg, isRead: true } : msg));

          set({ messages: updatedMessages });
        });

        socket.on("typing", ({ fromUserId }) => {
          const { selectedUser } = get();

          if (selectedUser && fromUserId === selectedUser._id) {
            set({ isTyping: true });
          }
        });

        socket.on("stopTyping", ({ fromUserId }) => {
          const { selectedUser } = get();

          if (selectedUser && fromUserId === selectedUser._id) {
            set({ isTyping: false });
          }
        });

        set({ isSubscribed: true });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");

        set({ isSubscribed: false });
      },

      setSelectedUser: (user) => {
        const { removeNewMessageFromUser } = get();

        if (user) {
          removeNewMessageFromUser(user._id);

          set((state) => ({
            unreadMessagesCount: {
              ...state.unreadMessagesCount,
              [user._id]: 0,
            },
          }));
        }
        set({ selectedUser: user });
      },

      toggleShowTyping: () => {
        set((state) => ({
          isShowTyping: !state.isShowTyping,
        }));
      },

      setIsTyping: (value) => set({ isTyping: value }),

      addNewMessageFromUser: (userId) =>
        set((state) => {
          if (!userId || get().isNotificationsMuted) return {};

          const currentCount = state.unreadMessagesCount[userId] || 0;

          return {
            newMessageFromUsers: state.newMessageFromUsers.includes(userId)
              ? state.newMessageFromUsers
              : [...state.newMessageFromUsers, userId],

            unreadMessagesCount: {
              ...state.unreadMessagesCount,
              [userId]: currentCount + 1,
            },
          };
        }),

      removeNewMessageFromUser: (userId) =>
        set((state) => ({
          newMessageFromUsers: state.newMessageFromUsers.filter((id) => id !== userId),
        })),

      toggleMuteNotifications: () => {
        set((state) => ({
          isNotificationsMuted: !state.isNotificationsMuted,
        }));

        get().toggleNotificationSound();
      },

      toggleNotificationSound: () =>
        set((state) => ({
          isNotificationsSoundMuted: !state.isNotificationsSoundMuted,
        })),

      setNotificationsSound: (soundfileName) =>
        set(() => ({
          notificationsSound: soundfileName,
        })),
    }),
    {
      name: "chat-settings",
      partialize: (state) => ({
        notificationsSound: state.notificationsSound,
        isNotificationsSoundMuted: state.isNotificationsSoundMuted,
        isShowTyping: state.isShowTyping,
        isNotificationsMuted: state.isNotificationsMuted,
      }),
      getStorage: () => localStorage,
    }
  )
);

// getContacts: async () => {
//   set({ isUsersLoading: true });
//   if (!useAuthStore.getState().authUser) return;

//   try {
//     const res = await axiosInstance.get("/users/contacts");
//     set({ users: res.data.data.users });
//   } catch (err) {
//     //in case the authUser is already logged out but the getContacts is still called
//     (err.status === 401 && useAuthStore.getState().logout()) || setErrorToast(err, "Failed to load contacts.");
//   } finally {
//     set({ isUsersLoading: false });
//   }
// },
