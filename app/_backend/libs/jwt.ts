import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!;

/* ================= GENERATE TOKEN ================= */

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d"
  });
};

/* ================= VERIFY TOKEN ================= */

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};