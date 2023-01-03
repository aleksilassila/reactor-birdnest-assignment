import { clearInterval } from "timers";
import fetchDrones from "./api/fetch-drones";
import { Drone } from "./types/api";
import fetchPilot, { Pilot } from "./api/fetch-pilot";

const AREA_WIDTH = 500000;
const TRACKING_CENTER = [AREA_WIDTH / 2, AREA_WIDTH / 2];
const TRACKING_RADIUS = 100000;

const VIOLATION_REMEMBER_TIME_MS = 1000 * 10;

export interface Violation {
  timeOfViolation: Date;
  pilot: Pilot;
  drone: Drone;
}

export default class DroneListener {
  listenerInterval: NodeJS.Timer;
  violations: Violation[] = [];

  constructor() {
    this.listenerInterval = setInterval(() => this.updateData(), 2000);
  }

  async updateData() {
    const report = await fetchDrones();

    if (report) {
      for (const drone of report.drones) {
        if (this.violatesNDZ(drone)) {
          this.addViolator(drone, report.timestamp).then();
        }
      }
    }

    this.deleteOldViolators();
  }

  private violatesNDZ(drone: Drone) {
    return (
      Math.sqrt(
        (drone.positionX - TRACKING_CENTER[0]) ** 2 +
          (drone.positionY - TRACKING_CENTER[1]) ** 2
      ) <= TRACKING_RADIUS
    );
  }

  private async addViolator(drone: Drone, timestamp: Date) {
    for (const violation of this.violations) {
      // Update violation if it already exists
      if (violation.drone.serialNumber === drone.serialNumber) {
        violation.timeOfViolation = timestamp;
        return;
      }
    }

    const pilot = await fetchPilot(drone.serialNumber).catch(console.error);

    if (pilot) {
      this.violations.push({
        timeOfViolation: timestamp,
        pilot,
        drone,
      });
    }
  }

  destroy() {
    clearInterval(this.listenerInterval);
  }

  private deleteOldViolators() {
    this.violations = this.violations.filter(
      (violation) =>
        violation.timeOfViolation.getTime() + VIOLATION_REMEMBER_TIME_MS >
        Date.now()
    );
  }
}
