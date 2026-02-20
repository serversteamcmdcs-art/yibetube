import { json } from "@sveltejs/kit";
const POST = async () => {
  return json(
    { success: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": "token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
      }
    }
  );
};
export {
  POST
};
