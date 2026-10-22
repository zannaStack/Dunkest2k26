# 🏀 Dunkest 2k26 - Live Auction & Roster Manager

> Web application reattiva in React e Vite per la gestione strategica e il coordinamento in tempo reale delle aste del fantabasket Dunkest.

---

## 🎯 Panoramica del Progetto

Gestire un'asta di fantabasket dal vivo con il regolamento ufficiale Dunkest comporta calcoli complessi ad ogni rilancio:
- Verificare i crediti residui e la **Puntata Massima Sicura** (garantendo crediti sufficienti per completare il roster obbligatorio a 1 credito);
- Rispettare i vincoli di ruolo (Guardie, Ali, Centri, Coach);
- Monitorare il budget residuo degli avversari per prevedere i rilanci concorrenti;
- Consultare rapidamente statistiche, ruoli e fasce di quotazione dei giocatori.

**Dunkest 2k26** centralizza tutti questi aspetti in un'unica interfaccia ad alta usabilità.

---

## 🚀 Funzionalità Principali

- **Pannello Asta in Tempo Reale**: Assegnazione istantanea dei giocatori con ricalcolo immediato dei budget di tutti i partecipanti.
- **Roster & Vincoli di Ruolo**: Visualizzazione dinamica del proprio quintetto e panchina con blocco automatico di acquisti incompatibili.
- **Analisi Avversari**: Monitoraggio in tempo reale del "Max Bid" di ciascun avversario, per capire subito chi ha il potere economico di rilanciare.
- **Ricerca & Filtri Avanzati**: Filtraggio multi-criterio per nome, squadra NBA/LBA, ruolo e stato di assegnazione (disponibile, mio, altrui).
- **Persistenza Stato con LocalStorage**: Ripristino automatico dell'asta anche in caso di ricaricamento o chiusura accidentale del browser.

---

## 🛠️ Stack Tecnologico

- **Framework**: React 18+ (con Vite per bundle super veloci e Hot Module Replacement)
- **Gestione dello Stato**: Custom Hook architetturale (`useDunkestApp`) con flusso dati reattivo
- **Styling**: CSS modulare ad alto contrasto con animazioni fluide
- **Build Tool**: Vite

---

## 💻 Come Avviare l'Applicazione

### Prerequisiti
- [Node.js](https://nodejs.org/) (versione 18 o superiore)
- npm o yarn

### Installazione ed Esecuzione
```bash
# Entra nella cartella della web app
cd web

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```
L'applicazione sarà accessibile all'indirizzo locale indicato da Vite (di solito `http://localhost:5173`).

---

## 👤 Autore
**Fabio Zanetti**  
Studente di Ingegneria Informatica @ Università di Bologna  
- Portfolio: [fabiozanetti.it](https://fabiozanetti-it.vercel.app)  
- GitHub: [@zannaStack](https://github.com/zannaStack)
