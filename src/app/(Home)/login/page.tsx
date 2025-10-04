"use client";

import axios, { AxiosResponse } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      error: (err) => err.response.data.message,
    });
  };
  return (
    <>
      <div className="card w-full bg-base-300 px-10 py-10 text-base-content max-w-4xl mx-auto my-10">
        <h1 className="text-2xl font-bold text-primary text-center pb-7">
          Login to CyberScout
        </h1>
        <div className="flex flex-col items-center justify-center px-7 py-4 gap-4 w-full border border-base-content rounded-lg">
          {/* Email Field */}
          <label className="input input-bordered flex items-center gap-2 w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="text"
              placeholder="Enter Your Email"
              className="grow w-full"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </label>

          {/* Password Field */}
          <label className="input input-bordered flex items-center gap-2 w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={(e) =>
                setUser({
                  ...user,
                  password: e.target.value,
                })
              }
              className="grow"
              placeholder="Enter Password"
              required
            />
            <span
              className="opacity-70 cursor-pointer text-base-content"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </label>

          <div className="flex justify-around items-center w-full">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className="label-text">Remember Me</span>
            </label>
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
            <Link
              href={"/signup"}
              className="text-primary font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
        <div className="divider">OR</div>
        <Link href={"/check-url"} className="btn btn-primary">
          Login as Guest
        </Link>
      </div>
    </>
  );
}
