import { NextRequest, NextResponse } from 'next/server';
import { executeSql } from '@/lib/db';

// POST /api/admin/drivers/[id]/approve - Duyệt hoặc từ chối tài xế
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = parseInt(params.id);
    const body = await request.json();
    const { approval_status, rejection_reason } = body;

    // Validate approval_status
    if (!approval_status || !['approved', 'rejected'].includes(approval_status)) {
      return NextResponse.json(
        { success: false, error: 'Trạng thái duyệt không hợp lệ' },
        { status: 400 }
      );
    }

    // If rejected, require rejection_reason
    if (approval_status === 'rejected' && !rejection_reason) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp lý do từ chối' },
        { status: 400 }
      );
    }

    // Check if driver exists
    const drivers = await executeSql(
      'SELECT id, approval_status FROM drivers WHERE id = $1',
      [driverId]
    );

    if (drivers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài xế' },
        { status: 404 }
      );
    }

    // Update driver approval status
    const updateFields: string[] = [
      'approval_status = $1',
      'approval_date = NOW()',
    ];
    const values: any[] = [approval_status];
    let paramIndex = 2;

    if (approval_status === 'approved') {
      updateFields.push(`status = $${paramIndex++}`);
      values.push('active');
    } else if (approval_status === 'rejected') {
      updateFields.push(`status = $${paramIndex++}`);
      values.push('rejected');
      updateFields.push(`rejection_reason = $${paramIndex++}`);
      values.push(rejection_reason);
    }

    values.push(driverId);

    const result = await executeSql(
      `UPDATE drivers
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return NextResponse.json({
      success: true,
      data: result[0],
      message: approval_status === 'approved' 
        ? 'Đã duyệt tài xế thành công' 
        : 'Đã từ chối tài xế',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error approving driver:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi duyệt tài xế', details: errorMessage },
      { status: 500 }
    );
  }
}
