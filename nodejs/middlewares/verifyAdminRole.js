const { response, request } = require('express');

const verifyAdminRole = (req = request, res = response, next) => {
  if (req.userActive?.role !== 'admin') {
    return res.status(403).json({
      msg: 'Acceso denegado',
    });
  }

  next();
};

module.exports = { verifyAdminRole };
