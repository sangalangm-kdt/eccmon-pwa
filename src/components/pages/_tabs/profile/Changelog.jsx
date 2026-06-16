import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import releaseNotes from "../../../../data/release-notes.json";

const Changelog = () => {
  const navigate = useNavigate();
  const currentVersion = import.meta.env.VITE_APP_VERSION;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      <div className="fixed z-10 flex w-full items-center justify-center rounded-b-xl bg-white py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center justify-center gap-1 rounded-full p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="flex-1 text-center font-medium text-gray-700 dark:text-gray-100 xs:mr-12">
          Changelog
        </h1>
      </div>

      <div className="m-4 mt-28 flex flex-col gap-4 rounded bg-gray-50 p-6 text-sm shadow-sm dark:bg-gray-700">
        <div className="rounded-xl bg-cyan-to-blue p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">
            Current Version
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{currentVersion}</h2>
          <p className="mt-2 text-sm text-white/90">
            Recent mobile app changes are listed below.
          </p>
        </div>

        {releaseNotes.map((release) => (
          <section
            key={release.version}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Version {release.version}
                </p>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">
                  Released {release.date}
                </p>
              </div>
              {release.version === currentVersion && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  Current
                </span>
              )}
            </div>

            <ul className="mt-4 list-disc space-y-3 pl-5 text-gray-600 dark:text-gray-200">
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Changelog;
