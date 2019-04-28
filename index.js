const express = require('express');
const app = express();
const { exec } = require('child_process');

app.use(express.json());

app.get('/', (req, res) => {
    res.send({ api: 'ok' });
})

app.post('/', (req, res) => {
    const project = req.body.project
    const service = req.body.service
    const image = req.body.image;
    const tag = req.body.tag;
    console.log(`NodeJS : ${project}_${service} => ${image}:${tag}`);
    exec(`sh deploy.sh ${image} ${tag} ${project}_${service}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        if (stderr) {
            console.error(stderr);       
            return res.sendStatus(500);
        }

        console.log(`Bash ${stdout}`);
        res.sendStatus(200);
    });
});

app.listen(3050, () => {
    console.log('server started on port 3050');
});