app.get("/dashboard/alerts", async (req, res) => {
  try {
    const threshold = Number(req.query.t || 10); // ex: ?t=5
    const produtos = await Item.find();
    const críticos = produtos.filter(p => (p.quantidade || 0) < threshold);
    res.json(críticos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar alertas" });
  }
});
