"use client";
import axios from "axios";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const router = useRouter();
  const handleLogin = () => {
    (document.getElementById("login") as HTMLDialogElement).close();
    if (user.email.length === 0 || user.password.length === 0) {
      toast.error("Please fill all the fields");
      return;
    }
    const response = axios.post("/api/auth/login", { user });
    toast.promise(response, {
      loading: "Logging In...",
      success: () => {
        router.push("/user/dashboard");
        return "Logged In Successfully";
      },
      error: "Failed to Log In",
    });
  };
  return (
    <dialog id="login" className="modal">
      <div className="modal-box">
        <div className="w-full flex items-center justify-end">
          <button
            className="btn btn-ghost w-16 h-auto"
            onClick={() =>
              (document.getElementById("signup") as HTMLDialogElement).close()
            }
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="card w-full max-w-md shadow-lg bg-base-300 p-10 text-base-content">
          <h1 className="text-2xl font-bold text-primary text-center pb-7">
            Login to CyberScout
          </h1>
          <div className="flex flex-col items-center justify-center px-7 py-4 gap-4 w-full border border-base-content rounded-lg">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="text"
                placeholder="Enter Your Email"
                className="input input-bordered input-primary w-full max-w-xs"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </label>

            {/* Password Field */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="text"
                placeholder="Enter Your Password"
                className="input input-bordered input-primary w-full max-w-xs"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </label>
            <div className="flex justify-around items-center w-full">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="label-text">Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button className="btn btn-primary w-full" onClick={handleLogin}>
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  (
                    document.getElementById("login") as HTMLDialogElement
                  ).close();
                  (
                    document.getElementById("signup") as HTMLDialogElement
                  ).showModal();
                }}
                className="text-primary font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
          <div className="divider">OR</div>
          <Link href={"/check-url"} className="btn btn-primary">
            Login as Guest
          </Link>
        </div>
      </div>
    </dialog>
  );
};
export default Login;
