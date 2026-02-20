import { json } from "@sveltejs/kit";
import { d as db } from "../../../../../../chunks/db.js";
import { a as getUserFromRequest } from "../../../../../../chunks/auth.js";
const POST = async (event) => {
  const user = getUserFromRequest(event);
  if (!user) return json({ error: "Unauthorized" }, { status: 401 });
  try {
    const commentId = event.params.id;
    const { type } = await event.request.json();
    if (!["like", "dislike"].includes(type)) {
      return json({ error: "Invalid type" }, { status: 400 });
    }
    const existing = db.prepare(
      "SELECT type FROM comment_likes WHERE comment_id = ? AND user_id = ?"
    ).get(commentId, user.id);
    if (existing) {
      if (existing.type === type) {
        db.prepare("DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?").run(commentId, user.id);
        return json({ action: "removed" });
      } else {
        db.prepare("UPDATE comment_likes SET type = ? WHERE comment_id = ? AND user_id = ?").run(type, commentId, user.id);
        return json({ action: "updated", type });
      }
    } else {
      db.prepare("INSERT INTO comment_likes (comment_id, user_id, type) VALUES (?, ?, ?)").run(commentId, user.id, type);
      return json({ action: "added", type });
    }
  } catch (error) {
    console.error("Comment like error:", error);
    return json({ error: "Failed to like comment" }, { status: 500 });
  }
};
const GET = async (event) => {
  const user = getUserFromRequest(event);
  if (!user) return json({ like: null });
  try {
    const commentId = event.params.id;
    const like = db.prepare(
      "SELECT type FROM comment_likes WHERE comment_id = ? AND user_id = ?"
    ).get(commentId, user.id);
    return json({ like: like?.type || null });
  } catch (error) {
    return json({ like: null });
  }
};
export {
  GET,
  POST
};
