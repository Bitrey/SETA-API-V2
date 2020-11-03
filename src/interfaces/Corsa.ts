export interface Corsa {
    linea: string;
    n_linea: string;
    pianificato: string;
    destinazione: string;
    tipo_linea: "u" | "e";
    news: string;
    temporeale: string;
    num_bus: string;
    min_all_arrivo_val: number;
}
