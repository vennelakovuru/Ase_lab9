const express = require('express');
const app = express();
const port = 3000;

const jwt = require('jsonwebtoken');
const fs = require('fs');

app.get('/', (req, res) => res.send('Hello World'));
app.get('/secret', isAuthorized, (req, res) => res.json({"message": "This is secret. Dont Share it"}));
app.get('/readme', (req, res) => res.json({"message": "This is open to world"}));
app.get('/jwt', (req, res) => {
    let privateKey = fs.readFileSync('./private.pem', 'utf8');
    let token = jwt.sign({"body": "stuff"}, privateKey, {algorithm: 'HS256'});
    console.log(token);
    res.send(token);
});

function isAuthorized(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = fs.readFileSync('./private.pem', 'utf8');
        jwt.verify(token, privateKey, {algorithm: "HS256"}, (err, user) => {

            if (err) {
                // shut them out!
                res.status(500).json({error: "Not Authorized"});
                throw new Error("Not Authorized");
            }
            return next();
        });
    } else {
        res.status(500).json({error: "Not Authorized"});
        throw new Error("Not Authorized");
    }
}

app.listen(port, () => console.log(`Express app listening on port ${port}`));
