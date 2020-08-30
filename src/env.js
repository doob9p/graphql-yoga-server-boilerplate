import dotenv from "dotenv";
import pathModule from "path";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: pathModule.resolve(__dirname, "../.env.production") });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: pathModule.resolve(__dirname, "../.env.development") });
} else {
  throw new Error("env 설정이 올바르지 않습니다.");
}
