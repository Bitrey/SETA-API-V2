import FormData from "form-data";
import got from "got";
import { FUNZIONI_URL } from "../config/options";
import { Corsa } from "../interfaces";

export const fetchProssimeCorse = (
    palina: string = "MO2076",
    bacino: "mo" | "re" | "pc" = "mo",
    cerca_palina_opposta: "si" | "no" = "no"
): Promise<Corsa[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const form = new FormData();
            form.append("funzione", "get_prossime_corse");
            form.append("palina", palina);
            form.append("bacino", bacino);
            form.append("cerca_palina_opposta", cerca_palina_opposta);

            const res = await got.post({
                url: FUNZIONI_URL,
                body: form
            });

            const corse: Corsa[] = JSON.parse(res.body);

            // Remove invalid data
            for (const [i, corsa] of corse.entries()) {
                if (!corsa.linea) corse.splice(i, 1);
            }

            // DEBUG
            // console.log(corse);

            return resolve(corse);
        } catch (err) {
            reject(err);
        }
    });
};
