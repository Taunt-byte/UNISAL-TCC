app.get("/dashboard/stats", async (req, res) => {
  try {
    const produtos = await Item.find();
    const movs = await Movimentacao.find();

    const totalProdutos = produtos.length;
    const produtosEmEstoque = produtos.reduce((s, p) => s + (p.quantidade || 0), 0);
    const produtosVendidos = movs.filter(m => m.tipo === "saida").reduce((s, m) => s + m.quantidade, 0);
    const custoTotal = produtos.reduce((s, p) => s + ((p.custo || 0) * (p.quantidade || 0)), 0);

    // entradas x saidas por mês (exemplo simples)
    const agreg = {};
    movs.forEach(m => {
      const key = new Date(m.data).toISOString().slice(0,7); // 'YYYY-MM'
      if (!agreg[key]) agreg[key] = { entrada: 0, saida: 0 };
      agreg[key][m.tipo] += m.quantidade;
    });

    res.json({ totalProdutos, produtosEmEstoque, produtosVendidos, custoTotal, seriesMonthly: agreg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar estatísticas" });
  }
});
