import { executeSql } from '../src/lib/db';

async function createPromoCodesTable() {
  console.log('🚀 Creating promo_codes table...\n');

  try {
    // Create table
    console.log('📝 Creating table structure...');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
        max_discount_amount DECIMAL(10,2),
        min_order_amount DECIMAL(10,2),
        usage_limit INTEGER,
        used_count INTEGER DEFAULT 0 NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT valid_dates CHECK (end_date >= start_date)
      )
    `);
    console.log('✅ Table created successfully\n');

    // Create indexes
    console.log('📝 Creating indexes...');
    
    await executeSql(`
      CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code)
    `);
    console.log('✅ Index on code created');

    await executeSql(`
      CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active)
    `);
    console.log('✅ Index on is_active created');

    await executeSql(`
      CREATE INDEX IF NOT EXISTS idx_promo_codes_dates ON promo_codes(start_date, end_date)
    `);
    console.log('✅ Index on dates created\n');

    console.log('✨ Migration completed successfully!\n');
    
    // Verify table
    const result = await executeSql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'promo_codes'
    `);

    if (result.length > 0) {
      console.log('✅ Table "promo_codes" verified in database\n');
      
      // Show table structure
      const columns = await executeSql(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'promo_codes'
        ORDER BY ordinal_position
      `);
      
      console.log('📋 Table structure:');
      console.table(columns);
    }

  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('⏭️  Table already exists\n');
      
      // Still verify it
      const columns = await executeSql(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'promo_codes'
        ORDER BY ordinal_position
      `);
      
      console.log('📋 Existing table structure:');
      console.table(columns);
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

// Run the migration
createPromoCodesTable()
  .then(() => {
    console.log('\n🎉 Migration finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
