"use client";

import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const handleSignUp = () => {
    if (user.email.length === 0 || user.password.length === 0) {
      toast.error("Please fill all the fields");
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
    <dialog id="signup" className="modal">
      <div className="modal-box">
        <div className="card w-full max-w-md shadow-lg bg-base-300 p-10 text-base-content">
          <h1 className="text-2xl font-bold text-primary text-center pb-7">
            SignUp to WebShield
          </h1>
          <div className="flex flex-col items-center justify-center px-7 py-4 gap-4 w-full border border-base-content ring rounded-lg">
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

            {/* Submit Button */}
            <button className="btn btn-primary w-full" onClick={handleSignUp}>
              SignUp
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
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default SignUp;
