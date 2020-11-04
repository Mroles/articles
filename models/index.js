const dbConfig = require('../config/dbconfig');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        storage:dbConfig.STORAGE,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db={};
db.sequelize=sequelize;
db.Sequelize=Sequelize;

db.user=require('./usermodel')(sequelize,Sequelize);
db.article=require('./articlemodel')(sequelize,Sequelize);
db.comment=require('./commentmodel')(sequelize, Sequelize);

//User-Article: One to many
db.user.hasMany(db.article)
db.article.belongsTo(db.user)

//User-Comment: One to many
//db.user.hasMany(db.comment);
//db.comment.belongsTo(db.user);

//Article-Comment: one to Many
db.article.hasMany(db.comment);
db.comment.belongsTo(db.article);

module.exports=db;
