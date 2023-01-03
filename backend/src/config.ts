export const NODE_ENV: "production" | "development" =
  process.env.ENDPOINT === "production" ? "production" : "development";

export const ENDPOINT =
  process.env.ENDPOINT || NODE_ENV === "production"
    ? "https://example.com"
    : "http://localhost";
