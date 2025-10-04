"use client";

import axios, { AxiosResponse } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
export default function SignUpPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleSignUp = () => {
    if (user.email.length === 0 || user.password.length === 0) {
      toast.error("Please fill all the fields");
      return;
    }
    if (
      !user.email.includes("@") ||
      !user.email.includes(".") ||
      user.email.length < 5 ||
      user.email.length > 50
    ) {
      toast.error("Invalid Email");
      return;
    }
    const response = axios.post("/api/auth/signup", { user });
    toast.promise(response, {
      loading: "Signing Up...",
      success: (data: AxiosResponse) => {
        console.log(data);
        return "Signed Up Successfully";
      },
      error: "Failed to Sign Up",
    });
  };
  return (
    <>
      <div className="card w-full bg-base-300 px-10 py-10 text-base-content max-w-4xl mx-auto my-10">
        <h1 className="text-2xl font-bold text-primary text-center pb-7">
          SignUp to CyberScout
        </h1>
        <div className="p-10 border border-base-content rounded-lg space-y-5">
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
          {/* Confirm Password */}
          <label className="input input-bordered flex items-center gap-2 w-full">
            <div className="label">
              <span className="label-text">Confirm Password</span>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({
                  ...user,
                  confirmPassword: e.target.value,
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

          {/* Submit Button */}
          <button
            className="btn btn-primary w-full"
            onClick={handleSignUp}
            disabled={user.password !== user.confirmPassword}
          >
            Login Up
          </button>
        </div>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
