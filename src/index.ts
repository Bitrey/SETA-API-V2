// Dotenv
import dotenv from "dotenv";
dotenv.config();

// Express
import express from "express";
const app = express();

// Disable SSL certificate check
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Morgan
import morgan from "morgan";
import { logger, LoggerStream } from "./shared/logger";
app.use(morgan("tiny", { stream: new LoggerStream() }));

// Array fermate salvato in RAM, aggiornato ogni ora
import { Fermata, FermataConOrario } from "./interfaces";
let fermate: Fermata[] = [];

// Aggiorna le fermate ogni ora
import schedule from "node-schedule";
const aggiornaFermate = schedule.scheduleJob("00 * * * *", async () => {
    logger.info("Fermate aggiornate");
    fermate = await fetchFermate();
});

// Appena parte il server, sincronizza le fermate
import { fetchProssimeCorse, fetchFermate, fetchOraAttuale } from "./functions";
fetchFermate().then(fermateTrovate => (fermate = fermateTrovate));

// Questa libreria è fatta col culo, solo i types si importano con la sintassi ES6
import convertType from "js2xmlparser";
var convert: typeof convertType = require("js2xmlparser");

app.get("/nome/:nome", async (req, res) => {
    const { nome } = req.params;
    const fermata = fermate.find(f => f.nome === nome);
    const orario = await fetchOraAttuale();
    if (!fermata) {
        return res.status(400).send(`Fermata con nome "${nome}" non trovata.`);
    }
    const fermataConOrario: FermataConOrario = { ...fermata, orario };
    if (req.query.formato === "xml") {
        res.send(convert.parse("fermata", fermataConOrario));
    } else res.json(fermataConOrario);
});

app.get("/codice/:codice", async (req, res) => {
    const { codice } = req.params;
    const fermata = fermate.find(f => f.codice === codice);
    const orario = await fetchOraAttuale();
    if (!fermata) {
        return res
            .status(400)
            .send(`Fermata con codice "${codice}" non trovata.`);
    }
    const fermataConOrario: FermataConOrario = { ...fermata, orario };
    if (req.query.formato === "xml") {
        res.send(convert.parse("fermata", fermataConOrario));
    } else res.json(fermataConOrario);
});

app.get("/corse/:bacino/:codice", async (req, res) => {
    try {
        const { bacino, codice } = req.params;
        const { corseFermataOpposta, formato } = req.query;

        // Controlla bacino
        if (bacino !== "mo" && bacino !== "re" && bacino !== "pc") {
            return res
                .status(400)
                .send(`Bacino non valido, può essere "mo", "re" o "pc".`);
        }

        // Controlla fermata
        const fermata = fermate.find(f => f.codice === codice);
        if (!fermata) {
            return res.status(400).send("Codice fermata non valido.");
        }

        // Controlla palina opposta
        let oppostaReal: "si" | "no" = "no";
        if (corseFermataOpposta) {
            if (corseFermataOpposta !== "si" && corseFermataOpposta !== "no") {
                return res
                    .status(400)
                    .send(
                        `La query opzionale "corseFermataOpposta" può essere "si" o "no".`
                    );
            } else {
                oppostaReal = corseFermataOpposta;
            }
        }

        const corse = await fetchProssimeCorse(codice, bacino, oppostaReal);

        if (formato === "xml") return res.send(convert.parse("corse", corse));
        else return res.json(corse);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err || err?.message);
    }
});

app.all("*", (req, res) => res.sendStatus(404));

// debug!!!
// import { VoiceReader } from "./voice";
// const j = require("../test/example7.json");
// for (let i = 1; i < j.length; i++) {
//     const t = new VoiceReader(j[i]);
//     logger.debug(t.leggi());
// }

const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || "127.0.0.1";
app.listen(PORT, IP, () => logger.info("Server started on port " + PORT));
