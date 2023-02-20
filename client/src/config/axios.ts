import axios, { AxiosRequestConfig } from "axios"

const config: AxiosRequestConfig = {
  baseURL: `${ process.env.REACT_APP_API_URL }/api`,
  timeout: 7500,
  withCredentials: true
}

export const api = axios.create(config)