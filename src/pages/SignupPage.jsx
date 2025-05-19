import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";

function SignupPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  function isValidFullName(name) {
    const trimmed = name.trim();
    const parts = trimmed.split(/\s+/);
    const hasTwoParts = parts.length >= 2;
    const onlyLetters = /^[a-zA-Z\s]+$/.test(trimmed);
    return hasTwoParts && onlyLetters;
  }

  function isValidNickname(nickname) {
    const trimmed = nickname.trim().toLowerCase();
    const hasValidLength = trimmed.length >= 5 && trimmed.length <= 30;
    const startsWithLetter = /^[a-zA-Z]/.test(trimmed);
    const noConsecutivePeriods = !/\.\./.test(trimmed);
    const noTrailingPeriod = !/\.$/.test(trimmed);
    const onlyValidChars = /^[a-zA-Z0-9._]+$/.test(trimmed);
    return hasValidLength && startsWithLetter && noConsecutivePeriods && noTrailingPeriod && onlyValidChars;
  }

  const validateForm = () => {
    const { name, nickname, email, password, passwordConfirm } = formData;
    if (!isValidFullName(name)) {
      setErrorMessage("Not a valid full name.");
      return false;
    }
    if (!nickname) {
      setErrorMessage("Please provide a nickname.");
      return false;
    }
    if (!isValidNickname(nickname)) {
      setErrorMessage(
        "Nickname must start with a letter, can only contain letters, numbers, underscores, and periods. No consecutive or trailing periods. Max length 30 characters."
      );
      return false;
    }
    if (!name || !email || !password || !passwordConfirm) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }
    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await signup(formData);
    } catch (err) {
      console.log(err?.message);
      setErrorMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center p-6 sm:p-12 bg-base-300">
      {/* B in the background */}
      <span className="absolute inset-0 flex items-center justify-center text-[60vw] font-black text-base-content/1.5 select-none pointer-events-none z-0">
        B
      </span>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-20 rounded-lg bg-primary/10 flex items-center justify-center">
              <img src="/logo.svg" alt="logo" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">Get started with your free account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/*  name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* nickname */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Nickname</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="john_doe42"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              />
            </div>
          </div>

          {/* email */}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-base-content/40" />
                ) : (
                  <Eye className="h-5 w-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          {/* confirm password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Confirm Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              />
            </div>
          </div>

          {/* submit */}
          <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
            {isSigningUp ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {errorMessage && <p className="mt-2 text-sm text-red-500 text-center">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
