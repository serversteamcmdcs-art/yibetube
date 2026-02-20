import { json } from "@sveltejs/kit";
import { d as db } from "../../../../../chunks/db.js";
import { a as getUserFromRequest } from "../../../../../chunks/auth.js";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
const PUT = async (event) => {
  const user = getUserFromRequest(event);
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const email = formData.get("email");
    const description = formData.get("description");
    const avatarFile = formData.get("avatar");
    const bannerFile = formData.get("banner");
    if (!username || !email) {
      return json({ error: "Username and email are required" }, { status: 400 });
    }
    const existing = db.prepare(
      "SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?"
    ).get(username, email, user.id);
    if (existing) {
      return json({ error: "Username or email already taken" }, { status: 409 });
    }
    const uploadsDir = join(process.cwd(), "static", "uploads", "users");
    await mkdir(uploadsDir, { recursive: true });
    let avatarUrl = null;
    let bannerUrl = null;
    if (avatarFile && avatarFile.size > 0) {
      const avatarExt = avatarFile.name.split(".").pop();
      const avatarFilename = `avatar_${user.id}_${Date.now()}.${avatarExt}`;
      const avatarPath = join(uploadsDir, avatarFilename);
      const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());
      await writeFile(avatarPath, avatarBuffer);
      avatarUrl = `/uploads/users/${avatarFilename}`;
    }
    if (bannerFile && bannerFile.size > 0) {
      const bannerExt = bannerFile.name.split(".").pop();
      const bannerFilename = `banner_${user.id}_${Date.now()}.${bannerExt}`;
      const bannerPath = join(uploadsDir, bannerFilename);
      const bannerBuffer = Buffer.from(await bannerFile.arrayBuffer());
      await writeFile(bannerPath, bannerBuffer);
      bannerUrl = `/uploads/users/${bannerFilename}`;
    }
    const currentUser = db.prepare("SELECT avatar, banner FROM users WHERE id = ?").get(user.id);
    db.prepare(`
			UPDATE users 
			SET username = ?, email = ?, description = ?, avatar = ?, banner = ?
			WHERE id = ?
		`).run(
      username,
      email,
      description || null,
      avatarUrl || currentUser.avatar,
      bannerUrl || currentUser.banner,
      user.id
    );
    const updatedUser = db.prepare(`
			SELECT id, username, email, avatar, banner, description, created_at
			FROM users WHERE id = ?
		`).get(user.id);
    return json({ user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    return json({ error: "Failed to update profile" }, { status: 500 });
  }
};
export {
  PUT
};
