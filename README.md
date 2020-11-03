# SETA API v2

### Endpoints

-   `GET /nome/:nome`:

    -   **Parametri:**
        -   nome: (**_obbligatorio_**) il nome della fermata
    -   **Query:**
        -   formato: (_opzionale_) se uguale a "xml" i dati verranno restituiti in XML
    -   **Descrizione:**
        Restituisce l'[Oggetto Fermata](https://github.com/pandao/editor.md "Oggetto Fermata") con il nome corrispondente a quello dato.
        Se non viene trovata nessuna fermata (nome non valido), restituirà uno status code 400.

-   `GET /codice/:codice`:

    -   **Parametri:**
        -   codice: (**_obbligatorio_**) il codice della fermata
    -   **Query:**
        -   formato: (_opzionale_) se uguale a "xml" i dati verranno restituiti in XML
    -   **Descrizione:**
        Restituisce l'oggetto Fermata con il codice corrispondente a quello dato.
        Se non viene trovata nessuna fermata (codice non valido), restituirà uno status code 400.

-   `GET /corse/:bacino/:codice`:
    -   **Parametri:**
        -   bacino: (**_obbligatorio_**) il bacino dove si trova la fermata
        -   codice: (**_obbligatorio_**) il codice della fermata
    -   **Query:**
        -   formato: (_opzionale_) se uguale a "xml" i dati verranno restituiti in XML
        -   corseFermataOpposta: (_opzionale_) se mostrare le corse alla fermata opposta, può essere "si" o "no"
    -   **Descrizione:**
        Restituisce le prossime corse ([Oggetti Corsa](https://github.com/pandao/editor.md "Oggetto Corsa")) passanti alla fermata col codice dato.

### Classi di oggetti

-   ### Oggetto Fermata

```typescript
{
    codice: string;
    nome: string;
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
