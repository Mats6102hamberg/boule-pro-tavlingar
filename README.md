# 🎯 Boule PRO Turnering

**Professionellt turneringssystem för Pétanque/Boule med Swiss System och Cup-spel**

![React](https://img.shields.io/badge/React-19.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-success)

## 📖 Om projektet

Boule PRO Turnering är ett fullständigt turneringshanteringssystem byggt för bouletävlingar. Systemet hanterar allt från laganmälan till matchparningar med Swiss System, slutspel och professionella utskrifter.

### 🌟 Huvudfunktioner

### ⚡ Swiss System (NYT!)
- ✅ **Automatisk matchparning** - Intelligent parning baserat på ranking
- ✅ **Buchholz-beräkning** - Avancerad tiebreaker-metod
- ✅ **Undvik omatcher** - Systemet säkerställer att samma lag inte möts igen
- ✅ **Flera ronder** - Kör så många Swiss-ronder som behövs

### 🎯 Matchhantering (NYT!)
- ✅ **Live resultatregistrering** - Registrera matchresultat direkt i appen
- ✅ **Poängsystem** - Automatisk poängberäkning (2p vinst, 1p oavgjort)
- ✅ **Matchstatus** - Se pågående och slutförda matcher
- ✅ **Matchhistorik** - Komplett översikt över alla spelade matcher

### 🏆 Cup/Slutspel (NYT!)
- ✅ **Kvartsfinal-bracket** - Automatisk generering av cup-träd
- ✅ **Semifinal & Final** - Automatisk avancering till nästa rond
- ✅ **Bronsmatch** - Match om 3:e plats
- ✅ **Top 8-seeding** - De 8 bästa lagen från Swiss går vidare

### 🌐 Live Resultat-tavla (NYT!)
- ✅ **Publik skärm** - Perfekt för projektor/storskärm
- ✅ **Realtidsuppdatering** - Ranking och matcher uppdateras live
- ✅ **Stor text** - Lätt att läsa på avstånd
- ✅ **Professionell design** - Imponerande visuell presentation

### 📊 Avancerad Statistik (NYT!)
- ✅ **Ranking-tabell** - Komplett med vinster, förluster, poäng och Buchholz
- ✅ **Medaljer** - Visuell markering av topp 3
- ✅ **Matchstatistik** - Antal spelade, pågående och klara matcher
- ✅ **Fas-översikt** - Tydlig indikation på aktuell turneringsfas

### 🏅 Grundfunktioner
- ✅ **Turneringshantering** - Skapa och hantera flera turneringar samtidigt
- ✅ **Lag & Spelare** - Hantera singel, dubbel och trippel-lag
- ✅ **Ålderskategorier** - Stöd för Öppen, V55, V65, V75
- ✅ **Print-funktioner** - Professionella utskrifter för anslagstavla
- ✅ **Auto-sparning** - All data sparas lokalt i webbläsaren
- ✅ **Responsiv design** - Fungerar på desktop, tablet och mobil

## 🚀 Snabbstart

### Installation

```bash
# Klona repositoryt
git clone https://github.com/Mats6102hamberg/boule-pro-tavlingar.git
cd boule-pro-tavlingar

# Installera dependencies
npm install

# Starta utvecklingsserver
npm start
```

Appen öppnas automatiskt på [http://localhost:3000](http://localhost:3000)

## 📋 Användning

### Skapa en ny turnering

1. Klicka på **"➕ Ny tävling"** på dashboard
2. Fyll i turneringsnamn och inställningar:
   - Lagtyp (Singel/Dubbel/Trippel)
   - Ålderskategori
   - Antal Swiss-ronder (2-4)
   - Lag per pool (3-4)
3. Klicka **"Skapa tävling"**

### Registrera lag

1. Öppna turneringen från dashboard
2. Klicka **"➕ Lägg till lag"**
3. Fyll i:
   - Lagnamn
   - Spelarnamn
   - Licensnummer (valfritt)
   - Kontaktinfo (valfritt)
4. Klicka **"Lägg till lag"**

### Starta turneringen

1. När alla lag är registrerade klickar du **"🎲 Starta Swiss-ronder"**
2. Systemet parar automatiskt ihop lagen
3. Registrera matchresultat
4. Kör nästa rond eller gå vidare till slutspel

### Skriv ut dokument

1. Klicka på **"🖨️ Skriv ut"**
2. Välj vad du vill skriva ut:
   - 🏆 Aktuell ranking
   - 🎯 Spelschema
   - 👥 Lag-lista
3. Klicka **"Skriv ut nu"**

## 🛠️ Teknisk stack

- **Frontend:** React 19.1
- **Styling:** Inline CSS med CSS-animationer
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **Data Storage:** localStorage (browser)
- **Build Tool:** Create React App

## 📁 Projektstruktur

```
boule-pro-tavlingar/
├── public/             # Statiska filer
├── src/
│   ├── App.js         # Huvudkomponent med all logik
│   ├── App.css        # Styling
│   ├── index.js       # Entry point
│   └── index.css      # Global styling
├── package.json       # Dependencies
└── README.md          # Denna fil
```

## 🎨 Features i detalj

### Swiss System
- Automatisk parning baserad på poäng och Buchholz
- Undviker omatcher (samma lag möts inte två gånger)
- 2-4 kvalronder innan slutspel

### Ranking-system
- **Poäng:** 2p för vinst, 1p för oavgjort, 0p för förlust
- **Buchholz:** Summan av motståndarnas poäng
- **Sortering:** Först efter poäng, sedan Buchholz

### Utskrifter
- Professionell layout med turneringsinfo
- Timestamp för transparens
- A4-format, perfekt för anslagstavla

## 📱 Browser-stöd

- ✅ Chrome/Edge (senaste versionen)
- ✅ Firefox (senaste versionen)
- ✅ Safari (senaste versionen)
- ⚠️ Kräver localStorage-stöd

## 🔧 Utveckling

### Tillgängliga kommandon

```bash
# Starta utvecklingsserver
npm start

# Kör tester
npm test

# Bygg för produktion
npm run build

# Analys av bundle size
npm run build --stats
```

### Kodstandard
- React Hooks för state management
- Functional components
- useCallback för optimering
- React.memo för tunga komponenter

## 📦 Deployment

### Bygg för produktion

```bash
npm run build
```

Detta skapar en optimerad build i `build/` mappen.

### Deploy till Netlify/Vercel

```bash
# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build

# Vercel
npm install -g vercel
vercel --prod
```

## 🐛 Felsökning

### Appen startar inte
```bash
# Rensa cache och reinstallera
rm -rf node_modules package-lock.json
npm install
npm start
```

### Data försvinner
- Kontrollera att localStorage inte är blockerat i webbläsaren
- Använd inte privat läge/inkognito (data sparas inte permanent)

### Print fungerar inte
- Aktivera "Bakgrundsgrafik" i utskriftsinställningar
- Kontrollera att popups inte är blockerade

## 🤝 Bidra

Bidrag är välkomna! Så här gör du:

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/AmazingFeature`)
3. Committa dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Pusha till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

## 📝 Licens

MIT License - se [LICENSE](LICENSE) för detaljer

## 👨‍💻 Utvecklare

Skapad av [Mats Hamberg](https://github.com/Mats6102hamberg)

## 📧 Kontakt

Frågor eller feedback? Skapa en [issue](https://github.com/Mats6102hamberg/boule-pro-tavlingar/issues) på GitHub.

---

**Uppdaterad:** 2025-10-24  
**Version:** 1.0.0  
**Status:** ✅ Produktionsklar
