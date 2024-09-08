const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { pool, createTable, insertPost } = require('./config/config');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Crea la tabla al iniciar el servidor
createTable();

//ruta para obtener los posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener posts' });
    }
});

//ruta para agregar un nuevo post
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body;
    try {
        await insertPost(titulo, img, descripcion);
        res.status(201).json({ message: 'Post creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el post' });
    }
});


//funciones requeridas de desafio "Like me" parte II

// 1. Agregar una ruta PUT en una API REST y utilizarla para modificar registros en una
//    tabla alojada en PostgreSQL 

app.put('/posts/like/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Post no encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al incrementar los likes:', error);
        res.status(500).send('Error al incrementar los likes');
    }
});


// 2. Agregar una ruta DELETE en una API REST y utilizarla para eliminar registros en una
//    tabla alojada en PostgreSQL

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Post no encontrado');
        }
        res.send('Post eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        res.status(500).send('Error al eliminar el post');
    }
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
