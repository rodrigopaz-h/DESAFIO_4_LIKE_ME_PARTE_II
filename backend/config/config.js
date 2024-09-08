const { Pool } = require('pg');

// Conexión a la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: '2232',
    port: 5432,
});

// Crear la tabla
const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(25) NOT NULL UNIQUE,
                img VARCHAR(1000),
                descripcion VARCHAR(255),
                likes INT DEFAULT 0
            );
        `);
        console.log('Tabla creada o ya existe.');
    } catch (error) {
        console.error('Error al crear la tabla:', error);
    }
};

// Inserta datos en la tabla
const insertPost = async (titulo, img, descripcion) => {
    try {
        await pool.query(`
            INSERT INTO posts (titulo, img, descripcion)
            VALUES ($1, $2, $3);
        `, [titulo, img, descripcion]);
        console.log('Post insertado.');
    } catch (error) {
        console.error('Error al insertar el post:', error);
    }
};

module.exports = {
    pool,
    createTable,
    insertPost
};
