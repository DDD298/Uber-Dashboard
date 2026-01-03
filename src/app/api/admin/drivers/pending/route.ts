import { NextRequest, NextResponse } from 'next/server';
import { executeSql } from '@/lib/db';

// GET /api/admin/drivers/pending - Lấy danh sách tài xế chờ duyệt
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;

    // Get total count of pending drivers
    const countResult = await executeSql<{ total: string }>(
      `SELECT COUNT(*) as total FROM drivers WHERE approval_status = 'pending'`,
      []
    );
    const total = parseInt(countResult[0].total);

    // Get pending drivers
    const drivers = await executeSql(
      `SELECT 
        d.*,
        (SELECT COUNT(*) FROM rides WHERE driver_id = d.id) as total_rides
      FROM drivers d
      WHERE approval_status = 'pending'
      ORDER BY created_at ASC
      LIMIT $1
      OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: drivers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching pending drivers:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách tài xế chờ duyệt', details: errorMessage },
      { status: 500 }
    );
  }
}
