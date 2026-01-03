export interface IPromoCode {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IPromoCodeCreateInput {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export interface IPromoCodeUpdateInput {
  code?: string;
  description?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}
