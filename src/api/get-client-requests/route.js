async function handler() {
  const session = getSession();

  if (!session || !session.user) {
    return { error: "Authentication required" };
  }

  try {
    const requests = await sql`
      SELECT 
        id,
        request_type,
        title,
        scope_of_enquiry,
        timeframe,
        priority,
        status,
        notes,
        documents,
        related_request_id,
        admin_notes,
        created_at,
        updated_at,
        reviewed_at,
        completed_at
      FROM client_requests 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return { requests };
  } catch (error) {
    console.error("Error fetching client requests:", error);
    return { error: "Failed to fetch requests" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}