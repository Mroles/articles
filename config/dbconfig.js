module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "propagandadb",
    DIALECT: "mysql",
    STORAGE:"./session/mysql",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 1000
    }
}