const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { pool, testConnection, initTables } = require('./js/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use('/front', express.static(path.join(__dirname, '../front')));
// Servir imagens especificamente
app.use('/imagem', express.static(path.join(__dirname, '../front/imagem')));
// Servir também diretamente na raiz para compatibilidade
app.use(express.static(path.join(__dirname, '../front')));

// Configuração do multer para upload de imagens
const fs = require('fs');
const uploadsPath = path.join(__dirname, '../front/imagem/uploads/');

// Garantir que a pasta uploads existe
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'user-recipe-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  }
});

// ===================== ROTAS DE AUTENTICAÇÃO =====================

// Rota de registro
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('\n👤 NOVA TENTATIVA DE CADASTRO:');
    console.log('📧 Email:', email);
    console.log('👤 Nome:', name);

    if (!name || !email || !password) {
      console.log('❌ Cadastro rejeitado: campos obrigatórios faltando');
      return res.status(400).json({ 
        success: false, 
        message: 'Nome, email e senha são obrigatórios' 
      });
    }

    // Verificar se email já existe
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      console.log('❌ Cadastro rejeitado: email já existe -', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Email já cadastrado' 
      });
    }

    // Inserir novo usuário
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    console.log('✅ CADASTRO REALIZADO COM SUCESSO!');
    console.log('🆔 ID do usuário:', result.insertId);
    console.log('👤 Nome:', name);
    console.log('📧 Email:', email);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({ 
      success: true, 
      message: 'Usuário cadastrado com sucesso!',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('\n🔑 NOVA TENTATIVA DE LOGIN:');
    console.log('📧 Email:', email);

    if (!email || !password) {
      console.log('❌ Login rejeitado: email ou senha faltando');
      return res.status(400).json({ 
        success: false, 
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar o usuário pelo email
    const [emailCheck] = await pool.execute(
      'SELECT id, name, email, password, avatar FROM users WHERE email = ?',
      [email]
    );

    console.log('📊 Resultado da busca de usuário:', JSON.stringify(emailCheck));
    
    if (emailCheck.length === 0) {
      console.log('❌ Login rejeitado: email não encontrado -', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou senha incorretos' 
      });
    }

    const user = emailCheck[0];
    console.log('🔍 Senha informada:', password);
    console.log('🔍 Senha armazenada:', user.password);

    // Verificar senha
    if (user.password !== password) {
      console.log('❌ Login rejeitado: senha incorreta para -', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou senha incorretos' 
      });
    }

    console.log('✅ LOGIN REALIZADO COM SUCESSO!');
    console.log('🆔 ID do usuário:', user.id);
    console.log('👤 Nome:', user.name);
    console.log('📧 Email:', user.email);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({ 
      success: true, 
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('💥 Erro no login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// ===================== ROTAS DE PERFIL =====================

app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await pool.execute(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    res.json({ 
      success: true, 
      user: users[0] 
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// ===================== ROTAS DE RECEITAS =====================

app.get('/recipes', async (req, res) => {
  try {
    const [recipes] = await pool.execute(
      'SELECT * FROM recipes ORDER BY created_at DESC'
    );

    res.json({ 
      success: true, 
      recipes 
    });

  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Rota para criar receita de usuário com upload de imagem
app.post('/user-recipes', upload.single('imagemReceita'), async (req, res) => {
  try {
    console.log('\n🍳 NOVA RECEITA RECEBIDA:');
    console.log('📝 Body:', req.body);
    console.log('📸 Arquivo:', req.file);
    
    const { nome, categoria, ingredientes, descricao, inspiracao, userId = 1 } = req.body;

    if (!nome || !categoria || !ingredientes || !descricao) {
      console.log('❌ Campos obrigatórios faltando');
      return res.status(400).json({ 
        success: false, 
        message: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }

    // Caminho da imagem uploaded
    let imagemPath = null;
    if (req.file) {
      imagemPath = `/front/imagem/uploads/${req.file.filename}`;
      console.log('✅ Imagem salva com sucesso!');
      console.log('📁 Caminho completo:', req.file.path);
      console.log('🔗 Caminho relativo para DB:', imagemPath);
    } else {
      console.log('⚠️ Nenhuma imagem foi enviada');
    }

    // Inserir receita na base de dados
    const [result] = await pool.execute(
      'INSERT INTO user_recipes (user_id, name, category, ingredients, description, inspiration, image_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [userId, nome, categoria, ingredientes, descricao, inspiracao, imagemPath]
    );

    console.log('💾 Receita salva no banco com ID:', result.insertId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({ 
      success: true, 
      message: 'Receita criada com sucesso!',
      recipeId: result.insertId,
      imagePath: imagemPath
    });

  } catch (error) {
    console.error('❌ ERRO ao criar receita:', error);
    
    // Se o erro for de upload, dar mais detalhes
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'Arquivo muito grande! Máximo 5MB permitido.' 
      });
    }
    
    if (error.message.includes('imagens são permitidas')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Apenas arquivos de imagem são permitidos!' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor: ' + error.message 
    });
  }
});

// Rota para buscar receitas do usuário
app.get('/user-recipes/:userId?', async (req, res) => {
  try {
    const userId = req.params.userId || 1; // Default para user ID 1

    const [recipes] = await pool.execute(
      'SELECT * FROM user_recipes WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ 
      success: true, 
      recipes 
    });

  } catch (error) {
    console.error('Erro ao buscar receitas do usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Rota para excluir receita do usuário
app.delete('/user-recipes/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM user_recipes WHERE id = ?',
      [recipeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receita não encontrada' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Receita excluída com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// ===================== ROTAS DE CURTIDAS =====================

app.post('/like', async (req, res) => {
  try {
    const { user_id: userId, recipe_id: recipeId, liked } = req.body;

    if (!userId || !recipeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do usuário e da receita são obrigatórios' 
      });
    }

    // Buscar informações do usuário para o log
    const [userInfo] = await pool.execute(
      'SELECT name FROM users WHERE id = ?',
      [userId]
    );
    const userName = userInfo[0]?.name || 'Usuário';

    // Verificar se já curtiu
    const [existingLike] = await pool.execute(
      'SELECT id FROM likes WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );

    if (existingLike.length > 0) {
      // Remover curtida (descurtir)
      await pool.execute(
        'DELETE FROM likes WHERE user_id = ? AND recipe_id = ?',
        [userId, recipeId]
      );

      console.log(`💔 ${userName} descurtiu a receita ${recipeId}`);

      res.json({ 
        success: true, 
        message: 'Curtida removida',
        liked: false
      });
    } else {
      // Adicionar curtida
      await pool.execute(
        'INSERT INTO likes (user_id, recipe_id) VALUES (?, ?)',
        [userId, recipeId]
      );

      console.log(`❤️ ${userName} curtiu a receita ${recipeId}`);

      res.json({ 
        success: true, 
        message: 'Receita curtida!',
        liked: true
      });
    }

  } catch (error) {
    console.error('Erro ao curtir/descurtir:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// ===================== ROTA PARA DELETAR RECEITA =====================

app.delete('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.body;

    console.log(`\n🗑️ TENTATIVA DE DELETAR RECEITA:`);
    console.log(`📝 Receita ID: ${recipeId}`);
    console.log(`👤 Usuário ID: ${userId}`);

    if (!userId || !recipeId) {
      console.log('❌ Dados insuficientes para deletar receita');
      return res.status(400).json({ 
        success: false, 
        message: 'User ID e Recipe ID são obrigatórios' 
      });
    }

    // Buscar informações da receita e verificar se o usuário é o dono
    const [recipeInfo] = await pool.execute(
      'SELECT user_id, name FROM user_recipes WHERE id = ?',
      [recipeId]
    );

    if (recipeInfo.length === 0) {
      console.log('❌ Receita não encontrada');
      return res.status(404).json({ 
        success: false, 
        message: 'Receita não encontrada' 
      });
    }

    const recipe = recipeInfo[0];
    
    // Verificar se o usuário é o dono da receita
    if (recipe.user_id !== parseInt(userId)) {
      console.log('❌ Usuário não autorizado a deletar esta receita');
      return res.status(403).json({ 
        success: false, 
        message: 'Você só pode deletar suas próprias receitas' 
      });
    }

    // Buscar nome do usuário para o log
    const [userInfo] = await pool.execute(
      'SELECT name FROM users WHERE id = ?',
      [userId]
    );
    const userName = userInfo[0]?.name || 'Usuário';

    // Deletar comentários relacionados à receita
    await pool.execute('DELETE FROM comments WHERE recipe_id = ?', [recipeId]);
    
    // Deletar curtidas relacionadas à receita
    await pool.execute('DELETE FROM likes WHERE recipe_id = ?', [recipeId]);
    
    // Deletar a receita
    await pool.execute('DELETE FROM user_recipes WHERE id = ?', [recipeId]);

    console.log(`✅ RECEITA DELETADA COM SUCESSO!`);
    console.log(`👤 Por: ${userName}`);
    console.log(`📝 Receita: ${recipe.name}`);
    console.log(`🗑️ ID: ${recipeId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({ 
      success: true, 
      message: 'Receita deletada com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao deletar receita:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// ===================== ROTAS DE COMENTÁRIOS =====================

app.post('/comment', async (req, res) => {
  try {
    const { userId, recipeId, comment } = req.body;

    if (!userId || !recipeId || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos os campos são obrigatórios' 
      });
    }

    // Buscar informações do usuário para o log
    const [userInfo] = await pool.execute(
      'SELECT name FROM users WHERE id = ?',
      [userId]
    );
    const userName = userInfo[0]?.name || 'Usuário';

    const [result] = await pool.execute(
      'INSERT INTO comments (user_id, recipe_id, comment) VALUES (?, ?, ?)',
      [userId, recipeId, comment]
    );

    console.log(`💬 ${userName} comentou na receita ${recipeId}: "${comment}"`);

    res.json({ 
      success: true, 
      message: 'Comentário adicionado!',
      commentId: result.insertId
    });

  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

app.get('/comments/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;

    const [comments] = await pool.execute(
      `SELECT c.*, u.name as user_name 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.recipe_id = ? 
       ORDER BY c.created_at DESC`,
      [recipeId]
    );

    res.json({ 
      success: true, 
      comments 
    });

  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Rota para deletar comentário
app.delete('/comment/delete', async (req, res) => {
  try {
    const { userId, recipeId, commentId } = req.body;

    console.log(`\n🗑️ TENTATIVA DE DELETAR COMENTÁRIO:`);
    console.log(`👤 Usuário ID: ${userId}`);
    console.log(`📝 Receita ID: ${recipeId}`);
    console.log(`💬 Comentário ID: ${commentId}`);

    if (!userId || !commentId) {
      console.log('❌ Dados insuficientes para deletar comentário');
      return res.status(400).json({ 
        success: false, 
        message: 'User ID e Comment ID são obrigatórios' 
      });
    }

    // Buscar o comentário para verificar se o usuário é o dono
    const [commentInfo] = await pool.execute(
      'SELECT user_id, comment FROM comments WHERE id = ?',
      [commentId]
    );

    if (commentInfo.length === 0) {
      console.log('❌ Comentário não encontrado');
      return res.status(404).json({ 
        success: false, 
        message: 'Comentário não encontrado' 
      });
    }

    const comment = commentInfo[0];
    
    // Verificar se o usuário é o dono do comentário
    if (comment.user_id !== parseInt(userId)) {
      console.log('❌ Usuário não autorizado a deletar este comentário');
      return res.status(403).json({ 
        success: false, 
        message: 'Você só pode deletar seus próprios comentários' 
      });
    }

    // Buscar nome do usuário para o log
    const [userInfo] = await pool.execute(
      'SELECT name FROM users WHERE id = ?',
      [userId]
    );
    const userName = userInfo[0]?.name || 'Usuário';

    // Deletar o comentário
    await pool.execute('DELETE FROM comments WHERE id = ?', [commentId]);

    console.log(`✅ COMENTÁRIO DELETADO COM SUCESSO!`);
    console.log(`👤 Por: ${userName}`);
    console.log(`💬 Texto: "${comment.comment}"`);
    console.log(`🗑️ ID: ${commentId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({ 
      success: true, 
      message: 'Comentário deletado com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao deletar comentário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// ===================== ROTAS DE PÁGINAS =====================

// Rota raiz - Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/home/Página-inicial.html'));
});

// Rotas para páginas específicas
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/home/Página-inicial.html'));
});

app.get('/pagina-inicial.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/home/Página-inicial.html'));
});

app.get('/página-inicial.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/home/Página-inicial.html'));
});

app.get('/feed', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/home/feed.html'));
});

app.get('/login-page', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/home/login.html'));
});

app.get('/cadastro-page', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/home/cadastro.html'));
});

// ===================== ROTAS DE API =====================

app.get('/api/status', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Nutri Kids funcionando!',
    timestamp: new Date().toISOString()
  });
});

// ===================== INICIALIZAÇÃO DO SERVIDOR =====================

// Função para mostrar usuários existentes na inicialização
const mostrarUsuariosExistentes = async () => {
  try {
    console.log('👥 Verificando usuários existentes no banco...');
    
    const [usuarios] = await pool.execute('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');
    
    if (usuarios.length === 0) {
      console.log('📝 Nenhum usuário cadastrado ainda.');
    } else {
      console.log(`📊 ${usuarios.length} usuário(s) encontrado(s):`);
      usuarios.forEach((user, index) => {
        const dataFormatada = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Data não disponível';
        console.log(`   ${index + 1}. 👤 ${user.name} (${user.email}) - ID: ${user.id} - Cadastrado em: ${dataFormatada}`);
      });
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Erro ao buscar usuários existentes:', error);
  }
};

const startServer = async () => {
  try {
    // Testar conexão com banco
    await testConnection();
    
    // Inicializar tabelas
    await initTables();
    
    // Mostrar usuários existentes
    await mostrarUsuariosExistentes();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 Página Inicial: http://localhost:${PORT}/`);
      console.log(`📱 Ou acesse: http://localhost:${PORT}/home/Página-inicial.html`);
      console.log(`📱 Ou acesse: http://localhost:${PORT}/front/home/Página-inicial.html`);
      console.log(`🍳 Feed: http://localhost:${PORT}/feed`);
      console.log(`🔗 API Status: http://localhost:${PORT}/api/status`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('👀 Aguardando novos cadastros e logins...\n');
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Esta seção foi removida para manter todos os dados no banco 
// sem limpar nada durante a execução ou encerramento

// Eventos para limpar dados ao fechar servidor
process.on('SIGINT', async () => {
  console.log('\n🔄 Encerrando servidor (SIGINT)...');
  console.log('👋 Servidor encerrado!');
  process.exit(0);
});

// Iniciar o servidor
startServer();
