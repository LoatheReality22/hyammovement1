async function handler({ request_id, status, admin_notes }) {
  const session = getSession();

  if (!session || !session.user) {
    return { error: "Authentication required" };
  }

  if (!request_id || !status) {
    return {
      error: "Missing required fields: request_id and status are required",
    };
  }

  const validStatuses = [
    "pending",
    "under_review",
    "accepted",
    "denied",
    "completed",
  ];
  if (!validStatuses.includes(status)) {
    return {
      error:
        "Invalid status. Must be one of: pending, under_review, accepted, denied, completed",
    };
  }

  try {
    const existingRequest = await sql`
      SELECT id, status FROM client_requests 
      WHERE id = ${request_id}
    `;

    if (existingRequest.length === 0) {
      return { error: "Request not found" };
    }

    const setClauses = ["status = $1", "updated_at = $2"];
    const values = [status, new Date()];
    let paramCount = 2;

    if (admin_notes !== undefined) {
      setClauses.push(`admin_notes = $${++paramCount}`);
      values.push(admin_notes);
    }

    if (
      status === "under_review" ||
      status === "accepted" ||
      status === "denied"
    ) {
      setClauses.push(`reviewed_at = $${++paramCount}`);
      values.push(new Date());
    }

    if (status === "completed") {
      setClauses.push(`completed_at = $${++paramCount}`);
      values.push(new Date());
    }

    const updateQuery = `
      UPDATE client_requests 
      SET ${setClauses.join(", ")}
      WHERE id = $${++paramCount}
      RETURNING *
    `;
    values.push(request_id);

    const updatedRequest = await sql(updateQuery, values);

    return {
      success: true,
      request: updatedRequest[0],
      message: `Request status updated to ${status}`,
    };
  } catch (error) {
    console.error("Error updating request status:", error);
    return { error: "Failed to update request status" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}