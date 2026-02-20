import { json } from "@sveltejs/kit";
import { d as db } from "../../../../../chunks/db.js";
import { v as verifyPassword, g as generateToken } from "../../../../../chunks/auth.js";
const POST = async ({ request }) => {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return json({ error: "Email and password are required" }, { status: 400 });
    }
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || !verifyPassword(password, user.password)) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    const token = generateToken(userPayload);
    return json(
      { user: userPayload, token },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Login failed" }, { status: 500 });
  }
};
export {
  POST
};
