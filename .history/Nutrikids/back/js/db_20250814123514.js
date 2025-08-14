const mysql = require('mysql2/promise');

// Configurações de conexão
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'rafaferrasso10',
  database: 'nutrikids',
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
        description TEXT,
        ingredients TEXT,
        instructions TEXT,
        image VARCHAR(255),
        category VARCHAR(100),
        prep_time INT,
        servings INT,
        difficulty ENUM('Fácil', 'Médio', 'Difícil') DEFAULT 'Fácil',
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
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
        title: 'Panqueca de Banana',
        description: 'Panqueca saudável e deliciosa feita com banana',
        ingredients: 'Banana, ovos, aveia, leite',
        instructions: 'Misture todos os ingredientes e faça na frigideira',
        image: '/front/imagem/panqueca.jpg',
        category: 'Café da Manhã',
        prep_time: 15,
        servings: 2,
        difficulty: 'Fácil'
      },
      {
        title: 'Vitamina de Frutas',
        description: 'Vitamina nutritiva com frutas variadas',
        ingredients: 'Frutas variadas, leite, mel',
        instructions: 'Bata tudo no liquidificador',
        image: '/front/imagem/fruta.jpeg',
        category: 'Bebidas',
        prep_time: 5,
        servings: 1,
        difficulty: 'Fácil'
      },
      {
        title: 'Pote Saudável',
        description: 'Pote com ingredientes nutritivos',
        ingredients: 'Granola, iogurte, frutas',
        instructions: 'Monte em camadas no pote',
        image: '/front/imagem/pote.jpg',
        category: 'Lanche',
        prep_time: 10,
        servings: 1,
        difficulty: 'Fácil'
      },
      {
        title: 'Doce Natural',
        description: 'Doce feito com ingredientes naturais',
        ingredients: 'Tâmaras, nozes, cacau',
        instructions: 'Processe tudo e forme bolinhas',
        image: '/front/imagem/doce1.png',
        category: 'Sobremesa',
        prep_time: 20,
        servings: 8,
        difficulty: 'Médio'
      },
      {
        title: 'Sopa Nutritiva',
        description: 'Sopa rica em vegetais',
        ingredients: 'Vegetais variados, caldo, temperos',
        instructions: 'Refogue e cozinhe todos os ingredientes',
        image: '/front/imagem/sopa.jpeg',
        category: 'Jantar',
        prep_time: 40,
        servings: 4,
        difficulty: 'Médio'
      }
    ];

    for (const recipe of sampleRecipes) {
      await pool.execute(`
        INSERT INTO recipes (title, description, ingredients, instructions, image, category, prep_time, servings, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        recipe.title,
        recipe.description,
        recipe.ingredients,
        recipe.instructions,
        recipe.image,
        recipe.category,
        recipe.prep_time,
        recipe.servings,
        recipe.difficulty
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
