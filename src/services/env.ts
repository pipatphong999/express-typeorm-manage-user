import * as dotenv from "dotenv";
dotenv.config();
export default {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES: parseInt(process.env.JWT_EXPIRES || "") || 300,
    JWT_REFRESH_EXPIRES: parseInt(process.env.JWT_REFRESH_EXPIRES || "") || 86400,

    DB_HOST: process.env.DB_HOST,
    DB_PORT: parseInt(process.env.DB_PORT || "") || 3306,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
};
