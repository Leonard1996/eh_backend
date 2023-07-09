const jwkToPem = require("jwk-to-pem");
const { decode, verify } = require("jsonwebtoken");
import * as jwks from "../authentication/keys.json";

const validateToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const pems = {};
  const keys = jwks["keys"];
  for (let i = 0; i < keys.length; i++) {
    //Convert each key to PEM
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    pems[key_id] = pem;
  }
  //validate the token
  const decodedJwt = decode(token, { complete: true });
  if (!decodedJwt) {
    return res.status(401).json("Not a valid JWT token");
  }

  const kid = decodedJwt.header?.kid;
  const pem = pems[kid];
  if (!pem) {
    return res.status(401).json("Invalid token");
  }

  verify(token, pem, function (err, payload) {
    if (err) {
      return res.status(401).json("Invalid token");
    } else {
      next();
    }
  });
};

const decodeToken = async (token) => {
  const pems = {};
  const keys = jwks["keys"];
  for (let i = 0; i < keys.length; i++) {
    //Convert each key to PEM
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    pems[key_id] = pem;
  }
  //validate the token
  const decodedJwt = decode(token, { complete: true });
  if (!decodedJwt) {
    return {
      statusCode: "400",
      message: "Invalid Token",
    };
  }

  const kid = decodedJwt.header.kid;
  const pem = pems[kid];
  if (!pem) {
    return {
      statusCode: "400",
      message: "Invalid Token",
    };
  }

  const payload = verify(token, pem, function (err, payload) {
    if (err) {
      return {
        statusCode: "400",
        message: "Invalid Token",
      };
    } else {
      return payload;
    }
  });
  return payload;
};

module.exports = { validateToken, decodeToken };
