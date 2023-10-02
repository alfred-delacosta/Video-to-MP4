const { Sequelize, DataTypes, INTEGER } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_NAME
});

const Video = sequelize.define('Video', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

async function init() {
    try {
        await Video.sync();
        console.log("Database connected successfully.");
    } catch (error) {
        return error
    }
}

init();

module.exports = Video;