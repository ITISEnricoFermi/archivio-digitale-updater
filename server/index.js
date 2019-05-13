const express = require("express");
const { check, validationResult } = require("express-validator/check");
const app = express();
const { exec } = require("child_process");
const { bearer } = require("./utils/passport")

const getImageName = require("./images")


const PROJECT = process.env.PROJECT || "archivio";
const { NODE_ENV, PORT } = process.env

app.use(express.json());

app.get("/", (req, res) => {
    res.send({ api: "ok" });
})

// From https://github.com/ITISEnricoFermi/archivio-digitale-server
const checkErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        if (NODE_ENV !== "production")
            return res.status(422).json({ messages: errors.array().map(el => el.msg) })
        return res.sendStatus(422)
    }
    return next()
}

app.post("/", bearer, [
    check("service", "You must specifie a service name (same name as in the compose file)").isLength({ min: 3 }).toString(),
    check("tag", "You must specifie a tag for the image (image:tag)").isLength({ min: 1 }).toString()
], checkErrors, (req, res) => {
    const { service, tag } = req.body;

    const image = getImageName(service);
    console.log(`NodeJS : ${PROJECT}_${service} => ${image}:${tag}`);
    exec(`sh deploy.sh ${image} ${tag} ${PROJECT}_${service}`, (err, stdout, stderr) => {

        const error = err || stderr

        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }

        console.log(`Bash ${stdout}`);
        res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
