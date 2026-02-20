import { json } from "@sveltejs/kit";
import { a as getUserFromRequest } from "../../../../../chunks/auth.js";
import { d as db } from "../../../../../chunks/db.js";
const GET = async (event) => {
  const user = getUserFromRequest(event);
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const fullUser = db.prepare(`
		SELECT id, username, email, avatar, banner, description, created_at
		FROM users WHERE id = ?
	`).get(user.id);
  return json({ user: fullUser });
};
export {
  GET
};
