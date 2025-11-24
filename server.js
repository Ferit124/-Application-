const express = require("express");
const fs = require("fs");
const app = express();

const SECRET = "MY_SUPER_SECRET_TOKEN"; // BUNU SADECE SEN BİL

app.get("/code", (req, res) => {
    const token = req.query.token;

    if (token !== SECRET) {
        return res.status(403).send("Forbidden");
    }

    const code = fs.readFileSync("script.js", "utf8");
    res.type("text/javascript").send(code);
});

app.listen(3000, () => console.log("Server running"));
