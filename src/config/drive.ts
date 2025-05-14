import { DriveDisks, DriveConfig } from "@app-types/drive.js";

const driveConfig: DriveConfig = {
  defaultDisk: process.env.DEFAULT_DISK
    ? Object.values(DriveDisks).includes(process.env.DEFAULT_DISK as DriveDisks)
      ? (process.env.DEFAULT_DISK as DriveDisks)
      : DriveDisks.Local
    : DriveDisks.Local,
  disks: {
    local: {
      location: new URL("./data", import.meta.url),
      visibility: "public",
    },

    s3: {
      bucket: process.env.S3_BUCKET ?? "default",
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      },
      visibility: "public",
    },
  },
};

export default driveConfig;
