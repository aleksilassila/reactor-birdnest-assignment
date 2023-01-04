import { clearInterval } from "timers";
import fetchDrones, { Drone } from "./api/fetch-drones";
import fetchPilot, { Pilot } from "./api/fetch-pilot";
import { Server } from "socket.io";

const AREA_WIDTH = 500000;
const TRACKING_CENTER = [AREA_WIDTH / 2, AREA_WIDTH / 2];
const TRACKING_RADIUS = 100000;

const VIOLATION_REMEMBER_TIME_MS = 1000 * 60 * 10;

export interface Violation {
  timeOfViolation: Date;
  violationDistanceInMeters: number;
  pilot: Pilot;
  drone: Drone;
}

export default class DroneListener {
  io: Server;
  listenerInterval: NodeJS.Timer;
  violations: Violation[] = [];

  constructor(io: Server) {
    this.io = io;
    this.listenerInterval = setInterval(() => this.updateData(), 2000);
  }

  async updateData() {
    const report = await fetchDrones();

    if (report) {
      for (const drone of report.drones) {
        if (this.violatesNDZ(drone)) {
          this.addViolator(drone, report.timestamp).then(() =>
            this.broadcastViolations()
          );
        }
      }
    }

    this.deleteOldViolators();
    this.broadcastViolations();
  }

  broadcastViolations() {
    this.io.emit("set-violations", this.violations);
  }

  private async addViolator(
    drone: Drone,
    timestamp: Date
  ): Promise<Violation | undefined> {
    for (const violation of this.violations) {
      // Update violation if it already exists
      if (violation.drone.serialNumber === drone.serialNumber) {
        violation.timeOfViolation = timestamp;
        violation.violationDistanceInMeters = Math.min(
          this.calculateViolationDistance(drone) / 1000,
          violation.violationDistanceInMeters
        );
        return violation;
      }
    }

    const pilot = await fetchPilot(drone.serialNumber).catch(console.error);

    if (pilot) {
      const violation: Violation = {
        timeOfViolation: timestamp,
        violationDistanceInMeters:
          this.calculateViolationDistance(drone) / 1000,
        pilot,
        drone,
      };
      this.violations.push(violation);
      return violation;
    }
  }

  /**
   * Deletes violations that are older than VIOLATION_REMEMBER_TIME_MS and returns them
   */
  private deleteOldViolators() {
    const removedViolations: Violation[] = [];
    const violationsRemaining: Violation[] = [];
    for (const violation of this.violations) {
      (this.isStale(violation) ? removedViolations : violationsRemaining).push(
        violation
      );
    }

    this.violations = violationsRemaining;

    return removedViolations;
  }

  private isStale(violation: Violation) {
    return (
      violation.timeOfViolation.getTime() + VIOLATION_REMEMBER_TIME_MS <
      Date.now()
    );
  }

  private calculateViolationDistance(drone: Drone) {
    return Math.sqrt(
      (drone.positionX - TRACKING_CENTER[0]) ** 2 +
        (drone.positionY - TRACKING_CENTER[1]) ** 2
    );
  }

  private violatesNDZ(drone: Drone) {
    return this.calculateViolationDistance(drone) <= TRACKING_RADIUS;
  }

  destroy() {
    clearInterval(this.listenerInterval);
  }
}
