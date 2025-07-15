const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');

dotenv.config();
const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB!'))
  .catch((err) => console.error('MongoDB error de conexion:', err));

// Metodo para registrar un usuario, este lo cree de manera que pudiera registrar un usuario de manera rapida y sencilla
app.post('/registro', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await Usuario.findOne({ username });
    if (existing) return res.status(400).json({ error: 'El usuario ya existe' });

    const user = new Usuario({ username, password }); // NOTE: Plain password (we'll hash later)
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Metodo para autenticar el usuario e iniciar sesion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Nombre de usuario o contrasenas invalidos' });
    }

    res.json({ message: 'Autenticacion exitosa!' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizando usuario por ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminando usuario por ID
app.delete('/users/:id', async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


// Ahora el crud para productos
// Metodo para crear un producto
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Producto(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
});

// Metodo para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const products = await Producto.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Metodo para obtener un producto por ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Producto.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Metodo para actualizar un producto por ID
app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Producto.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Metodo para eliminar un producto por ID
app.delete('/products/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en: http://localhost:${PORT}`);
});