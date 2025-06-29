async function handler() {
  const session = getSession();

  if (!session || !session.user) {
    return { error: "Authentication required" };
  }

  try {
    const requests = await sql`
      SELECT 
        cr.id,
        cr.request_type,
        cr.title,
        cr.scope_of_enquiry,
        cr.timeframe,
        cr.priority,
        cr.status,
        cr.notes,
        cr.documents,
        cr.related_request_id,
        cr.admin_notes,
        cr.created_at,
        cr.updated_at,
        cr.reviewed_at,
        cr.completed_at,
        au.id as user_id,
        au.name as user_name,
        au.email as user_email,
        cp.first_name,
        cp.last_name,
        cp.phone,
        cp.address,
        cp.date_of_birth,
        cp.emergency_contact_name,
        cp.emergency_contact_phone,
        cp.advocacy_needs,
        cp.case_status
      FROM client_requests cr
      JOIN auth_users au ON cr.user_id = au.id
      LEFT JOIN client_profiles cp ON cr.user_id = cp.user_id
      ORDER BY cr.created_at DESC
    `;

    return {
      success: true,
      requests: requests.map((request) => ({
        id: request.id,
        request_type: request.request_type,
        title: request.title,
        scope_of_enquiry: request.scope_of_enquiry,
        timeframe: request.timeframe,
        priority: request.priority,
        status: request.status,
        notes: request.notes,
        documents: request.documents,
        related_request_id: request.related_request_id,
        admin_notes: request.admin_notes,
        created_at: request.created_at,
        updated_at: request.updated_at,
        reviewed_at: request.reviewed_at,
        completed_at: request.completed_at,
        user: {
          id: request.user_id,
          name: request.user_name,
          email: request.user_email,
          profile: {
            first_name: request.first_name,
            last_name: request.last_name,
            phone: request.phone,
            address: request.address,
            date_of_birth: request.date_of_birth,
            emergency_contact_name: request.emergency_contact_name,
            emergency_contact_phone: request.emergency_contact_phone,
            advocacy_needs: request.advocacy_needs,
            case_status: request.case_status,
          },
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching all requests:", error);
    return {
      error: "Failed to fetch requests",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}