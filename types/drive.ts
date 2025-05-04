import { FSDriverOptions } from "flydrive/drivers/fs/types";
import { S3DriverOptions } from "flydrive/drivers/s3/types";
import { DriverContract } from "flydrive/types";

export type Services = {
  [DriveDisks.Local]: () => DriverContract;
  [DriveDisks.S3]: () => DriverContract;
};

export enum DriveDisks {
  Local = "local",
  S3 = "s3",
}

export type DriveConfig = {
  defaultDisk: DriveDisks;
  disks: {
    local: FSDriverOptions;
    s3: S3DriverOptions;
  };
};
