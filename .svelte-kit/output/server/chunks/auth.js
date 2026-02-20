import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
const JWT_SECRET = process.env.JWT_SECRET || "vibetube-secret-key-change-in-production";
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}
function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
function generateToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
function getUserFromRequest(event) {
  const cookieHeader = event.request.headers.get("cookie");
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  const token = cookies.token;
  if (!token) return null;
  return verifyToken(token);
}
export {
  getUserFromRequest as a,
  generateToken as g,
  hashPassword as h,
  verifyPassword as v
};
