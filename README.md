# SETA Quanto Manca API v2

### Cos'è

SETA, la società del trasporto pubblico locale, offre un servizio online chiamato [SETA Quanto Manca](https://www.setaweb.it/mo/quantomanca "SETA Quanto Manca") che permette di vedere quanto tempo manca all'arrivo dell'autobus alla fermata.

Ho pensato a quanto sarebbe stato bello fare un tabellone degli arrivi con Arduino, ma per farlo prima mi sarebbe servita una API.
Visto che API della SETA non esistono, ne ho creata una io.
Questa è la seconda versione. Per ora la tengo hostata su [http://setaapi2.bitrey.it](http://setaapi2.bitrey.it), ma avviso che potrei tirarlo giù da un momento all'altro.
Se ti serve la sicurezza che l'API rimanga sempre online, o che [la hosti da solo](#come-hostare-questapi "Come hostare quest'API"), o, ancora meglio, mi dai [una mano a pagare la VPS che uso per hostare i siti qua](https://paypal.me/alessandroamella "eddai che i soldi per tenere online sta roba non mi piovono dal cielo").

Per una lista delle fermate con rispettivo codice del **bacino di Modena**, guarda il file `fermate.json`

### Come hostare quest'API

-   Se non l'hai già installato, scarica git
-   Clona il progetto con `git clone https://github.com/Bitrey/SETA-API-V2.git`
-   Entra nella cartella e installa le dependencies con `npm install`
-   Per fare partire il dev server fai `npm run start:dev`
-   Per fare partire il server come build finale (cosa che dovresti fare se non hai modifiche da apportare al codice) fai `npm start`

### Endpoints

-   `GET /nome/:nome`:

    -   **Parametri:**
        -   nome: (**_obbligatorio_**) il nome della fermata
    -   **Query:**
        -   formato: (_opzionale_) se uguale a "xml" i dati verranno restituiti in XML
    -   **Descrizione:**
        Restituisce l'[Oggetto FermataConOrario](#oggetto-fermataconorario "Oggetto FermataConOrario") con il nome corrispondente a quello dato.
        Se non viene trovata nessuna fermata (nome non valido), restituirà uno status code 400. **Nota:** supporta solo le fermate del bacino di Modena.

-   `GET /codice/:codice`:

    -   **Parametri:**
        -   codice: (**_obbligatorio_**) il codice della fermata
    -   **Query:**
        -   formato: (_opzionale_) se uguale a "xml" i dati verranno restituiti in XML
    -   **Descrizione:**
        Restituisce l'[Oggetto FermataConOrario](#oggetto-fermataconorario "Oggetto FermataConOrario") con il codice corrispondente a quello dato.
        Se non viene trovata nessuna fermata (codice non valido), restituirà uno status code 400. **Nota:** supporta solo le fermate del bacino di Modena.

-   `GET /corse/:bacino/:codice`:
    -   **Parametri:**
        -   bacino: (**_obbligatorio_**) il bacino dove si trova la fermata
        -   codice: (**_obbligatorio_**) il codice della fermata
    -   **Query:**
        -   formato: (_opzionale_) se uguale a "xml" i dati verranno restituiti in XML
        -   corseFermataOpposta: (_opzionale_) se mostrare le corse alla fermata opposta, può essere "si" o "no"
    -   **Descrizione:**
        Restituisce le prossime corse ([Array di oggetti Corsa](#oggetto-corsa "Oggetto Corsa")) passanti alla fermata col codice dato. **Nota:** il primo elemento dell'array sarà un oggetto di tipo `{orario: <orario>}` (con l'orario attuale al posto di `<orario>`).

### Classi di oggetti

Rappresentati nelle loro interfacce di TypeScript

-   ### Oggetto Fermata

```typescript
{
    codice: string;
    nome: string;
}
```

-   ### Oggetto FermataConOrario

```typescript
{
    codice: string;
    nome: string;
    orario: string;
}
```

-   ### Oggetto Corsa

```typescript
{
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
```
