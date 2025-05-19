import { io } from "socket.io-client";
import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../utils/axios.js";
import setErrorToast from "../utils/errorToast.js";

const BASE_URL = "http://localhost:9000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async (isInitial) => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");

      set({
        authUser: res.data.data.user,
      });

      get().connectSocket();
    } catch (err) {
      if (isInitial) return;

      setErrorToast(err, "Session expired. Please log in again.");
      set({
        user: null,
      });
    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  setAuthUser: (user) => {
    set({ authUser: user });
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (!res.data.user) return;

      set({
        authUser: res.data.user,
      });

      toast.success("Account created successfully!");

      get().connectSocket();
    } catch (err) {
      setErrorToast(err);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", formData);
      if (!res.data.user) return;

      set({
        authUser: res.data.user,
      });

      toast.success("Logged in successfully!");

      get().connectSocket();
    } catch (err) {
      setErrorToast(err);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");

    set({
      authUser: null,
    });

    toast.success("Logged out successfully!");
    get().disconnectSocket();
  },

  updateProfileInfo: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.patch("/users/updateUser", data);
      if (!res.data.data.user) return;

      set({
        authUser: res.data.data.user,
      });

      toast.success("Profile information updated successfully!");
    } catch (err) {
      console.log(err);
      setErrorToast(err);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateOnlineStatus: async (data) => {
    try {
      const res = await axiosInstance.patch("/users/updateOnlineStatus", data);
      if (!res.data.data.user) return;

      set({
        authUser: res.data.data.user,
      });

      toast.success("Online status updated successfully!");

      // Reconnect socket to update online status for other users
      get().disconnectSocket();
      get().connectSocket();
    } catch (err) {
      setErrorToast(err);
    }
  },

  updateProfilePic: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.patch("/users/updateProfilePic", data);
      if (!res.data.data.user) return;

      set({
        authUser: res.data.data.user,
      });

      toast.success("Profile picture updated successfully!");
    } catch (err) {
      setErrorToast(err);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  addToContacts: async (userId) => {
    try {
      const res = await axiosInstance.put(`/users/contacts/${userId}`);
      if (!res.data.data.user) return;

      set({
        authUser: res.data.data.user,
      });

      toast.success("User added to contacts successfully!");
    } catch (err) {
      setErrorToast(err, "Failed to add user to contacts. please relogin and try again.");
    }
  },

  removeFromContacts: async (userId) => {
    try {
      const res = await axiosInstance.delete(`/users/contacts/${userId}`);
      if (!res.data.data.user) return;

      set({
        authUser: res.data.data.user,
      });

      toast.success("User removed from contacts successfully!");
    } catch (err) {
      setErrorToast(err, "Failed to remove user from contacts. please relogin and try again.");
    }
  },

  blockUser: async (userId) => {
    try {
      const res = await axiosInstance.put(`/users/block/${userId}`);
      if (!res.data.data.user) return;

      set({
        authUser: res.data.data.user,
      });

      toast.success("User blocked successfully!");
    } catch (err) {
      setErrorToast(err, "Failed to block user. please relogin and try again.");
    }
  },

  unblockUser: async (userId) => {
    try {
      const res = await axiosInstance.put(`/users/unblock/${userId}`);
      if (!res.data.data.user) return;

      set({
        authUser: res.data.data.user,
      });

      toast.success("User unblocked successfully!");
    } catch (err) {
      setErrorToast(err, "Failed to unblock user. please relogin and try again.");
    }
  },

  markAsRead: async (userId) => {
    get().socket.emit("markAsRead", { fromUserId: userId });
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
