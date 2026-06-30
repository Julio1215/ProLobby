// ============================================
// CENTRALIZED ERROR HANDLER
// ============================================

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500
  const isDev = process.env.NODE_ENV !== 'production'

  // Log structured error
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status,
    message: err.message,
    ...(isDev && { stack: err.stack }),
  })

  // Known error types
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Registro duplicado. Este dado já existe.',
        code: 'DUPLICATE_ENTRY',
      })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Registro não encontrado.',
        code: 'NOT_FOUND',
      })
    }
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
      code: 'VALIDATION_ERROR',
    })
  }

  res.status(status).json({
    success: false,
    error: status >= 500 && !isDev
      ? 'Erro interno do servidor'
      : err.message || 'Erro inesperado',
    ...(isDev && { stack: err.stack }),
  })
}

module.exports = { errorHandler }
