@echo off
:: Entra nella cartella del progetto e poi in quella del sito web (React)
cd /d "%~dp0web"

:: Avvia il server di sviluppo di Vite (React) in background
start "Vite Server" cmd /k "npm run dev"

:: Aspetta 3 secondi per dare il tempo a Vite di accendersi
timeout /t 3 >nul

:: Apre il browser all'indirizzo locale tipico di Vite
start "" http://localhost:5173

exit