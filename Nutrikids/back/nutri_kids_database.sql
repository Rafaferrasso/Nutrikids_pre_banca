CREATE DATABASE IF NOT EXISTS nutrikids;
USE nutrikids;

-- Criar tabela de usuários 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT '/front/imagem/user.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABELA DE RECEITAS
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABELA DE CURTIDAS
CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, recipe_id)
);

-- TABELA DE COMENTÁRIOS
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- TABELA DE RECEITAS DE USUÁRIOS
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
);

-- INSERIR DADOS INICIAIS - RECEITAS (apenas se não existirem)
-- O comando IGNORE garante que não sobrescreverá dados existentes

INSERT IGNORE INTO recipes (id, title, image_url, author, category, file_path) VALUES 
(1, 'Panqueca Divertida', '/front/imagem/panqueca.jpeg', 'Admin', 'Café Mágico', '/front/receitas/panqueca.html'),
(2, 'Pãozinho Caseiro', '/front/imagem/paochoc.png', 'Admin', 'Café Mágico', '/front/receitas/pao.html'),
(3, 'Salada de Frutas', '/front/imagem/frutasobri.jpeg', 'Admin', 'Café Mágico', '/front/receitas/frutas.html'),
(4, 'Pãozinho Infantil', '/front/imagem/paoinfatil.webp', 'Admin', 'Café Mágico', '/front/receitas/paozinho.html'),
(5, 'Salada de Frutas Especial', '/front/imagem/fruta.jpeg', 'Admin', 'Lanche Aventura', '/front/receitas/salada-frutas.html'),
(6, 'Iogurte com Frutas', '/front/imagem/iogurte.webp', 'Admin', 'Lanche Aventura', '/front/receitas/iogurte.html'),
(7, 'Bolo de Chocolate', '/front/imagem/bolochoc.jpeg', 'Admin', 'Docinho Nutri', '/front/receitas/bolo-chocolate.html'),
(8, 'Vitamina de Frutas', '/front/imagem/fruta.jpeg', 'Admin', 'Café Mágico', '/front/receitas/vitamina.html'),
(9, 'Macarrão Colorido', '/front/imagem/massa.jpeg', 'Admin', 'Almoço Turbo', '/front/receitas/macarrao.html'),
(10, 'Sopa Nutritiva', '/front/imagem/sopa.jpeg', 'Admin', 'Janta Alegria', '/front/receitas/sopa.html'),
(11, 'Sanduíche Divertido', '/front/imagem/sandu.jpeg', 'Admin', 'Lanche Aventura', '/front/receitas/sanduiche.html'),
(12, 'Purê Nutritivo', '/front/imagem/purecarn.webp', 'Admin', 'Almoço Turbo', '/front/receitas/pure.html'),
(13, 'Mocotó Kids', '/front/imagem/mocaar.jpeg', 'Admin', 'Janta Alegria', '/front/receitas/mocoto.html'),
(14, 'Lasanha Infantil', '/front/imagem/massa2.jpeg', 'Admin', 'Almoço Turbo', '/front/receitas/lasanha.html'),
(15, 'Sorvete de Banana', '/front/imagem/sorve.jpg', 'Admin', 'Docinho Nutri', '/front/receitas/sorvete.html'),
(16, 'Potinho Nutritivo 1', '/front/imagem/pote.jpg', 'Admin', 'Lanche Mochila', '/front/receitas/potinho1.html'),
(17, 'Potinho Nutritivo 2', '/front/imagem/pote2.jpg', 'Admin', 'Lanche Mochila', '/front/receitas/potinho2.html'),
(18, 'Potinho Nutritivo 3', '/front/imagem/pote3.jpg', 'Admin', 'Lanche Mochila', '/front/receitas/potinho3.html'),
(19, 'Potinho Nutritivo 4', '/front/imagem/pote4.jpg', 'Admin', 'Lanche Mochila', '/front/receitas/potinho4.html'),
(20, 'Doce Especial 3', '/front/imagem/doce3.jpeg', 'Admin', 'Docinho Nutri', '/front/receitas/doce3.html'),
(21, 'Doce Especial 4', '/front/imagem/doce4.jpeg', 'Admin', 'Docinho Nutri', '/front/receitas/doce4.html'),
(22, 'Doce Especial 5', '/front/imagem/doce5.jpeg', 'Admin', 'Docinho Nutri', '/front/receitas/doce5.html'),
(23, 'Muffin da Energia', '/front/imagem/doce1.png', 'Admin', 'Docinho Nutri', '/front/receitas/muffin.html'),
(24, 'Janta Especial 1', '/front/imagem/janta1.jpg', 'Admin', 'Janta Alegria', '/front/receitas/janta1.html'),
(25, 'Janta Especial 2', '/front/imagem/janta2.jpg', 'Admin', 'Janta Alegria', '/front/receitas/janta2.html'),
(26, 'Janta Especial 4', '/front/imagem/janta4.jpg', 'Admin', 'Janta Alegria', '/front/receitas/janta4.html'),
(27, 'Janta Especial 5', '/front/imagem/janta5.jpg', 'Admin', 'Janta Alegria', '/front/receitas/janta5.html');

-- INSERIR USUÁRIO ADMINISTRADOR APENAS SE NÃO EXISTIR
INSERT IGNORE INTO users (id, name, email, password, avatar) VALUES 
(1, 'Admin Nutri Kids', 'rafaferrasso@nutrikids.com', '123456789', '/front/imagem/user.png');

-- Garantir que a próxima sequência de AUTO_INCREMENT esteja após o ID do administrador
ALTER TABLE users AUTO_INCREMENT = 2;

-- CONSULTAS ÚTEIS PARA TESTE
-- Ver todas as receitas com contadores
SELECT 
    r.id,
    r.title,
    r.author,
    r.category,
    COUNT(DISTINCT l.id) as likes_count,
    COUNT(DISTINCT c.id) as comments_count
FROM recipes r
LEFT JOIN likes l ON r.id = l.recipe_id
LEFT JOIN comments c ON r.id = c.recipe_id
GROUP BY r.id
ORDER BY r.title;

-- Ver usuários com suas estatísticas
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT l.id) as total_likes,
    COUNT(DISTINCT c.id) as total_comments
FROM users u
LEFT JOIN likes l ON u.id = l.user_id
LEFT JOIN comments c ON u.id = c.user_id
GROUP BY u.id
ORDER BY u.name;

-- Ver receitas mais curtidas
SELECT 
    r.title,
    r.author,
    COUNT(l.id) as likes_count
FROM recipes r
LEFT JOIN likes l ON r.id = l.recipe_id
GROUP BY r.id
ORDER BY likes_count DESC
LIMIT 10;

-- Ver receitas mais comentadas
SELECT 
    r.title,
    r.author,
    COUNT(c.id) as comments_count
FROM recipes r
LEFT JOIN comments c ON r.id = c.recipe_id
GROUP BY r.id
ORDER BY comments_count DESC
LIMIT 10;


-- Verificar se tudo foi criado corretamente
SHOW TABLES;

SELECT 'Banco de dados Nutri Kids criado com sucesso!' as status;
SELECT COUNT(*) as total_receitas FROM recipes;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_curtidas FROM likes;
SELECT COUNT(*) as total_comentarios FROM comments;
