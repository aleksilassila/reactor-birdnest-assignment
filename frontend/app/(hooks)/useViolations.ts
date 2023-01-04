import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Pilot {
  pilotId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdDt: string;
  email: string;
}

interface Drone {
  serialNumber: string;
  model: string;
  manufacturer: string;
  mac: string;
  ipv4: string;
  ipv6: string;
  firmware: string;
  positionY: number;
  positionX: number;
  altitude: number;
}

export interface Violation {
  timeOfViolation: string;
  violationDistanceInMeters: number;
  pilot: Pilot;
  drone: Drone;
}

const socket = io({
  path: "/api/socket.io",
});

export default function useViolations() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.on("set-violations", (violations: Violation[]) => {
      setViolations(violations);
      setIsLoading(false);
    });

    socket.on("add-violation", (violation: Violation) => {
      setViolations([
        violation,
        ...violations.filter(
          (v) => v.pilot.pilotId !== violation.pilot.pilotId
        ),
      ]);
    });

    socket.on("delete-violation", (deletedViolations: Violation) => {
      setViolations(
        violations.filter(
          (v) => v.pilot.pilotId !== deletedViolations.pilot.pilotId
        )
      );
    });
  }, []);

  violations.sort(
    (a, b) =>
      new Date(b.timeOfViolation).getTime() -
      new Date(a.timeOfViolation).getTime()
  );

  return { violations, isLoading };
}
