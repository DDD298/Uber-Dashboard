import { executeSql } from '../src/lib/db';

interface PromoCodeData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const promoCodesData: PromoCodeData[] = [
  {
    code: 'WELCOME2026',
    description: 'Mã giảm giá chào mừng năm mới 2026 - Giảm 20% cho chuyến đi đầu tiên',
    discount_type: 'percentage',
    discount_value: 20,
    max_discount_amount: 50000,
    min_order_amount: 50000,
    usage_limit: 1000,
    start_date: '2026-01-01',
    end_date: '2026-03-31',
    is_active: true,
  },
  {
    code: 'SAVE50K',
    description: 'Giảm ngay 50.000đ cho đơn hàng từ 200.000đ',
    discount_type: 'fixed',
    discount_value: 50000,
    max_discount_amount: undefined,
    min_order_amount: 200000,
    usage_limit: 500,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    is_active: true,
  },
  {
    code: 'FLASH30',
    description: 'Flash Sale - Giảm 30% tối đa 100.000đ',
    discount_type: 'percentage',
    discount_value: 30,
    max_discount_amount: 100000,
    min_order_amount: 100000,
    usage_limit: 200,
    start_date: '2026-01-03',
    end_date: '2026-01-10',
    is_active: true,
  },
  {
    code: 'WEEKEND15',
    description: 'Giảm 15% cho chuyến đi cuối tuần',
    discount_type: 'percentage',
    discount_value: 15,
    max_discount_amount: 75000,
    min_order_amount: 80000,
    usage_limit: undefined,
    start_date: '2026-01-01',
    end_date: '2026-06-30',
    is_active: true,
  },
  {
    code: 'PREMIUM100',
    description: 'Ưu đãi khách hàng VIP - Giảm 100.000đ',
    discount_type: 'fixed',
    discount_value: 100000,
    min_order_amount: 500000,
    usage_limit: 100,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    is_active: true,
  },
  {
    code: 'STUDENT10',
    description: 'Ưu đãi sinh viên - Giảm 10% mọi chuyến đi',
    discount_type: 'percentage',
    discount_value: 10,
    max_discount_amount: 30000,
    min_order_amount: 30000,
    usage_limit: undefined,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    is_active: true,
  },
  {
    code: 'EXPIRED2025',
    description: 'Mã giảm giá đã hết hạn - Giảm 25%',
    discount_type: 'percentage',
    discount_value: 25,
    max_discount_amount: 80000,
    min_order_amount: 60000,
    usage_limit: 300,
    start_date: '2025-11-01',
    end_date: '2025-12-31',
    is_active: false,
  },
  {
    code: 'MEGA50',
    description: 'Mega Sale - Giảm 50% tối đa 200.000đ cho đơn từ 300.000đ',
    discount_type: 'percentage',
    discount_value: 50,
    max_discount_amount: 200000,
    min_order_amount: 300000,
    usage_limit: 50,
    start_date: '2026-01-15',
    end_date: '2026-01-20',
    is_active: true,
  },
];

async function seedPromoCodes() {
  console.log('🌱 Starting promo codes seeding...\n');

  try {
    // Check if table exists and has data
    const existingCodes = await executeSql<{ count: string }>('SELECT COUNT(*) as count FROM promo_codes');
    const count = parseInt(existingCodes[0].count);
    
    if (count > 0) {
      console.log(`⚠️  Found ${count} existing promo codes in database.`);
      console.log('Do you want to continue? This will add more promo codes.');
      console.log('If you want to reset, please truncate the table first.\n');
    }

    let successCount = 0;
    let skipCount = 0;

    for (const promoCode of promoCodesData) {
      try {
        // Check if code already exists
        const existing = await executeSql(
          'SELECT id FROM promo_codes WHERE code = $1',
          [promoCode.code]
        );

        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${promoCode.code}" - already exists`);
          skipCount++;
          continue;
        }

        // Insert promo code
        await executeSql(
          `INSERT INTO promo_codes (
            code, description, discount_type, discount_value,
            max_discount_amount, min_order_amount, usage_limit,
            start_date, end_date, is_active, used_count
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0)`,
          [
            promoCode.code,
            promoCode.description,
            promoCode.discount_type,
            promoCode.discount_value,
            promoCode.max_discount_amount ?? null,
            promoCode.min_order_amount ?? null,
            promoCode.usage_limit ?? null,
            promoCode.start_date,
            promoCode.end_date,
            promoCode.is_active,
          ]
        );

        console.log(`✅ Created promo code: ${promoCode.code}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error creating promo code "${promoCode.code}":`, error);
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
    console.log(`   📝 Total in dataset: ${promoCodesData.length}`);
    
    // Show final count
    const finalCount = await executeSql<{ count: string }>('SELECT COUNT(*) as count FROM promo_codes');
    console.log(`   💾 Total in database: ${finalCount[0].count}\n`);
    
    console.log('✨ Promo codes seeding completed!\n');
  } catch (error) {
    console.error('❌ Error seeding promo codes:', error);
    throw error;
  }
}

// Run the seed function
seedPromoCodes()
  .then(() => {
    console.log('🎉 Seed script finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });
