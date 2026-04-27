const mongoose = require('mongoose');

const LugarSchema = new mongoose.Schema({
    nombre: String,
    seguridad: String,
    descripcion: String,
    imagen: String,
    precio: String,
    actividades: String
});

module.exports = mongoose.model('Lugar', LugarSchema);