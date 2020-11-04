module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comments", {
        name:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT
        },
    });

    return Comment;
};