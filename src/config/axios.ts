export type AxiosConfig = {
  baseURL: string;
  user: string;
  password: string;
};

export const axiosConfig: AxiosConfig = {
  baseURL: process.env.ABACUS_BASE_URL ?? "",
  user: process.env.ABACUS_USER ?? "",
  password: process.env.ABACUS_PASSWORD ?? "",
};
