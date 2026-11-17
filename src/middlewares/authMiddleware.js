const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
    // El token se envía en el header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado; // Guardamos los datos del usuario en la request
        next(); // Continuar al controlador
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

// (Opcional) Middleware para roles específicos
exports.soloAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'ADMIN') {
        return res.status(403).json({ error: 'Requiere permisos de Administrador' });
    }
    next();
};