const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    db.query("SELECT id FROM users WHERE email = ?", [email], async (err, result) => {
      if (err) {
        console.log("Erro na query SELECT:", err);
        return res.status(500).json({ message: "Erro no banco" });
      }

      if (result.length > 0) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }

      const hash = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, hash],
        (err, result) => {
          if (err) {
            console.log("Erro na query INSERT:", err);
            return res.status(500).json({ message: "Erro ao criar usuário" });
          }

          res.status(201).json({
            message: "Usuário criado com sucesso",
            userId: result.insertId
          });
        }
      );
    });
  } catch (err) {
    console.log("Erro geral:", err);
    res.status(500).json({ message: "Erro interno" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) {
      console.log("Erro na query:", err);
      return res.status(500).json({ message: "Erro no banco" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    const user = result[0];

    const senhaCorreta = await bcrypt.compare(password, user.password_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token: token
    });
  });
};