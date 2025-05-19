import { useState } from "react";
import { useParams } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../utils/axios";
import setErrorToast from "../utils/errorToast";

function ResetPasswordPage() {
  const { token } = useParams();

  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.passwordConfirm) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post(`/auth/resetPassword/${token}`, formData);

      if (!res.data.user || !res.data.token) return;

      setIsPasswordReset(true);
      toast.success("Password reset successfuly");
    } catch (err) {
      console.log(err);
      setErrorToast(err, "Failed to reset password. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center p-6 sm:p-12 bg-base-300">
      <span className="absolute inset-0 flex items-center justify-center text-[60vw] font-black text-base-content/1.5 select-none pointer-events-none z-0">
        B
      </span>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {isPasswordReset ? (
          <div className="text-center space-y-6 bg-base-100 p-8 rounded-lg shadow">
            <div className="flex flex-col items-center gap-3">
              <img src="/logo.svg" alt="logo" className="size-16" />
              <h2 className="text-2xl font-bold text-success">Password Reset Successful</h2>
              <p className="text-base-content/70">You can now log in with your new password.</p>
            </div>
            <a href="/login" className="btn btn-primary w-full">
              Start Bubbling
            </a>
          </div>
        ) : (
          <>
            {/* header */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-20 rounded-lg bg-primary/10 flex items-center justify-center">
                  <img src="/logo.svg" alt="logo" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
                <p className="text-base-content/60">Enter your new password</p>
              </div>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">New Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirm Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
