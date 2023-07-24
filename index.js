const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.use(cors()); // cors 사용
app.set('view engine', 'ejs'); // es 사용

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

const Comments = sequelize.define('Comments', {
  Content: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

(async() => {
    await Comments.sync();
})();

// post 방식일 경우 추가해야 함.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {

    const comments = await Comments.findAll();
    res.render('index', { comments : comments});
});

app.get('/create', (req, res) => {
    console.log(req.query);
    res.send("hi")
});

app.post('/create', async (req, res) => {

    console.log(req.body);
    const { content } = req.body;
    await Comments.create({ Content: content });

    res.redirect('/');
});

app.post('/update/:id', async (req, res) => {

    const { content } = req.body;
    const { id } = req.params;

    await Comments.update({ Content: content }, {
        where: {
          id: id
        }
    });

    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {

    const { content } = req.body;
    const { id } = req.params;

    await Comments.destroy({
        where: {
          id: id
        }
    });

    res.redirect('/');
});

// app.get('/', (req, res) => {
//     console.log("??");
//     res.sendFile(__dirname + '/index.html')
// });

app.listen(port, ()=> {
    console.log(`listening on port : ${port}`);
});