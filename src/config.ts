import dotenv from 'dotenv';

const {ENV_TYPE} = process.env;
dotenv.config({path: `.env.${ENV_TYPE || 'development'}`});
