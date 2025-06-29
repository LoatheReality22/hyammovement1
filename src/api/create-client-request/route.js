async function handler({
  request_type,
  title,
  scope_of_enquiry,
  timeframe,
  priority = "medium",
  notes,
  documents = [],
  related_request_id,
}) {
  const session = getSession();

  if (!session || !session.user?.id) {
    return { error: "Not authenticated" };
  }

  if (!request_type || !title || !scope_of_enquiry) {
    return {
      error:
        "Missing required fields: request_type, title, and scope_of_enquiry are required",
    };
  }

  if (!["new", "update"].includes(request_type)) {
    return { error: "Invalid request_type. Must be 'new' or 'update'" };
  }

  if (!["low", "medium", "high", "urgent"].includes(priority)) {
    return {
      error: "Invalid priority. Must be 'low', 'medium', 'high', or 'urgent'",
    };
  }

  try {
    const newRequest = await sql`
      INSERT INTO client_requests (
        user_id,
        request_type,
        title,
        scope_of_enquiry,
        timeframe,
        priority,
        notes,
        documents,
        related_request_id,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${session.user.id},
        ${request_type},
        ${title},
        ${scope_of_enquiry},
        ${timeframe || null},
        ${priority},
        ${notes || null},
        ${JSON.stringify(documents)},
        ${related_request_id || null},
        'pending',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    return {
      success: true,
      request: newRequest[0],
      message: "Client request created successfully",
    };
  } catch (error) {
    console.error("Error creating client request:", error);
    return { error: "Failed to create client request" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}