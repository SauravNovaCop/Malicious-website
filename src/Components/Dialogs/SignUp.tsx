"use client";

import axios, { AxiosResponse } from "axios";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const handleSignUp = () => {
    if (user.email.length === 0 || user.password.length === 0) {
      toast.error("Please fill all the fields");
      return;
    }
    (document.getElementById("signup") as HTMLDialogElement).close();
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
    <dialog id="signup" className="modal">
      <div className="modal-box">
        <div className="w-full flex items-center justify-end">
          <button
            className="btn btn-ghost ml-auto w-16 h-auto"
            onClick={() =>
              (document.getElementById("signup") as HTMLDialogElement).close()
            }
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="card w-full bg-base-300 px-10 py-10 text-base-content">
          <h1 className="text-2xl font-bold text-primary text-center pb-7">
            SignUp to CyberScout
          </h1>
          <div className="flex flex-col items-center justify-center px-7 py-4 gap-4 w-full border border-base-content rounded-lg">
            <label className="form-control w-full">
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

            {/* Submit Button */}
            <button className="btn btn-primary w-full" onClick={handleSignUp}>
              Login Up
            </button>
          </div>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <button
                onClick={() => {
                  (
                    document.getElementById("signup") as HTMLDialogElement
                  ).close();
                  (
                    document.getElementById("login") as HTMLDialogElement
                  ).showModal();
                }}
                className="text-primary font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default SignUp;
