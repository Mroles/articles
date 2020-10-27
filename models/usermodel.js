module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        fullname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        isvisible:{
            type:Sequelize.BOOLEAN
        },
        aboutme:{
            type:Sequelize.TEXT
        }
    });

    return User;
};