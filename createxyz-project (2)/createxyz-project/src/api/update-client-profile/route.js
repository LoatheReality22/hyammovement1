async function handler({
  first_name,
  last_name,
  phone,
  address,
  date_of_birth,
  emergency_contact_name,
  emergency_contact_phone,
  advocacy_needs,
}) {
  const session = getSession();

  if (!session || !session.user?.id) {
    return { error: "Not authenticated" };
  }

  const existingProfile = await sql`
    SELECT id FROM client_profiles 
    WHERE user_id = ${session.user.id}
  `;

  if (existingProfile.length > 0) {
    const setClauses = [];
    const values = [];
    let paramCount = 0;

    if (first_name !== undefined) {
      setClauses.push(`first_name = $${++paramCount}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      setClauses.push(`last_name = $${++paramCount}`);
      values.push(last_name);
    }
    if (phone !== undefined) {
      setClauses.push(`phone = $${++paramCount}`);
      values.push(phone);
    }
    if (address !== undefined) {
      setClauses.push(`address = $${++paramCount}`);
      values.push(address);
    }
    if (date_of_birth !== undefined) {
      setClauses.push(`date_of_birth = $${++paramCount}`);
      values.push(date_of_birth);
    }
    if (emergency_contact_name !== undefined) {
      setClauses.push(`emergency_contact_name = $${++paramCount}`);
      values.push(emergency_contact_name);
    }
    if (emergency_contact_phone !== undefined) {
      setClauses.push(`emergency_contact_phone = $${++paramCount}`);
      values.push(emergency_contact_phone);
    }
    if (advocacy_needs !== undefined) {
      setClauses.push(`advocacy_needs = $${++paramCount}`);
      values.push(advocacy_needs);
    }

    if (setClauses.length === 0) {
      return { error: "No fields to update" };
    }

    setClauses.push(`updated_at = $${++paramCount}`);
    values.push(new Date());

    const updateQuery = `
      UPDATE client_profiles 
      SET ${setClauses.join(", ")}
      WHERE user_id = $${++paramCount}
      RETURNING *
    `;
    values.push(session.user.id);

    const updatedProfile = await sql(updateQuery, values);
    return { success: true, profile: updatedProfile[0] };
  } else {
    const newProfile = await sql`
      INSERT INTO client_profiles (
        user_id, first_name, last_name, phone, address, date_of_birth,
        emergency_contact_name, emergency_contact_phone, advocacy_needs
      ) VALUES (
        ${session.user.id}, ${first_name || null}, ${last_name || null}, 
        ${phone || null}, ${address || null}, ${date_of_birth || null},
        ${emergency_contact_name || null}, ${emergency_contact_phone || null}, 
        ${advocacy_needs || null}
      )
      RETURNING *
    `;
    return { success: true, profile: newProfile[0] };
  }
}
export async function POST(request) {
  return handler(await request.json());
}