import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - Get single warning
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const warningId = parseInt(params.id);

    const warnings = await sql(
      `SELECT 
        w.*,
        json_build_object(
          'driver_id', d.id,
          'first_name', d.first_name,
          'last_name', d.last_name,
          'email', d.email,
          'phone', d.phone,
          'status', d.status,
          'average_rating', d.average_rating,
          'warning_count', d.warning_count,
          'bad_ratings_count', d.bad_ratings_count
        ) as driver,
        CASE 
          WHEN w.rating_id IS NOT NULL THEN (
            SELECT json_build_object(
              'id', r.id,
              'stars', r.stars,
              'comment', r.comment,
              'ride_id', r.ride_id,
              'created_at', r.created_at
            )
            FROM ratings r
            WHERE r.id = w.rating_id
          )
          ELSE NULL
        END as rating
      FROM driver_warnings w
      INNER JOIN drivers d ON w.driver_id = d.id
      WHERE w.id = $1`,
      [warningId]
    );

    if (warnings.length === 0) {
      return NextResponse.json(
        { success: false, error: "Warning not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: warnings[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update warning (resolve, add notes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const warningId = parseInt(params.id);
    const body = await request.json();
    const { resolved_by, notes, action_taken } = body;

    const updates: string[] = ["resolved_at = NOW()"];
    const values: any[] = [];
    let paramIndex = 1;

    if (resolved_by !== undefined) {
      updates.push(`resolved_by = $${paramIndex++}`);
      values.push(resolved_by);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }
    if (action_taken !== undefined) {
      updates.push(`action_taken = $${paramIndex++}`);
      values.push(action_taken);
    }

    values.push(warningId);

    const result = await sql(
      `UPDATE driver_warnings
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Warning not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete warning
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const warningId = parseInt(params.id);

    const result = await sql(
      `DELETE FROM driver_warnings WHERE id = $1 RETURNING *`,
      [warningId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Warning not found" },
        { status: 404 }
      );
    }

    // Decrease driver warning count
    await sql(
      `UPDATE drivers
       SET warning_count = GREATEST(warning_count - 1, 0)
       WHERE id = $1`,
      [result[0].driver_id]
    );

    return NextResponse.json({
      success: true,
      message: "Warning deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
