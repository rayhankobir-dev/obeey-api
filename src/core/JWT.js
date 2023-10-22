const path = require("path");
const { readFile } = require("fs");
const { sign, verify } = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { BadTokenError, TokenExpiredError } = require("./ApiError");

class JwtPayload {
  constructor(issuer, audience, subject, param, validity) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
    this.prm = param;
  }
}

async function readPublicKey() {
  return new Promise((resolve, reject) => {
    readFile(
      path.join(__dirname, "../../keys/public.pem"),
      "utf8",
      (err, data) => (err ? reject(err) : resolve(data))
    );
  });
}

async function readPrivateKey() {
  return new Promise((resolve, reject) => {
    readFile(
      path.join(__dirname, "../../keys/private.pem"),
      "utf8",
      (err, data) => (err ? reject(err) : resolve(data))
    );
  });
}

async function encode(payload) {
  const cert = await readPrivateKey();
  if (!cert) {
    throw new ApiError("Token generation failure");
  }
  return new Promise((resolve, reject) => {
    sign(payload, cert, { algorithm: "RS256" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

async function validate(token) {
  const cert = await readPublicKey();
  try {
    return await verify(token, cert);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new TokenExpiredError();
    } else {
      throw new BadTokenError();
    }
  }
}

async function decode(token) {
  const cert = await readPublicKey();
  try {
    return await verify(token, cert, { ignoreExpiration: true });
  } catch (err) {
    throw new BadTokenError();
  }
}

module.exports = {
  JwtPayload,
  JWT: {
    encode,
    validate,
    decode,
  },
};
