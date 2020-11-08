import got from "got";
import { WORLDTIMEAPI_URL } from "../config/options";

export const fetchOraAttuale = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const res: any = await got(WORLDTIMEAPI_URL, {
                responseType: "json"
            });
            const body: { datetime?: string } = res.body;
            if (body && typeof body.datetime === "string") {
                const orario = new Date(body.datetime);
                let hours: string | number = orario.getHours();
                let minutes: string | number = orario.getMinutes();
                if (hours < 10) hours = "0" + hours;
                if (minutes < 10) minutes = "0" + minutes;
                resolve(hours + ":" + minutes);
            } else {
                reject(body);
            }
        } catch (err) {
            reject(err);
        }
    });
};
