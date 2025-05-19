import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Loader2 } from "lucide-react";

import { axiosInstance } from "../utils/axios.js";
import setErrorToast from "../utils/errorToast.js";

function RestorePasswordPage() {
  const [email, setEmail] = useState("");
  const [emailSubmittedMessage, setEmailSubmittedMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post("/auth/forgotPassword", {
        email: email.toLowerCase().trim(),
      });

      if (!res.data.message) return;

      setEmailSubmittedMessage(res.data.message);
      setEmail("");

      toast.success("Insructions sent to your email successfuly.");
    } catch (err) {
      setErrorToast(err, "Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center p-6 sm:p-12 bg-base-300">
      <span className="absolute inset-0 flex items-center justify-center text-[60vw] font-black text-base-content/1.5 select-none pointer-events-none z-0">
        B
      </span>

      {emailSubmittedMessage ? (
        <>
          <div className="relative z-10 w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-20 rounded-lg bg-primary/10 flex items-center justify-center">
                  <img src="/logo.svg" alt="logo" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Check your email</h1>
                <p className="text-base-content/60">{emailSubmittedMessage}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative z-10 w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-20 rounded-lg bg-primary/10 flex items-center justify-center">
                  <img src="/logo.svg" alt="logo" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Restore Password</h1>
                <p className="text-base-content/60">Enter your email to receive a reset link</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default RestorePasswordPage;
