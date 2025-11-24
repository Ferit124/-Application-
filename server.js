import express from "express";
import basicAuth from "express-basic-auth";
import fs from "fs";

const app = express();

// 1) BASIC AUTH
app.use(
  basicAuth({
    users: { "ferit": "123" },
    challenge: true,
  })
);


app.get("/script.js", (req, res) => {
  const content = fs.readFileSync("Balance+Withdraw.user.js", "utf8");
  res.setHeader("Content-Type", "application/javascript");
  res.send(content);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
