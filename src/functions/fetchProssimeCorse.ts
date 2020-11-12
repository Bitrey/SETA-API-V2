import FormData from "form-data";
import got from "got";
import { FUNZIONI_URL } from "../config/options";
import { Corsa } from "../interfaces";
import { fetchOraAttuale } from "./fetchOraAttuale";

export const fetchProssimeCorse = (
    palina: string = "MO2076",
    bacino: "mo" | "re" | "pc" = "mo",
    cerca_palina_opposta: "si" | "no" = "no"
): Promise<any> => {
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

            // console.log(res.body);
            const corse: Corsa[] = JSON.parse(res.body);

            // Remove invalid data
            for (let i = 0; i < corse.length; i++) {
                if (!corse[i].linea) {
                    corse.splice(i, 1);
                    i--;
                }
            }

            const orario = await fetchOraAttuale();

            // DEBUG
            // console.log(corse);

            return resolve([{ orario }, ...corse]);
        } catch (err) {
            if (err instanceof SyntaxError) {
                resolve(<Corsa[]>[]);
            } else {
                reject(err || err?.message);
            }
        }
    });
};
