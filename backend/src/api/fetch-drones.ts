import Api from "./api";
import { AxiosError } from "axios";

interface DroneParsed {
  serialNumber: string[];
  model: string[];
  manufacturer: string[];
  mac: string[];
  ipv4: string[];
  ipv6: string[];
  firmware: string[];
  positionY: string[];
  positionX: string[];
  altitude: string[];
}

interface FetchDronesResponseParsed {
  report: {
    capture: {
      $: {
        snapshotTimestamp: string;
      };
      drone: DroneParsed[];
    }[];
  };
}

export interface Drone {
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

let rateLimitedAt: Date = new Date();
let rateLimitCooldown = 1000 * 10;

export default async function fetchDrones(): Promise<{
  timestamp: Date;
  drones: Drone[];
}> {
  if (rateLimitedAt.getTime() + rateLimitCooldown > Date.now()) {
    return {
      timestamp: new Date(),
      drones: [],
    };
  }

  return Api.fetchXML<FetchDronesResponseParsed>("/drones")
    .then((data) => ({
      timestamp: new Date(data.report.capture[0].$.snapshotTimestamp),
      drones: data.report.capture[0].drone.map((drone) => ({
        serialNumber: drone.serialNumber[0],
        model: drone.model[0],
        manufacturer: drone.manufacturer[0],
        mac: drone.mac[0],
        ipv4: drone.ipv4[0],
        ipv6: drone.ipv6[0],
        firmware: drone.firmware[0],
        positionY: Number(drone.positionY[0]),
        positionX: Number(drone.positionX[0]),
        altitude: Number(drone.altitude[0]),
      })),
    }))
    .catch((err) => {
      if (err instanceof AxiosError) {
        const axiosError = err as AxiosError;
        if (axiosError.status === 429) {
          rateLimitedAt = new Date();
        }
      }

      console.error(err);
      return { timestamp: new Date(), drones: [] };
    });
}
