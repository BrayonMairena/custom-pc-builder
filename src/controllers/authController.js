const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // 1. Hashear la contraseña (Nunca guardar texto plano)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Crear el usuario en la BD
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password: hashedPassword,
                rol: rol || 'VENDEDOR'
            }
        });

        res.status(201).json({ mensaje: 'Usuario creado', id: nuevoUsuario.id });
    } catch (error) {
        res.status(400).json({ error: 'El email ya está registrado o datos inválidos' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

        // 2. Comparar contraseñas
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) return res.status(401).json({ error: 'Credenciales inválidas' });

        // 3. Generar Token JWT (válido por 2 horas)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, // Payload (NO poner datos sensibles)
            process.env.JWT_SECRET, // Secreto guardado en .env
            { expiresIn: '2h' }
        );

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};