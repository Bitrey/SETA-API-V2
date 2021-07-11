import got from "got";
import moment from "moment";
import { WORLDTIMEAPI_URL } from "../config/options";

export const fetchOraAttuale = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const res: any = await got(WORLDTIMEAPI_URL, {
                responseType: "json"
            });
            const body: { datetime?: string } = res.body;
            if (body && typeof body.datetime === "string") {
                const orario = moment(body.datetime);
                resolve(orario.format("HH") + ":" + orario.format("mm"));
            } else {
                reject(body);
            }
        } catch (err) {
            reject(err);
        }
    });
};
