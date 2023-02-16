const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './startups/config.env' });
const app = require('./app');


const DB_LOCAL = process.env.DB_DEV;
const DB_CLOUD = process.env.DB_CLOUD.replace('<PASSWORD>', process.env.PASSWORD);
require('./db')(DB_CLOUD);


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {

    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);

    server.close( () => {
        process.exit(1);
    })
});
  