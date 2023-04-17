import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "peon",
    "root",
    "",
    {
        host: "localhost",
        dialect: "mysql"
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("database connected!");
    } catch (error: any) {
        console.log(error.message);
    }
}

export {
    connectDB,
    sequelize
};
