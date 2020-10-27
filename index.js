var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var dbSettings=require("./models/index");
var expressLayouts=require('express-ejs-layouts');
const session=require("express-session");
var SequelizeStore=require('connect-session-sequelize')(session.Store);
var cookieParser=require("cookie-parser");
var tempData=require("tempdata");

require('dotenv').config();


var sessionStore=new SequelizeStore({db: dbSettings.sequelize});


app.use(express.static('static'))
app.use(cookieParser());

app.use(session({
    secret:process.env.ACCESSTOKEN,
    saveUninitialized:false,
    resave:false,
    store:sessionStore,
   // cookie:{
  //     maxAge:8600
  //  }
}));
app.use(tempData);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);






//sessionStore.sync();


app.set('view engine', 'ejs');

const port = process.env.PORT || 5000;

const db = require('./models');



//db.sequelize.sync({force:true}).then(() => {
  //  console.log("DB");
//})


app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.use(require('./controllers/accountcontroller'));
app.use(require("./controllers/articlecontroller"));
app.use(require("./controllers/admincontroller"));

app.listen(port, () => {
    console.log("Listening on port " + port);
});