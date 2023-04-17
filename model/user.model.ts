import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    mobile: {
        type: DataTypes.STRING,
        unique: true
    }
});

sequelize.sync().then(() => {
    
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export { User };