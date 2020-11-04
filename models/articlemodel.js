module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define("articles", {
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT
        },
        imageurl: {
            type: Sequelize.TEXT
        },
        lastedited: {
            type: Sequelize.DATE
        },
        isvisible: {
            type: Sequelize.BOOLEAN
        },
        excerpt:{
            type:Sequelize.TEXT
        },
    });

    return Article;
};