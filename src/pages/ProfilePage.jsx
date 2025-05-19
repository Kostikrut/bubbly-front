import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Badge, Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfilePic, updateProfileInfo } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [profileInfoForm, setProfileInfoForm] = useState({
    name: authUser?.name,
    nickname: authUser?.nickname,
    email: authUser?.email,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({ profilePic: base64Image });
    };
  };

  const handleUpdateProfileInfo = async (e) => {
    e.preventDefault();
    const { name, nickname, email } = profileInfoForm;

    if (!name || !nickname || !email) {
      return alert("Please fill all fields");
    }

    updateProfileInfo({ name, nickname, email });
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "./avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* Profile Info Form */}
            <form className="space-y-6" onSubmit={handleUpdateProfileInfo}>
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2 py-1">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <input
                  className="px-4 py-2.5 w-full bg-base-200 rounded-lg border"
                  onChange={(e) => setProfileInfoForm({ ...profileInfoForm, name: e.target.value })}
                  value={profileInfoForm.name}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2 py-1">
                  <Badge className="w-4 h-4" />
                  Nickname
                </div>
                <input
                  className="px-4 py-2.5 w-full bg-base-200 rounded-lg border"
                  onChange={(e) => setProfileInfoForm({ ...profileInfoForm, nickname: e.target.value })}
                  value={profileInfoForm.nickname}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2 py-1">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <input
                  className="px-4 py-2.5 w-full bg-base-200 rounded-lg border"
                  onChange={(e) => setProfileInfoForm({ ...profileInfoForm, email: e.target.value })}
                  value={profileInfoForm.email}
                />
              </div>

              <button type="submit" className={`btn btn-primary w-full ${isUpdatingProfile ? "loading" : ""}`}>
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>
            </form>

            {/* account Info */}
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
