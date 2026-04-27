require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const Usuario = require("./models/Usuario");
const Lugar = require("./models/Lugar");

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));
// Ruta específica para imágenes
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a MongoDB Atlas ✅"))
    .catch(err => console.error("Error de conexión:", err));

// --- MIDDLEWARE DE SEGURIDAD ---
const verificarToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ mensaje: "Acceso denegado" });
    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verificado;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: "Token no válido" });
    }
};

// --- RUTAS DE AUTENTICACIÓN ---
app.post("/registro", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const nuevoUsuario = new Usuario({ usuario: req.body.usuario, password: hashPassword });
        await nuevoUsuario.save();
        res.json({ mensaje: "Registrado" });
    } catch (error) {
        res.status(400).json({ mensaje: "Usuario ya existe" });
    }
});

app.post("/login", async (req, res) => {
    const user = await Usuario.findOne({ usuario: req.body.usuario });
    if (!user) return res.json({ mensaje: "Error" });
    const passValida = await bcrypt.compare(req.body.password, user.password);
    if (!passValida) return res.json({ mensaje: "Error" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ mensaje: "Login correcto", token, usuario: user.usuario });
});

// --- CRUD DE LUGARES ---
app.get("/lugares", async (req, res) => {
    const lugares = await Lugar.find();
    res.json(lugares);
});

app.post("/lugares", verificarToken, async (req, res) => {
    try {
        const nuevoLugar = new Lugar(req.body);
        await nuevoLugar.save();
        res.json({ mensaje: "Lugar creado" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear lugar" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.listen(3000, () => {
    console.log("Servidor activo en http://localhost:3000");
});