const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message).join('; ');
    return res.status(400).json({ message: errorDetails });
  }

  req.body = value;
  next();
};

module.exports = validate;