import ms from "ms";
import { forceString } from "../utils";

export const getjwtSecret = (): string =>
  forceString(process.env.JWT_SECRET_RESTAURANTS ?? process.env.JWT_SECRET);

export const getjwtExpiresIn = (): ms.StringValue =>
  (process.env.JWT_EXPIRES_IN_RESTAURANTS ??
    process.env.JWT_EXPIRES_IN ??
    "1d") as ms.StringValue;
