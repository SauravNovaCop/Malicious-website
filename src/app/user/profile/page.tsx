"use client";
import { useUserContext } from "@/context/context";
import Image from "next/image";

const UserProfile = () => {
  const { user } = useUserContext();

  if (!user) return <>Loading...</>;

  return (
    <div className="bg-base-200 flex items-center justify-center mt-10">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture */}
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <Image
                src="https://picsum.photos/200/300"
                alt="User Avatar"
                height={28}
                width={28}
                className="rounded-full"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold uppercase">{user.email}</h2>
          </div>

          {/* User Details */}
          <div className="w-full mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Email:</span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
