async function handler() {
  const session = getSession();

  if (!session || !session.user?.id) {
    return null;
  }

  const profiles = await sql`
    SELECT * FROM client_profiles 
    WHERE user_id = ${session.user.id}
  `;

  if (profiles.length === 0) {
    return null;
  }

  return profiles[0];
}
export async function POST(request) {
  return handler(await request.json());
}