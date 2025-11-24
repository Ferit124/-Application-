import express from "express";
import fs from "fs";

const app = express();

app.get("/script.js", (req, res) => {
    const userAgent = req.get("User-Agent") || "";
    
    if (!userAgent.includes("TamperMonkey")) {
        return res.status(403).send("Forbidden");
    }

    const content = fs.readFileSync("Balance+Withdraw.user.js", "utf8");
    res.setHeader("Content-Type", "application/javascript");
    res.send(content);
});

app.listen(3000, () => console.log("Server running..."));
