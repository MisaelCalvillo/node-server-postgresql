require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const { Client } = require('pg');
const moment = require('moment');
moment.locale('es-mx');

// const sql = require('sql');
const formatNumber = require('format-number');

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PORT
});

client.connect();

app.set('view engine', 'hbs');

const rutaDePublic = path.join(__dirname, '../public');

app.use(express.static(rutaDePublic));

app.get('/data', (req, res) => {
  res.render('index', {
    title: 'Movimientos',
    method: 'Listar - Filtrar '
  })
});

app.get('/movimientos', (req, res) => {
  let { inicio, fin }= req.query
  let complement= ` as m join "usuarios" as u on m.user_id=u.id `;
  if(!inicio && !fin){
    complement+= ''
  }
  else{
    if(!fin || fin===inicio){
      complement += `WHERE CAST(m.created_at AS Date)='${inicio}'`
    }
    else{
      if(!inicio) 
        inicio="2000-01-01"
      complement += `WHERE CAST(m.created_at AS Date)>='${inicio}' AND CAST(m.created_at AS Date)<='${fin}'`;
    }
  }
  
  client.query(`SELECT m.id, u.nickname, u.name, m.created_at, m.amount FROM "movimientos"${complement};`, (err, postgresRes) => {
    if (err) {          
      console.log(err);
      return res.status(403).send('Estamos trabando para poner en linea esto :('); // temporal
    } else {
      let  newData = postgresRes.rows;
      return res.status(200).json({
        data: newData
      });
    }
  })  
});
const port_server=process.env.PORT_NODE
app.listen(port_server, () => {
  console.log(`El server acaba de inicial en el puerto ${port_server}`);
}); 
