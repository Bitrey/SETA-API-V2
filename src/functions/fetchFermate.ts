import { FERMATE_FILE_PATH, QUANTOMANCA_URL } from "../config/options";
import { Fermata } from "../interfaces";
import cheerio from "cheerio";
import got from "got";
import fs from "fs";
import { logger } from "../shared";

export const fetchFermate = (): Promise<Fermata[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { body } = await got(QUANTOMANCA_URL);
            const $ = cheerio.load(body);

            if (!$("#qm_palina > option").length) {
                logger.error("Can't parse SETA Quanto Manca HTML!");
                const importate = require(FERMATE_FILE_PATH);
                if (!importate)
                    reject("Can't parse HTML and file save doesn't exist");
                return resolve(importate);
            }

            const fermateTrovate: Fermata[] = [];

            $("#qm_palina > option").each((i, e) => {
                const nome = $(e).text();
                const codice = $(e).attr("value");

                if (!nome || !codice) return;

                fermateTrovate.push({ nome, codice });
            });

            // DEBUG
            // console.log(fermate);

            // Salva su file
            fs.writeFileSync(
                FERMATE_FILE_PATH,
                JSON.stringify(fermateTrovate, null, 4)
            );

            logger.info("SETA Quanto Manca HTML got parsed and saved to file");

            resolve(fermateTrovate);
        } catch (err) {
            reject(err);
        }
    });
};
