import moment from "moment";
import { logger } from "../shared";
import { Corsa } from "../interfaces";
import { pronunciationMap } from "./pronunciationMap";

class Avviso {
    private _str: string;

    constructor(str?: string) {
        this._str = str || "";
    }

    get str() {
        return this._str;
    }

    concat(
        str: string,
        params?: { noComma?: boolean; noWhiteSpace?: boolean }
    ) {
        if (str) {
            if (!params?.noWhiteSpace) this._str += " ";
            this._str += str;
            if (!params?.noComma) this._str += ",";
        }
    }

    endStr() {
        this._str = this._str.trim();
        while (this._str.endsWith(",")) {
            this._str = this._str.slice(0, this._str.length - 1);
            this._str = this._str.trim();
        }
        this._str += ".";
        // if (this._str.endsWith(".")) {
        //     this._str = this._str.slice(0, this._str.length - 1).trim() + ".";
        //     while (this._str[this._str.length - 2] === ",") {
        //         this._str = this._str.slice(0, this._str.length - 2) + ".";
        //     }
        // }
    }
}

export class VoiceReader {
    private _corsa: Corsa;

    constructor(corsa: Corsa) {
        if (!corsa || !corsa.linea) {
            throw new Error("Oggetto non valido");
        }
        this._corsa = corsa;
    }

    get corsa() {
        return Object.freeze(this._corsa);
    }

    leggi(): string {
        const avviso = new Avviso("L'autobus di linea");
        avviso.concat(this.lineaStr()); // 760
        avviso.concat(this.destinazioneStr()); // diretto a Modena
        avviso.concat(this.pianificatoStr()); // delle ore 14 e 18
        avviso.concat(this.minArrivoStr(), {
            noComma: this.isLate() !== true
        }); // è in arrivo
        avviso.concat(this.ritardoStr());
        avviso.concat(this.secondoOrarioPrevisto());
        avviso.endStr();
        return avviso.str;
    }

    aggiornaCorsa(nuovaCorsa: Corsa) {
        this._corsa = nuovaCorsa;
    }

    private lineaStr(): string {
        const { linea } = this.corsa;
        if (linea.endsWith("tax") || linea.endsWith("taxi")) {
            return linea.split("tax")[0] + " taxi";
        }
        if (!isNaN(linea as any) && linea.length > 2 && !linea.endsWith("00")) {
            const c = linea.length % 2 === 0;
            const l = c ? linea : linea.slice(1, linea.length);
            const s = l.match(/.{1,2}/g);
            if (s && !c) s.unshift(linea[0]);
            if (s) return s.join(" e ");
        }
        return linea;
    }

    private static titleCase(str: string) {
        const splitStr = [...str.toLowerCase().split(" ")];
        // const splitStr = [...str.toLowerCase().split(/[\ \']/g)];
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] =
                splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(" ");
    }

    private destinazioneStr(): string {
        let { destinazione } = this.corsa;
        if (!destinazione) return "";
        if (pronunciationMap.has(destinazione)) {
            destinazione = pronunciationMap.get(destinazione) as string;
        }
        if (destinazione.includes("S.")) {
            destinazione = destinazione.replace(new RegExp("S. ", "g"), "San ");
        }
        return "diretto a " + destinazione; // VoiceReader.titleCase(destinazione);
    }

    private pianificatoStr(): string {
        const { pianificato } = this.corsa;
        if (!pianificato) return "";
        if (!pianificato.includes(":")) return pianificato;
        const [h, min] = pianificato.split(":");
        return `delle ore ${h} e ${min}`;
    }

    private minArrivoStr(): string {
        const min = this.corsa.min_all_arrivo_val;
        // se undefined o uguale a 0 o 9999
        // DEBUG!! CALCOLA RISPETTO A ORARIO ATTUALE
        if (!min || min === 9999) return "è in arrivo";
        const plurale = min == 1 ? "o" : "i";
        return `arriverà tra ${min !== 1 ? min : "un"} minut${plurale}`;
    }

    private isLate(): boolean | null {
        const r = this.calcolaRitardo();
        if (r === null) return null;
        return !(r > -2 && r < 2);
    }

    private ritardoStr(): string {
        const { pianificato, temporeale } = this.corsa;
        if (!pianificato || !temporeale) return "";
        const r = this.calcolaRitardo();
        const a = Math.abs(parseInt(r as any));
        // ignora ritardi < 5 min e anticipi < 2 min
        const isLate = this.isLate();
        if (isLate === null) return "";
        else if (!isLate) return "come previsto";

        return `in ${
            (r as number) > 0 ? "ritardo" : "anticipo"
        } di ${a} minuti rispetto all'orario programmato`;
    }

    private calcolaRitardo(): number | null {
        const { pianificato, temporeale } = this.corsa;
        const d1 = moment(pianificato, "HH:mm");
        const d2 = moment(temporeale, "HH:mm");
        if (!d1.isValid() || !d2.isValid()) return null;
        const duration = moment.duration(d2.diff(d1));
        return duration.asMinutes();
    }

    private secondoOrarioPrevisto(): string {
        if (this.corsa.min_all_arrivo_val !== 9999) return "";
        else return "secondo l'orario programmato";
    }
}
