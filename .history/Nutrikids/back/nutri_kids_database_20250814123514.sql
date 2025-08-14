-- =====================================================
-- BANCO DE DADOS NUTRI KIDS
-- Script SQL para criação completa do banco
-- =====================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS nutri_kids;
USE nutrikids;

-- =====================================================
-- TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    avatar VARCHAR(255) DEFAULT '/front/imagem/user.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE RECEITAS
-- =====================================================
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE CURTIDAS
-- =====================================================
CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, recipe_id)
);

-- =====================================================
-- TABELA DE COMENTÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- INSERIR DADOS INICIAIS - RECEITAS
-- =====================================================

INSERT IGNORE INTO recipes (id, title, image_url, author, category, file_path) VALUES 
(1, 'Panqueca Divertida', '/front/imagem/panqueca.jpeg', 'Chef Mirim', 'Café Mágico', '/front/receitas/panqueca.html'),
(2, 'Pãozinho Caseiro', '/front/imagem/paochoc.png', 'Padeiro Kids', 'Café Mágico', '/front/receitas/pao.html'),
(3, 'Salada de Frutas', '/front/imagem/frutasobri.jpeg', 'Frutinha Doce', 'Café Mágico', '/front/receitas/frutas.html'),
(4, 'Pãozinho Infantil', '/front/imagem/paoinfatil.webp', 'Mamãe Baker', 'Café Mágico', '/front/receitas/paozinho.html'),
(5, 'Salada de Frutas Especial', '/front/imagem/fruta.jpeg', 'Natureza Kids', 'Lanche Aventura', '/front/receitas/salada-frutas.html'),
(6, 'Iogurte com Frutas', '/front/imagem/iogurte.webp', 'Frutinha Feliz', 'Lanche Aventura', '/front/receitas/iogurte.html'),
(7, 'Bolo de Chocolate', '/front/imagem/bolochoc.jpeg', 'Doceiro Mirim', 'Docinho Nutri', '/front/receitas/bolo-chocolate.html'),
(8, 'Vitamina de Frutas', '/front/imagem/fruta.jpeg', 'Frutinha Feliz', 'Café Mágico', '/front/receitas/vitamina.html'),
(9, 'Macarrão Colorido', '/front/imagem/massa.jpeg', 'Chef Turbo', 'Almoço Turbo', '/front/receitas/macarrao.html'),
(10, 'Sopa Nutritiva', '/front/imagem/sopa.jpeg', 'Vovó Cozinheira', 'Janta Alegria', '/front/receitas/sopa.html'),
(11, 'Sanduíche Divertido', '/front/imagem/sandu.jpeg', 'Chef Aventura', 'Lanche Aventura', '/front/receitas/sanduiche.html'),
(12, 'Purê Nutritivo', '/front/imagem/purecarn.webp', 'Nutricionista Ana', 'Almoço Turbo', '/front/receitas/pure.html'),
(13, 'Mocotó Kids', '/front/imagem/mocaar.jpeg', 'Chef Tradicional', 'Janta Alegria', '/front/receitas/mocoto.html'),
(14, 'Lasanha Infantil', '/front/imagem/massa2.jpeg', 'Mamãe Italiana', 'Almoço Turbo', '/front/receitas/lasanha.html'),
(15, 'Sorvete de Banana', '/front/imagem/sorve.jpg', 'Geladinho Kids', 'Docinho Nutri', '/front/receitas/sorvete.html'),
(16, 'Potinho Nutritivo 1', '/front/imagem/pote.jpg', 'Mochileiro Kids', 'Lanche Mochila', '/front/receitas/potinho1.html'),
(17, 'Potinho Nutritivo 2', '/front/imagem/pote2.jpg', 'Lancheira Saudável', 'Lanche Mochila', '/front/receitas/potinho2.html'),
(18, 'Potinho Nutritivo 3', '/front/imagem/pote3.jpg', 'Chef Portátil', 'Lanche Mochila', '/front/receitas/potinho3.html'),
(19, 'Potinho Nutritivo 4', '/front/imagem/pote4.jpg', 'Viajante Kids', 'Lanche Mochila', '/front/receitas/potinho4.html'),
(20, 'Doce Especial 3', '/front/imagem/doce3.jpeg', 'Confeiteira Kids', 'Docinho Nutri', '/front/receitas/doce3.html'),
(21, 'Doce Especial 4', '/front/imagem/doce4.jpeg', 'Açaí Master', 'Docinho Nutri', '/front/receitas/doce4.html'),
(22, 'Doce Especial 5', '/front/imagem/doce5.jpeg', 'Doçura Nutri', 'Docinho Nutri', '/front/receitas/doce5.html'),
(23, 'Muffin da Energia', '/front/imagem/doce1.png', 'Doceiro Kids', 'Docinho Nutri', '/front/receitas/muffin.html'),
(24, 'Janta Especial 1', '/front/imagem/janta1.jpg', 'Chef Noturno', 'Janta Alegria', '/front/receitas/janta1.html'),
(25, 'Janta Especial 2', '/front/imagem/janta2.jpg', 'Mamãe Cozinheira', 'Janta Alegria', '/front/receitas/janta2.html'),
(26, 'Janta Especial 4', '/front/imagem/janta4.jpg', 'Chef Familiar', 'Janta Alegria', '/front/receitas/janta4.html'),
(27, 'Janta Especial 5', '/front/imagem/janta5.jpg', 'Nutricionista Noite', 'Janta Alegria', '/front/receitas/janta5.html');

-- =====================================================
-- INSERIR USUÁRIOS DE EXEMPLO (OPCIONAL)
-- =====================================================

INSERT IGNORE INTO users (id, name, email, password, avatar) VALUES 
(1, 'Admin Nutri Kids', 'admin@nutrikids.com', 'admin123', '/front/imagem/user.png'),
(2, 'João Silva', 'joao@email.com', '123456', '/front/imagem/user.png'),
(3, 'Maria Santos', 'maria@email.com', '123456', '/front/imagem/user.png'),
(4, 'Pedro Lima', 'pedro@email.com', '123456', '/front/imagem/user.png'),
(5, 'Ana Costa', 'ana@email.com', '123456', '/front/imagem/user.png');

-- =====================================================
-- INSERIR CURTIDAS DE EXEMPLO (OPCIONAL)
-- =====================================================

INSERT IGNORE INTO likes (user_id, recipe_id) VALUES 
(1, 1), (1, 2), (1, 5), (1, 10),
(2, 1), (2, 3), (2, 7), (2, 15),
(3, 2), (3, 4), (3, 8), (3, 12),
(4, 5), (4, 9), (4, 13), (4, 20),
(5, 6), (5, 11), (5, 16), (5, 25);

-- =====================================================
-- INSERIR COMENTÁRIOS DE EXEMPLO (OPCIONAL)
-- =====================================================

INSERT IGNORE INTO comments (user_id, recipe_id, comment) VALUES 
(1, 1, 'Receita incrível! Meus filhos adoraram as panquecas! 🥞'),
(2, 1, 'Muito fácil de fazer, recomendo para todas as mães!'),
(3, 2, 'O pãozinho ficou uma delícia, vou fazer de novo! 🍞'),
(1, 5, 'Salada de frutas sempre é uma boa opção saudável! 🍓'),
(4, 7, 'Bolo de chocolate é sempre sucesso com as crianças! 🍰'),
(5, 10, 'Sopa perfeita para os dias frios, muito nutritiva! 🍲'),
(2, 15, 'Sorvete caseiro é muito melhor que o industrializado! 🍦'),
(3, 20, 'Doce especial realmente especial, família toda gostou!'),
(4, 25, 'Janta prática e saudável, ideal para a rotina corrida!'),
(1, 12, 'Purê nutritivo é perfeito para introdução alimentar! 👶');

-- =====================================================
-- CONSULTAS ÚTEIS PARA TESTE
-- =====================================================

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

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Verificar se tudo foi criado corretamente
SHOW TABLES;

SELECT 'Banco de dados Nutri Kids criado com sucesso!' as status;
SELECT COUNT(*) as total_receitas FROM recipes;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_curtidas FROM likes;
SELECT COUNT(*) as total_comentarios FROM comments;
