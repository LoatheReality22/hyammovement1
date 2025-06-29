async function handler() {
  const session = getSession();

  if (!session || !session.user?.id) {
    return { isAdmin: false };
  }

  try {
    const user = await sql`
      SELECT role FROM auth_users 
      WHERE id = ${session.user.id}
    `;

    if (user.length === 0) {
      return { isAdmin: false };
    }

    return { isAdmin: user[0].role === "admin" };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false };
  }
}
export async function POST(request) {
  return handler(await request.json());
}