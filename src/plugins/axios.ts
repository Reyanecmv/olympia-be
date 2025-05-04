import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { asValue } from "awilix";
import axios, { AxiosRequestConfig } from "axios";
import { axiosConfig } from "@config/axios.js";
import qs from "qs";

export interface AxiosPluginInstance {
  (url: string, opts?: AxiosRequestConfig): Promise<any>;
  get: <T = any>(url: string, opts?: AxiosRequestConfig) => Promise<T>;
  post: <T = any>(
    url: string,
    body: any,
    opts?: AxiosRequestConfig,
  ) => Promise<T>;
  put: <T = any>(
    url: string,
    body: any,
    opts?: AxiosRequestConfig,
  ) => Promise<T>;
  delete: <T = any>(url: string, opts?: AxiosRequestConfig) => Promise<T>;
  patch: <T = any>(
    url: string,
    body: any,
    opts?: AxiosRequestConfig,
  ) => Promise<T>;
}

export interface AxiosPluginOptions {
  /**
   * Base URL for all API requests
   */
  baseURL?: string;

  /**
   * Default headers to include with every request
   */
  headers?: Record<string, string>;

  /**
   * Default axios options
   */
  axiosOptions?: AxiosRequestConfig;

  /**
   * Name to register the axios instance as in the container
   * @default "axios"
   */
  name?: string;

  /**
   * Function to get request ID from current context
   * If provided, this function will be called to get a request ID
   * to add to outgoing requests
   */
  getRequestId?: (fastify: FastifyInstance) => string | undefined;
}

/**
 * Plugin that registers an axios instance in the Awilix container
 */
async function axiosPlugin(
  fastify: FastifyInstance,
  options: AxiosPluginOptions = {},
) {
  const {
    baseURL,
    headers = {},
    axiosOptions = {},
    name = "axios",
    getRequestId,
  } = options;

  // Create axios instance with base configuration
  const axiosInstance = axios.create({
    paramsSerializer: {
      serialize: (params) => {
        const queryString = qs.stringify(params);
        return queryString.replace(/%40/g, "@");
      },
    },
    baseURL,
    ...axiosOptions,
    headers: {
      ...headers,
      ...axiosOptions.headers,
    },
  });

  // Add request interceptor to add request ID if available
  axiosInstance.interceptors.request.use((config) => {
    if (getRequestId) {
      const reqId = getRequestId(fastify);
      if (reqId) {
        config.headers = config.headers || {};
        config.headers["x-request-id"] = reqId;
      }
    }
    return config;
  });

  // Create custom function interface matching original API
  const customFetch = async (url: string, opts: AxiosRequestConfig = {}) => {
    const response = await axiosInstance({
      url,
      ...opts,
    });
    return response.data;
  };

  // Add convenience methods for different HTTP methods
  const fetchInstance = Object.assign(customFetch, {
    get: async <T = any>(
      url: string,
      opts: AxiosRequestConfig = {},
    ): Promise<T> => {
      const response = await axiosInstance.get(url, opts);
      return response.data;
    },
    post: async <T = any>(
      url: string,
      body: any,
      opts: AxiosRequestConfig = {},
    ): Promise<T> => {
      const response = await axiosInstance.post(url, body, opts);
      return response.data;
    },
    put: async <T = any>(
      url: string,
      body: any,
      opts: AxiosRequestConfig = {},
    ): Promise<T> => {
      const response = await axiosInstance.put(url, body, opts);
      return response.data;
    },
    delete: async <T = any>(
      url: string,
      opts: AxiosRequestConfig = {},
    ): Promise<T> => {
      const response = await axiosInstance.delete(url, opts);
      return response.data;
    },
    patch: async <T = any>(
      url: string,
      body: any,
      opts: AxiosRequestConfig = {},
    ): Promise<T> => {
      const response = await axiosInstance.patch(url, body, opts);
      return response.data;
    },
  });

  // Register the axios instance in the Awilix container
  fastify.diContainer.register({
    [name]: asValue(fetchInstance),
  });
}

export default fp<AxiosPluginOptions>((fastify) => {
  const { baseURL } = axiosConfig;

  axiosPlugin(fastify, {
    baseURL,
  });
});
