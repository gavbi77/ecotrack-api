const db = require("../config/database");

exports.createActivity = (req, res) => {
  const { category_id, amount } = req.body;
  const user_id = req.userId;

  if (!category_id || !amount) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  db.query(
    "SELECT emission_factor FROM activity_categories WHERE id = ?",
    [category_id],
    (err, result) => {
      if (err) {
        console.log("Erro:", err);
        return res.status(500).json({ message: "Erro no banco" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      const factor = result[0].emission_factor;
      const total_co2 = amount * factor;

      db.query(
        "INSERT INTO daily_activities (user_id, category_id, amount, total_co2) VALUES (?, ?, ?, ?)",
        [user_id, category_id, amount, total_co2],
        (err, result) => {
          if (err) {
            console.log("Erro:", err);
            return res.status(500).json({ message: "Erro ao registrar atividade" });
          }

          res.status(201).json({
            message: "Atividade registrada com sucesso",
            total_co2: total_co2
          });
        }
      );
    }
  );
};

exports.getDashboard = (req, res) => {
  const user_id = req.userId;

  const query = `
    SELECT 
      SUM(da.total_co2) AS total_co2,
      ac.name AS category,
      SUM(da.total_co2) AS category_co2
    FROM daily_activities da
    JOIN activity_categories ac ON da.category_id = ac.id
    WHERE da.user_id = ?
    AND MONTH(da.recorded_at) = MONTH(CURRENT_DATE())
    AND YEAR(da.recorded_at) = YEAR(CURRENT_DATE())
    GROUP BY ac.name
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.log("Erro:", err);
      return res.status(500).json({ message: "Erro no banco" });
    }

    const total = result.reduce((sum, row) => sum + parseFloat(row.category_co2), 0);

    res.json({
      total_co2_mes: parseFloat(total.toFixed(4)),
      por_categoria: result.map(row => ({
        categoria: row.category,
        co2: parseFloat(row.category_co2)
      }))
    });
  });
};