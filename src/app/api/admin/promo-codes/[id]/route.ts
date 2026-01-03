import { NextRequest, NextResponse } from 'next/server';
import { executeSql } from '@/lib/db';

// GET /api/admin/promo-codes/[id] - Lấy chi tiết mã giảm giá
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await executeSql(
      'SELECT * FROM promo_codes WHERE id = $1',
      [id]
    );
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Error fetching promo code:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy thông tin mã giảm giá' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/promo-codes/[id] - Cập nhật mã giảm giá
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      code,
      description,
      discount_type,
      discount_value,
      max_discount_amount,
      min_order_amount,
      usage_limit,
      start_date,
      end_date,
      is_active,
    } = body;
    
    // Check if promo code exists
    const existing = await executeSql(
      'SELECT id FROM promo_codes WHERE id = $1',
      [id]
    );
    
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
      );
    }
    
    // Check if code is being changed and already exists
    if (code) {
      const codeExists = await executeSql(
        'SELECT id FROM promo_codes WHERE code = $1 AND id != $2',
        [code, id]
      );
      
      if (codeExists.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Mã giảm giá đã tồn tại' },
          { status: 400 }
        );
      }
    }
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (code !== undefined) {
      updates.push(`code = $${paramIndex++}`);
      values.push(code);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (discount_type !== undefined) {
      updates.push(`discount_type = $${paramIndex++}`);
      values.push(discount_type);
    }
    if (discount_value !== undefined) {
      updates.push(`discount_value = $${paramIndex++}`);
      values.push(discount_value);
    }
    if (max_discount_amount !== undefined) {
      updates.push(`max_discount_amount = $${paramIndex++}`);
      values.push(max_discount_amount);
    }
    if (min_order_amount !== undefined) {
      updates.push(`min_order_amount = $${paramIndex++}`);
      values.push(min_order_amount);
    }
    if (usage_limit !== undefined) {
      updates.push(`usage_limit = $${paramIndex++}`);
      values.push(usage_limit);
    }
    if (start_date !== undefined) {
      updates.push(`start_date = $${paramIndex++}`);
      values.push(start_date);
    }
    if (end_date !== undefined) {
      updates.push(`end_date = $${paramIndex++}`);
      values.push(end_date);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `
      UPDATE promo_codes
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await executeSql(query, values);
    
    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Cập nhật mã giảm giá thành công',
    });
  } catch (error) {
    console.error('Error updating promo code:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật mã giảm giá' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/promo-codes/[id] - Xóa mã giảm giá
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await executeSql(
      'DELETE FROM promo_codes WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Xóa mã giảm giá thành công',
    });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa mã giảm giá' },
      { status: 500 }
    );
  }
}
