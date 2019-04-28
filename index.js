const express = require('express');
const { check, validationResult } = require('express-validator/check');
const app = express();
const { exec } = require('child_process');

app.use(express.json());

app.get('/', (req, res) => {
    res.send({ api: 'ok' });
})

// From https://github.com/ITISEnricoFermi/archivio-digitale-server
const checkErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        if (process.env.NODE_ENV !== "production")
            return res.status(422).json({ messages: errors.array().map(el => el.msg) })
        return res.sendStatus(422)
    }
    return next()
}

app.post('/', [
    check("project", "You must specifie a project name").isLength({ min: 3 }).toString(),
    check("service", "You must specifie a service name").isLength({ min: 3 }).toString(),
    check("image", "You must specifie an image name").isLength({ min: 3 }).toString(),
    check("service", "You must specifie a tag for the image").isLength({ min: 1 }).toString()
], checkErrors, (req, res) => {
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
