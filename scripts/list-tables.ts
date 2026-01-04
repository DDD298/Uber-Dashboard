import { sql } from "../src/lib/db";

async function listAllTables() {
  try {
    console.log("🔍 Đang kết nối đến Neontech DB...\n");

    // Query để lấy tất cả các table trong schema public
    const tables = await sql`
      SELECT 
        table_name,
        table_schema
      FROM 
        information_schema.tables
      WHERE 
        table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY 
        table_name;
    `;

    console.log(`✅ Tìm thấy ${tables.length} tables:\n`);
    console.log("=".repeat(80));

    for (const table of tables) {
      console.log(`\n📋 Table: ${table.table_name}`);
      
      // Lấy thông tin về các columns của mỗi table
      const columns = await sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'public'
          AND table_name = ${table.table_name}
        ORDER BY 
          ordinal_position;
      `;

      console.log(`   Columns (${columns.length}):`);
      columns.forEach((col: any) => {
        const nullable = col.is_nullable === "YES" ? "NULL" : "NOT NULL";
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : "";
        console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
      });

      console.log("=".repeat(80));
    }

    console.log(`\n✨ Hoàn thành! Tổng cộng ${tables.length} tables.`);
    
    // In ra danh sách tên tables
    console.log("\n📝 Danh sách tên tables:");
    tables.forEach((table: any, index: number) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
  } catch (error) {
    console.error("❌ Lỗi khi truy vấn database:", error);
    process.exit(1);
  }
}

listAllTables();

