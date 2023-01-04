import axios, { AxiosRequestConfig } from "axios";
import xml2js from "xml2js";

const parser = new xml2js.Parser();
const axiosInstance = axios.create({
  baseURL: "https://assignments.reaktor.com/birdnest",
});

export default class Api {
  static fetchXML<T>(
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    return axiosInstance<T>(url, options).then((response) => {
      if (response.data) {
        return parser.parseStringPromise(response.data) as T;
      }

      throw Error("Could not fetch and parse data");
    });
  }

  static fetch<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
    return axiosInstance<T>(url, options).then((response) => response.data);
  }
}
