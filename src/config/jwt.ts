import { Algorithm } from "fast-jwt";

type JWTConfig = {
  secret: string;
  algorithm: Algorithm;
  iss: string;
  allowedIss: string;
};

const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET ?? "",
  algorithm: (process.env.JWT_ALGORITHM as Algorithm) ?? "HS512",
  iss: process.env.JWT_ISS ?? "http://localhost:3000",
  allowedIss: process.env.JWT_ALLOWED_ISS ?? "http://localhost:3000",
};

export default jwtConfig;
