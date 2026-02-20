import { json } from "@sveltejs/kit";
import { d as db } from "../../../../../../chunks/db.js";
import { a as getUserFromRequest } from "../../../../../../chunks/auth.js";
const POST = async (event) => {
  const user = getUserFromRequest(event);
  if (!user) return json({ error: "Unauthorized" }, { status: 401 });
  try {
    const commentId = event.params.id;
    const comment = db.prepare(`
			SELECT c.*, v.user_id as video_author_id
			FROM comments c
			JOIN videos v ON c.video_id = v.id
			WHERE c.id = ?
		`).get(commentId);
    if (!comment) {
      return json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.video_author_id !== user.id) {
      return json({ error: "Only video author can heart comments" }, { status: 403 });
    }
    const newHearted = comment.is_hearted ? 0 : 1;
    db.prepare("UPDATE comments SET is_hearted = ? WHERE id = ?").run(newHearted, commentId);
    return json({ is_hearted: newHearted });
  } catch (error) {
    console.error("Heart error:", error);
    return json({ error: "Failed to heart comment" }, { status: 500 });
  }
};
export {
  POST
};
