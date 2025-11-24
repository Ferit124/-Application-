import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "MY_SUPER_SECRET_TOKEN"; // bunu değiştir!

app.post("/get-script", (req, res) => {
    if (req.headers["x-auth"] !== SECRET)
        return res.status(403).json({ error: "Unauthorized" });

    const safeCode = `
        const btn = document.createElement("button");
        btn.innerText = "Benim Butonum";
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.padding = "10px 20px";
        btn.style.background = "#007BFF";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.zIndex = 10000;

        btn.onclick = () => {
            alert("Sunucudan gelen gizli kod çalıştı!");
        };

        document.body.appendChild(btn);
    `;

    res.json({ code: safeCode });
});

app.listen(10000);
console.log("Server running on port 10000");
