import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

export const ShaEncrytion = (pwd, salt) =>
  crypto.pbkdf2Sync(pwd, salt, 500, 64, "sha256").toString("base64");

export const newShaEncrytion = (pwd) => {
  let encryptPwd;
  const salt = crypto.randomBytes(64).toString("base64");
  encryptPwd = crypto
    .pbkdf2Sync(pwd, salt, 500, 64, "sha256")
    .toString("base64");
  return {
    encryptPwd,
    salt,
  };
};
