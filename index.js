const express = require('express');
const inject = require('require-all');
const config = require('./config');

const app = express();
const router = express.Router;
const port = config.port;

app.use(express.json());
app.use(express.static('client'));

const controllers = inject(`${__dirname}/controllers`);
const actions = inject(`${__dirname}/actions`);
const models = inject(`${__dirname}/models`);

for (const name of Object.keys(controllers)) {
    app.use(`/${name}`, controllers[name]({router, actions, models}));
}

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/client/html/index.html`);
});

app.listen(port);