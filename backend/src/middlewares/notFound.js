const notFound = (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `${req.method} ${req.path} não existe nesta API`,
    docs: '/api/docs',
  });
};

module.exports = { notFound };
