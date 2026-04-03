# 🌱 EcoTrack API

API REST para monitoramento de pegada de carbono pessoal.

## 📋 Sobre o projeto

O EcoTrack permite que usuários registrem suas atividades diárias e acompanhem o impacto ambiental gerado em kg de CO₂.

## 🚀 Tecnologias

- Node.js
- Express.js
- MySQL
- JWT (autenticação)
- Bcrypt (criptografia de senhas)

## 📦 Instalação
```bash
# Clone o repositório
git clone https://github.com/gavbi77/ecotrack-api.git

# Entre na pasta
cd ecotrack-api

# Instale as dependências
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecotrack
DB_PORT=3306
JWT_SECRET=ecotrack_secret_2024
```

## 🗄️ Banco de dados

Execute o script SQL para criar as tabelas:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emission_factor DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20) NOT NULL
);

CREATE TABLE daily_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    total_co2 DECIMAL(10,4) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES activity_categories(id)
);

CREATE TABLE user_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    monthly_target_co2 DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔗 Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Cadastrar usuário |
| POST | /auth/login | Login e geração de token JWT |

### Atividades

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /activities | Registrar atividade de carbono |
| GET | /activities/dashboard | Resumo mensal de emissões |

## 🔐 Autenticação

As rotas protegidas precisam do token JWT no header:
```
Authorization: Bearer {token}
```

## 📊 Categorias disponíveis

| ID | Categoria | Fator | Unidade |
|----|-----------|-------|---------|
| 1 | Transporte de carro | 0.21 | km |
| 2 | Transporte de ônibus | 0.089 | km |
| 3 | Energia elétrica | 0.45 | kWh |
| 4 | Carne bovina | 27.0 | kg |
| 5 | Voo doméstico | 0.255 | km |

## ▶️ Rodando o projeto
```bash
node server.js
```

Servidor disponível em `http://localhost:3000`