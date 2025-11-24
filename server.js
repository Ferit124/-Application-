import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// === GİZLİ VARDİYA ALGORİTMASI ===
function generateVardiya() {
    const calisanlar = ["Mehtap","Yasemin","Engin","Güneş","Gürkan","Koray","Mert","Yasin K"];
    const gunler = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
    const sabahKisiSayisi = 3;
    const aksamMinimum = 3;
    const sabahOnly = ["Mehtap","Yasemin"];

    function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

    const izinler = {};
    calisanlar.forEach(c => {
        let start = Math.floor(Math.random() * gunler.length);
        izinler[c] = [gunler[start], gunler[(start + 1) % gunler.length]];
    });

    const vardiyaPlan = {};
    let oncekiAksam = [];

    gunler.forEach(gun => {
        vardiyaPlan[gun] = {};

        let eligibleSabah = calisanlar.filter(c =>
            !izinler[c].includes(gun) &&
            !oncekiAksam.includes(c)
        );

        let sabahVardiya = [];
        sabahOnly.forEach(c => {
            if(eligibleSabah.includes(c)) sabahVardiya.push(c);
        });

        let kalan = sabahKisiSayisi - sabahVardiya.length;
        let digerleri = eligibleSabah.filter(c => !sabahVardiya.includes(c));
        shuffle(digerleri);
        sabahVardiya = sabahVardiya.concat(digerleri.slice(0, kalan));

        vardiyaPlan[gun]["09:00-17:00"] = sabahVardiya;

        let eligibleAksam = calisanlar.filter(c =>
            !izinler[c].includes(gun) &&
            !vardiyaPlan[gun]["09:00-17:00"].includes(c) &&
            !sabahOnly.includes(c)
        );
        shuffle(eligibleAksam);

        if (eligibleAksam.length < aksamMinimum) {
            let takviye = vardiyaPlan[gun]["09:00-17:00"].filter(c => !sabahOnly.includes(c));
            eligibleAksam = eligibleAksam.concat(takviye.slice(0, aksamMinimum - eligibleAksam.length));
        }

        vardiyaPlan[gun]["17:00-01:00"] = eligibleAksam.slice(0, Math.max(aksamMinimum, eligibleAksam.length));
        oncekiAksam = vardiyaPlan[gun]["17:00-01:00"];
    });

    return vardiyaPlan;
}

// === API ENDPOINT ===
app.post("/vardiya", (req, res) => {
    const plan = generateVardiya();
    res.json(plan);
});

app.listen(process.env.PORT || 3000, () => console.log("Backend çalıştı!"));
