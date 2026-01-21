# VAIISemestralka

Tento projekt je semestrálna práca pre predmet VAII. Skladá sa z dvoch častí:

- **backend/** – ASP.NET Core Web API (C#)
- **frontend/** – Next.js (React, TypeScript)

## Požiadavky

- .NET 8 SDK (pre backend)
- Node.js 18+ (pre frontend)

## Spustenie projektu

### Backend

1. Prejdite do priečinka backend:
   ```bash
   cd backend
   ```
2. Spustite API:
   ```bash
   dotnet run
   ```
   Backend bude bežať na http://localhost:5000 (alebo podľa nastavenia v appsettings.json).

### Frontend

1. Prejdite do priečinka frontend:
   ```bash
   cd frontend
   ```
2. Nainštalujte závislosti:
   ```bash
   npm install
   ```
3. Spustite vývojový server:
   ```bash
   npm run dev
   ```
   Frontend bude dostupný na http://localhost:3000.

## Štruktúra projektu

- **backend/** – zdrojové kódy API, modely, controllery, migrácie
- **frontend/** – Next.js aplikácia, komponenty, stránky, hooky

## Poznámky

- Prístupové údaje a ďalšie nastavenia nájdete v súboroch `appsettings.json` a `.env`.
