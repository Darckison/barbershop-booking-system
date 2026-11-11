const errorHandler = (err, req, res, next) => {
  console.error('[Error Stack]:', err.stack);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `O ${field} informado já está cadastrado.` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador fornecido é inválido.' });
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join('; ') });
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor.';
  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;