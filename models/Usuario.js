// Esquema sencillo usado para el modelo de Usuario
// Este modelo define los campos username y password, donde username es unico y requerido, y password es requerido tambien.
// Se usa Mongoose para definir el esquema y exportar el modelo para su uso en otras partes de la aplicacion.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', userSchema);
