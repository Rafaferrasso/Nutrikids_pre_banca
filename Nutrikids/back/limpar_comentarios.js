const mysql = require('mysql2/promise');

async function limparTodosComentarios() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rafaferrasso10',
    database: 'nutrikids',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('🧹 Limpando TODOS os comentários do sistema...');
    
    const [result] = await pool.execute('DELETE FROM comments');
    console.log(`✅ ${result.affectedRows} comentários foram removidos do banco de dados`);
    
    console.log('🗑️ Limpando localStorage dos comentários...');
    console.log('   (Esta limpeza será feita automaticamente no frontend)');
    
    await pool.end();
    console.log('✅ Limpeza concluída! O feed agora está sem comentários.');
    
  } catch (error) {
    console.error('❌ Erro ao limpar comentários:', error.message);
    await pool.end();
    process.exit(1);
  }
}

limparTodosComentarios();
