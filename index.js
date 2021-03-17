const express = require('express');
const inject = require('require-all');
const config = require('./config');

const app = express();
const router = express.Router;
const port = config.port;

app.use(express.json());
const controllers = inject(`${__dirname}/controllers`);
const actions = inject(`${__dirname}/actions`);
const models = inject(`${__dirname}/models`);

for (const name of Object.keys(controllers)) {
    app.use(`/${name}`, controllers[name]({router, actions, models}));
}

app.listen(port);