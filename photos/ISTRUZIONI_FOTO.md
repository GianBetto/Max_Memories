# 📸 Guida all'inserimento delle 12 Foto Ricordo

Benvenuto nella cartella `photos/` di **Max Memories**!
Qui troverai le istruzioni semplici e veloci per inserire le tue 12 fotografie ricordo personali nel sito web.

---

## 🚀 Metodo 1: Sostituzione Diretta (Il più rapido)

Basta salvare le tue 12 foto all'interno di questa cartella (`photos/`) con i seguenti nomi file:

1. `foto_01.jpg` *(o .png / .webp / .svg)*
2. `foto_02.jpg`
3. `foto_03.jpg`
4. `foto_04.jpg`
5. `foto_05.jpg`
6. `foto_06.jpg`
7. `foto_07.jpg`
8. `foto_08.jpg`
9. `foto_09.jpg`
10. `foto_10.jpg`
11. `foto_11.jpg`
12. `foto_12.jpg`

> **Consiglio Risoluzione & Formato**:
> - **Formati supportati**: JPG, JPEG, PNG, WEBP, SVG.
> - **Risoluzione consigliata**: tra 800x600 px e 1920x1080 px (orizzontale o quadrata rende al meglio).
> - **Compressione**: foto con peso intorno a 200KB - 800KB garantiscono un caricamento fulmineo.

---

## ✏️ Metodo 2: Personalizzare Titoli, Date e Nomi File

Nel file principale [script.js](../script.js) troverai all'inizio l'elenco configurabile dei 12 ricordi:

```javascript
const memoriesData = [
  {
    id: 1,
    title: "Il Primo Incontro",
    category: "speciali", // 'speciali', 'feste', 'viaggi', 'tappe'
    categoryLabel: "Momenti Speciali",
    date: "15 Settembre 2024",
    tag: "MEMORIA #01",
    image: "photos/foto_01.jpg", // <--- Puoi cambiare anche il nome o formato del file
    desc: "Il giorno in cui tutto è iniziato, pieno di sorrisi e aspettative."
  },
  // ... fino a 12
];
```

Puoi personalizzare testi, date, categorie e tag in pochi secondi aprendo `script.js` con qualsiasi editor di testo o chiedendomi di farlo per te!
