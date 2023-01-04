"use client";
import useViolations from "./(hooks)/useViolations";
import classNames from "classnames";

function Violations() {
  const { isLoading, violations } = useViolations();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-zinc-600">
        <h2 className="font-bold">Loading...</h2>
      </div>
    );
  }

  if (violations.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-zinc-600">
        <h2 className="text-2xl font-bold">No recent violations</h2>
        <p className="text-sm">
          No one has violated the NDZ zone for the past 10 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className={"flex-1 flex flex-wrap gap-4 items-center justify-center"}>
      {violations.map((violation) => (
        <div
          key={violation.pilot.pilotId}
          className="border border-zinc-600 rounded p-4 w-72"
        >
          <div className="font-medium text-xl">
            {violation.pilot.firstName} {violation.pilot.lastName}
          </div>
          <div className="text-sm mb-2">
            Flew {Math.round(violation.violationDistanceInMeters)}m from the
            nest.
          </div>
          <div className="text-sm text-zinc-400">
            {" "}
            • {violation.pilot.phoneNumber}
          </div>
          <div className="text-sm text-zinc-400">
            {" "}
            • {violation.pilot.email}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const gridClassName = classNames("grid grid-cols-3 gap-4");

  return (
    <div className="flex-1 flex flex-col items-center px-8 md:px-16 max-h-screen">
      <div className="font-bold text-4xl text-center mt-16">
        List of NDZ Violators
      </div>
      <div className="text-sm font-medium mb-8 text-center">
        A real time list of violators of the no drone zone near Monadikuikka
        nest from the past 10 minutes.
      </div>
      <div className="overflow-x-scroll flex-shrink">
        <Violations />
      </div>
      <div className="flex-1 text-sm font-medium text-zinc-500 py-4">
        Aleksi Lassila
      </div>
    </div>
  );
}
