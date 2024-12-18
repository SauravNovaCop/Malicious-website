"use client";

export default function Home() {
  return (
    <div className="hero bg-base-300 h-[57vh]">
      <div className="hero-content text-center w-[50vw]">
        <div className="w-full">
          <h1 className="text-5xl font-bold text-primary">
            Welcome to CyberScout
          </h1>
          <p className="py-6 text-base-lg">
            Your ultimate tool for ensuring safe browsing. Analyze website links
            effortlessly and receive a comprehensive report powered by advanced
            machine learning models. Stay secure, surf smart.
          </p>
          <button
            className="btn btn-primary hover:btn-secondary"
            onClick={() => {
              (
                document.getElementById("login") as HTMLDialogElement
              ).showModal();
            }}
          >
            Check URL Now
          </button>
        </div>
      </div>
    </div>
  );
}
