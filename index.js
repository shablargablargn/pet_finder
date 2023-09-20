const pg = require('pg');
const client = new pg.Client('postfres://localhost/the_pet_shop_backend_db');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/api/pets', async(req, res, next) => {
    try {
        const SQL = `
            SELECT * from pets
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

const init = async() => {
    await client.connect();
    console.log('connected');
    const SQL = `
    DROP TABLE IF EXISTS pets;
    CREATE TABLE pets(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        is_favorite BOOLEAN
    );
    INSERT INTO pets(name, is_favorite) values('rex', false);
    INSERT INTO pets(name, is_favorite) values('bob', true);
    INSERT INTO pets(name, is_favorite) values('fluffy', true);
    INSERT INTO pets(name, is_favorite) values('Jaws', false);
    INSERT INTO pets(name, is_favorite) values('Lamont', true);
    INSERT INTO pets(name, is_favorite) values('Gadget', true);
    `;
    await client.query(SQL);
    console.log('tables created');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();