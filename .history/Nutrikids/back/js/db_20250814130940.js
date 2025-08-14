const mysql = require('mysql2/promise');

// Configurações de conexão
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root', // Ajuste esta senha conforme sua configuração do MySQL
  database: 'nutrikids', // Mesmo nome usado no script SQL
  port: 3306,
  multipleStatements: true
};

// Pool de conexões
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar conexão
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error.message);
    throw error;
  }
};

// Função para criar tabelas se não existirem
const initTables = async () => {
  try {
    console.log('🔄 Verificando/criando tabelas do banco...');
    
    // Garantir que o banco de dados existe
    await pool.execute('CREATE DATABASE IF NOT EXISTS nutrikids');

    // Criar tabela de usuários
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de receitas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de curtidas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        recipe_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_like (user_id, recipe_id)
      )
    `);

    // Criar tabela de comentários
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        recipe_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
      )
    `);

    // Criar tabela de receitas de usuário
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        ingredients TEXT NOT NULL,
        description TEXT NOT NULL,
        inspiration VARCHAR(255) DEFAULT NULL,
        image_path VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Todas as tabelas foram verificadas/criadas com sucesso!');
    
    // Verificar se o usuário admin existe e criá-lo se necessário
    const [adminCount] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE email = ?', ['rafaferrasso@nutrikids.com']);
    
    if (adminCount[0].count === 0) {
      console.log('👤 Criando usuário administrador padrão...');
      await pool.execute(
        'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
        ['Admin Nutri Kids', 'rafaferrasso@nutrikids.com', '123456789', '/front/imagem/user.png']
      );
      console.log('✅ Usuário administrador criado com sucesso!');
    } else {
      console.log('👤 Usuário administrador já existe!');
      
      // Atualize a senha do admin para garantir que está correta
      await pool.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        ['123456789', 'rafaferrasso@nutrikids.com']
      );
      console.log('✅ Senha do administrador verificada/atualizada!');
    }

    // Verificar se já existem receitas de exemplo
    const [recipeCount] = await pool.execute('SELECT COUNT(*) as count FROM recipes');
    
    if (recipeCount[0].count === 0) {
      console.log('📝 Inserindo receitas de exemplo...');
      await insertSampleRecipes();
    } else {
      console.log(`📊 ${recipeCount[0].count} receitas já existem no banco.`);
    }

  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
};

// Função para inserir receitas de exemplo
const insertSampleRecipes = async () => {
  try {
    const sampleRecipes = [
      {
        title: 'Panqueca Divertida',
        image_url: '/front/imagem/panqueca.jpeg',
        author: 'Admin',
        category: 'Café Mágico',
        file_path: '/front/receitas/panqueca.html'
      },
      {
        title: 'Pãozinho Caseiro',
        image_url: '/front/imagem/paochoc.png',
        author: 'Admin',
        category: 'Café Mágico',
        file_path: '/front/receitas/pao.html'
      },
      {
        title: 'Salada de Frutas',
        image_url: '/front/imagem/frutasobri.jpeg',
        author: 'Admin',
        category: 'Café Mágico',
        file_path: '/front/receitas/frutas.html'
      },
      {
        title: 'Vitamina de Frutas',
        image_url: '/front/imagem/fruta.jpeg',
        author: 'Admin',
        category: 'Café Mágico',
        file_path: '/front/receitas/vitamina.html'
      },
      {
        title: 'Sopa Nutritiva',
        image_url: '/front/imagem/sopa.jpeg',
        author: 'Admin',
        category: 'Janta Alegria',
        file_path: '/front/receitas/sopa.html'
      }
    ];

    for (const recipe of sampleRecipes) {
      await pool.execute(`
        INSERT INTO recipes (title, image_url, author, category, file_path)
        VALUES (?, ?, ?, ?, ?)
      `, [
        recipe.title,
        recipe.image_url,
        recipe.author,
        recipe.category,
        recipe.file_path
      ]);
    }

    console.log('✅ Receitas de exemplo inseridas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir receitas de exemplo:', error);
  }
};

module.exports = {
  pool,
  testConnection,
  initTables
};
