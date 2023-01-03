import Api from "./api";

export interface Pilot {
  pilotId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdDt: string;
  email: string;
}

export default async function fetchPilot(
  serialNumber: string
): Promise<Pilot | undefined> {
  return Api.fetch<Pilot>("/pilots/" + serialNumber).catch((err) => {
    console.error(err);
    return undefined;
  });
}
