# Nutri Kids - Plataforma de Receitas Infantis

![Logo Nutri Kids](Nutrikids/front/imagem/logo.png)

## 📋 Sobre o Projeto

Nutri Kids é uma plataforma digital desenvolvida para oferecer receitas saudáveis e divertidas para crianças. O sistema permite que usuários naveguem por receitas, criem suas próprias, interajam através de curtidas e comentários, além de classificar receitas por categorias.

### 👦👧 Público-alvo
- Pais e responsáveis que buscam receitas saudáveis para crianças
- Profissionais de nutrição infantil
- Educadores que trabalham com alimentação saudável

### 🌟 Recursos Principais
- Cadastro e autenticação de usuários
- Feed de receitas com opções de filtro por categoria
- Sistema de curtidas e comentários
- Upload de imagens para receitas personalizadas
- Visualização detalhada de receitas com instruções

## 🚀 Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript puro
- Consumo de API REST
- LocalStorage para persistência de sessão

### Backend
- Node.js com Express
- MySQL para banco de dados
- Multer para upload de arquivos
- API RESTful

## 📁 Estrutura do Projeto

### Frontend (`/Nutrikids/front/`)

#### 📁 `/js`
- **`login.js`** - Gerenciamento de login/cadastro e autenticação
- **`script2.js`** - Funcionalidades do feed (curtidas, comentários, exclusão)

#### 📁 `/css`
- **`base.css`** - Estilos base do sistema
- **`feed.css`** - Estilos do feed de receitas
- **`home.css`** - Estilos da página inicial e autenticação
- **`categorias.css`** - Estilos das páginas de categorias
- **`receitas.css`** - Estilos das páginas de receitas individuais

#### 📁 `/home`
- **`login.html`** - Página de login
- **`cadastro.html`** - Página de cadastro de usuários
- **`feed.html`** - Feed principal com todas as receitas
- **`Página-inicial.html`** - Landing page do sistema
- **`usuario.html`** - Página de perfil do usuário

#### 📁 `/categorias`
Páginas de categorias específicas:
- **`cafe.html`** - Café da manhã
- **`almoco.html`** - Almoço
- **`janta.html`** - Jantar
- **`lanche1.html`** - Lanche da manhã
- **`lanche2.html`** - Lanche da tarde
- **`doce.html`** - Doces e sobremesas saudáveis

#### 📁 `/receitas`
Páginas individuais com receitas detalhadas (27 receitas pré-cadastradas)

#### 📁 `/imagem`
- Imagens do sistema e das receitas
- Subpasta `/uploads` para imagens enviadas pelos usuários

### Backend (`/Nutrikids/back/`)

#### � Arquivos Principais
- **`server.js`** - Servidor Express com todas as rotas
- **`package.json`** - Dependências e scripts
- **`nutri_kids_database.sql`** - Script de criação do banco de dados

#### 📁 `/js`
- **`db.js`** - Configuração e conexão com o banco MySQL

## 🔧 Funcionalidades Principais

### 👤 Sistema de Usuários
- Cadastro com validação de dados
- Login com autenticação
- Perfil personalizado
- Avatar padrão com opção de customização

### 🍽️ Sistema de Receitas
- Visualização de receitas pré-cadastradas
- Criação de receitas personalizadas com upload de imagens
- Categorização automática
- Filtros por tipo de refeição

### ❤️ Sistema de Interação
- Curtidas em receitas (toggle)
- Comentários em receitas
- Exclusão de receitas e comentários próprios

### 📊 Banco de Dados
- Tabelas relacionais com chaves estrangeiras
- Armazenamento otimizado para imagens
- Consultas SQL para estatísticas de uso

## 💻 Como Executar

### Pré-requisitos
- Node.js instalado
- MySQL Server instalado e configurado
- Navegador web moderno

### Passos para execução
1. Clone o repositório
2. Configure o banco de dados MySQL:
   ```bash
   mysql -u root -p < Nutrikids/back/nutri_kids_database.sql
   ```
3. Instale as dependências do backend:
   ```bash
   cd Nutrikids/back
   npm install
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
5. Acesse http://localhost:3000 no navegador

### Usuário Administrador
- Email: rafaferrasso@nutrikids.com
- Senha: 123456789

## 🛠️ Estrutura do Banco de Dados

### Tabelas Principais
- **`users`** - Usuários cadastrados
- **`recipes`** - Receitas pré-cadastradas
- **`user_recipes`** - Receitas criadas por usuários
- **`likes`** - Curtidas nas receitas
- **`comments`** - Comentários nas receitas

## 👥 Desenvolvido por
- Rafael Ferrasso - Estudante de Desenvolvimento Web

---

© 2025 Nutri Kids - Todos os direitos reservados
