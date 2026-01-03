import { NextRequest, NextResponse } from 'next/server';
import { executeSql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('is_active');
    
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM promo_codes WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (search) {
      query += ` AND (code ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query += ` AND is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }
    
    query += ' ORDER BY created_at DESC';
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await executeSql(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM promo_codes WHERE 1=1';
    const countParams: any[] = [];
    let countParamIndex = 1;
    
    if (search) {
      countQuery += ` AND (code ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      countQuery += ` AND is_active = $${countParamIndex}`;
      countParams.push(isActive === 'true');
    }
    
    const countResult = await executeSql<{ count: string }>(countQuery, countParams);
    const total = parseInt(countResult[0].count);
    
    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy danh sách mã giảm giá' },
      { status: 500 }
    );
  }
}

// POST /api/admin/promo-codes - Tạo mã giảm giá mới
export async function POST(request: NextRequest) {
  try {
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
      is_active = true,
    } = body;
    
    // Validate required fields
    if (!code || !description || !discount_type || !discount_value || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }
    
    // Check if code already exists
    const existingCode = await executeSql(
      'SELECT id FROM promo_codes WHERE code = $1',
      [code]
    );
    
    if (existingCode.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Mã giảm giá đã tồn tại' },
        { status: 400 }
      );
    }
    
    const result = await executeSql(
      `INSERT INTO promo_codes (
        code, description, discount_type, discount_value,
        max_discount_amount, min_order_amount, usage_limit,
        start_date, end_date, is_active, used_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0)
      RETURNING *`,
      [
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
      ]
    );
    
    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Tạo mã giảm giá thành công',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tạo mã giảm giá' },
      { status: 500 }
    );
  }
}
