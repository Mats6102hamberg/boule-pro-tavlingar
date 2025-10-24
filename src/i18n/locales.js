// 🌍 SHARED CORE SYSTEM - Multi-Market Localization
// Detta system gör att appen enkelt kan expandera till Frankrike och andra europeiska marknader

export const SUPPORTED_LANGUAGES = {
  sv: { name: 'Svenska', flag: '🇸🇪', region: 'SE' },
  en: { name: 'English', flag: '🇬🇧', region: 'GB' },
  fr: { name: 'Français', flag: '🇫🇷', region: 'FR' },
  de: { name: 'Deutsch', flag: '🇩🇪', region: 'DE' },
  es: { name: 'Español', flag: '🇪🇸', region: 'ES' },
  it: { name: 'Italiano', flag: '🇮🇹', region: 'IT' }
};

// 🎯 CORE TRANSLATIONS - Gemensamma för alla marknader
export const translations = {
  // 🇸🇪 SVENSKA
  sv: {
    // Navigation & Main
    dashboard: 'Dashboard',
    createTournament: 'Skapa Ny Tävling',
    tournamentName: 'Turneringsnamn',
    date: 'Datum',
    teamType: 'Lagtyp',
    single: 'Singel',
    double: 'Dubbel',
    triple: 'Trippel',
    ageCategory: 'Ålderskategori',
    open: 'Öppen',
    swissRounds: 'Swiss-ronder',
    teamsPerPool: 'Lag per pool',
    create: 'Skapa',
    cancel: 'Avbryt',
    
    // Teams
    addTeam: 'Lägg till lag',
    teamName: 'Lagnamn',
    players: 'Spelare',
    licenseNumber: 'Licensnummer',
    contactInfo: 'Kontaktinformation',
    
    // Matches
    startSwissRound: 'Starta Swiss-rond',
    startCupPhase: 'Starta Cup-spel',
    nextCupRound: 'Nästa Cup-rond',
    liveResultBoard: 'Live Resultat-tavla',
    exportTournament: 'Exportera Turnering',
    importTournament: 'Importera Turnering',
    
    // UI Elements
    ranking: 'Ranking',
    matches: 'Matcher',
    teams: 'Lag',
    statistics: 'Statistik',
    print: 'Skriv ut',
    court: 'Bana',
    startTime: 'Starttid',
    save: 'Spara',
    ongoing: 'Pågående',
    completed: 'Slutförda',
    wins: 'V',
    losses: 'F',
    points: 'Poäng',
    diploma: 'Diplom',
    matchProtocol: 'Matchprotokoll',
    deleteTournament: 'Ta bort',
    viewTournament: 'Visa',
    instructions: 'Instruktioner',
    tournaments: 'Turneringar',
    noTournaments: 'Inga turneringar',
    createFirst: 'Skapa din första turnering',
    back: 'Tillbaka'
  },
  
  // 🇬🇧 ENGLISH
  en: {
    // Navigation & Main
    dashboard: 'Dashboard',
    createTournament: 'Create New Tournament',
    tournamentName: 'Tournament Name',
    date: 'Date',
    teamType: 'Team Type',
    single: 'Single',
    double: 'Double',
    triple: 'Triple',
    ageCategory: 'Age Category',
    open: 'Open',
    swissRounds: 'Swiss Rounds',
    teamsPerPool: 'Teams per Pool',
    create: 'Create',
    cancel: 'Cancel',
    
    // Teams
    addTeam: 'Add Team',
    teamName: 'Team Name',
    players: 'Players',
    licenseNumber: 'License Number',
    contactInfo: 'Contact Info',
    
    // Matches
    startSwissRound: 'Start Swiss Round',
    startCupPhase: 'Start Cup Phase',
    nextCupRound: 'Next Cup Round',
    liveResultBoard: 'Live Result Board',
    exportTournament: 'Export Tournament',
    importTournament: 'Import Tournament',
    
    // UI Elements
    ranking: 'Ranking',
    matches: 'Matches',
    teams: 'Teams',
    statistics: 'Statistics',
    print: 'Print',
    court: 'Court',
    startTime: 'Start Time',
    save: 'Save',
    ongoing: 'Ongoing',
    completed: 'Completed',
    wins: 'W',
    losses: 'L',
    points: 'Points',
    diploma: 'Diploma',
    matchProtocol: 'Match Protocol',
    deleteTournament: 'Delete',
    viewTournament: 'View',
    instructions: 'Instructions',
    tournaments: 'Tournaments',
    noTournaments: 'No tournaments',
    createFirst: 'Create your first tournament',
    back: 'Back'
  },
  
  // 🇫🇷 FRANÇAIS (POUR LE MARCHÉ FRANÇAIS)
  fr: {
    // Navigation & Main
    dashboard: 'Tableau de bord',
    createTournament: 'Créer un Tournoi',
    tournamentName: 'Nom du Tournoi',
    date: 'Date',
    teamType: 'Type d\'Équipe',
    single: 'Simple',
    double: 'Double',
    triple: 'Triple',
    ageCategory: 'Catégorie d\'Âge',
    open: 'Ouvert',
    swissRounds: 'Rondes Suisses',
    teamsPerPool: 'Équipes par Poule',
    create: 'Créer',
    cancel: 'Annuler',
    
    // Teams
    addTeam: 'Ajouter une Équipe',
    teamName: 'Nom de l\'Équipe',
    players: 'Joueurs',
    licenseNumber: 'Numéro de Licence',
    contactInfo: 'Coordonnées',
    
    // Matches
    startSwissRound: 'Démarrer Ronde Suisse',
    startCupPhase: 'Démarrer Phase de Coupe',
    nextCupRound: 'Prochaine Ronde de Coupe',
    liveResultBoard: 'Tableau des Résultats en Direct',
    exportTournament: 'Exporter le Tournoi',
    importTournament: 'Importer le Tournoi',
    
    // UI Elements
    ranking: 'Classement',
    matches: 'Matchs',
    teams: 'Équipes',
    statistics: 'Statistiques',
    print: 'Imprimer',
    court: 'Terrain',
    startTime: 'Heure de Début',
    save: 'Enregistrer',
    ongoing: 'En Cours',
    completed: 'Terminés',
    wins: 'V',
    losses: 'D',
    points: 'Points',
    diploma: 'Diplôme',
    matchProtocol: 'Protocole de Match',
    deleteTournament: 'Supprimer',
    viewTournament: 'Voir',
    instructions: 'Instructions',
    tournaments: 'Tournois',
    noTournaments: 'Aucun tournoi',
    createFirst: 'Créez votre premier tournoi',
    back: 'Retour'
  },
  
  // 🇩🇪 DEUTSCH (FÜR DEN DEUTSCHEN MARKT)
  de: {
    // Navigation & Main
    dashboard: 'Dashboard',
    createTournament: 'Turnier Erstellen',
    tournamentName: 'Turniername',
    date: 'Datum',
    teamType: 'Teamtyp',
    single: 'Einzel',
    double: 'Doppel',
    triple: 'Dreier',
    ageCategory: 'Alterskategorie',
    open: 'Offen',
    swissRounds: 'Schweizer Runden',
    teamsPerPool: 'Teams pro Gruppe',
    create: 'Erstellen',
    cancel: 'Abbrechen',
    
    // Teams
    addTeam: 'Team Hinzufügen',
    teamName: 'Teamname',
    players: 'Spieler',
    licenseNumber: 'Lizenznummer',
    contactInfo: 'Kontaktinfo',
    
    // Matches
    startSwissRound: 'Schweizer Runde Starten',
    startCupPhase: 'Cup-Phase Starten',
    nextCupRound: 'Nächste Cup-Runde',
    liveResultBoard: 'Live-Ergebnistafel',
    exportTournament: 'Turnier Exportieren',
    importTournament: 'Turnier Importieren',
    
    // UI Elements
    ranking: 'Rangliste',
    matches: 'Spiele',
    teams: 'Teams',
    statistics: 'Statistik',
    print: 'Drucken',
    court: 'Bahn',
    startTime: 'Startzeit',
    save: 'Speichern',
    ongoing: 'Laufend',
    completed: 'Abgeschlossen',
    wins: 'S',
    losses: 'N',
    points: 'Punkte',
    diploma: 'Diplom',
    matchProtocol: 'Spielprotokoll',
    deleteTournament: 'Löschen',
    viewTournament: 'Ansehen',
    instructions: 'Anleitung',
    tournaments: 'Turniere',
    noTournaments: 'Keine Turniere',
    createFirst: 'Erstellen Sie Ihr erstes Turnier',
    back: 'Zurück'
  },
  
  // 🇪🇸 ESPAÑOL (PARA EL MERCADO ESPAÑOL)
  es: {
    // Navigation & Main
    dashboard: 'Panel',
    createTournament: 'Crear Torneo',
    tournamentName: 'Nombre del Torneo',
    date: 'Fecha',
    teamType: 'Tipo de Equipo',
    single: 'Individual',
    double: 'Dobles',
    triple: 'Triples',
    ageCategory: 'Categoría de Edad',
    open: 'Abierto',
    swissRounds: 'Rondas Suizas',
    teamsPerPool: 'Equipos por Grupo',
    create: 'Crear',
    cancel: 'Cancelar',
    
    // Teams
    addTeam: 'Añadir Equipo',
    teamName: 'Nombre del Equipo',
    players: 'Jugadores',
    licenseNumber: 'Número de Licencia',
    contactInfo: 'Información de Contacto',
    
    // Matches
    startSwissRound: 'Iniciar Ronda Suiza',
    startCupPhase: 'Iniciar Fase de Copa',
    nextCupRound: 'Siguiente Ronda de Copa',
    liveResultBoard: 'Marcador en Vivo',
    exportTournament: 'Exportar Torneo',
    importTournament: 'Importar Torneo',
    
    // UI Elements
    ranking: 'Clasificación',
    matches: 'Partidos',
    teams: 'Equipos',
    statistics: 'Estadísticas',
    print: 'Imprimir',
    court: 'Pista',
    startTime: 'Hora de Inicio',
    save: 'Guardar',
    ongoing: 'En Curso',
    completed: 'Completados',
    wins: 'G',
    losses: 'P',
    points: 'Puntos',
    diploma: 'Diploma',
    matchProtocol: 'Protocolo de Partido',
    deleteTournament: 'Eliminar',
    viewTournament: 'Ver',
    instructions: 'Instrucciones',
    tournaments: 'Torneos',
    noTournaments: 'No hay torneos',
    createFirst: 'Crea tu primer torneo',
    back: 'Atrás'
  },
  
  // 🇮🇹 ITALIANO (PER IL MERCATO ITALIANO)
  it: {
    // Navigation & Main
    dashboard: 'Pannello',
    createTournament: 'Crea Torneo',
    tournamentName: 'Nome del Torneo',
    date: 'Data',
    teamType: 'Tipo di Squadra',
    single: 'Singolo',
    double: 'Doppio',
    triple: 'Triplo',
    ageCategory: 'Categoria di Età',
    open: 'Aperto',
    swissRounds: 'Turni Svizzeri',
    teamsPerPool: 'Squadre per Girone',
    create: 'Crea',
    cancel: 'Annulla',
    
    // Teams
    addTeam: 'Aggiungi Squadra',
    teamName: 'Nome Squadra',
    players: 'Giocatori',
    licenseNumber: 'Numero di Licenza',
    contactInfo: 'Info Contatto',
    
    // Matches
    startSwissRound: 'Avvia Turno Svizzero',
    startCupPhase: 'Avvia Fase Coppa',
    nextCupRound: 'Prossimo Turno di Coppa',
    liveResultBoard: 'Tabellone Risultati Live',
    exportTournament: 'Esporta Torneo',
    importTournament: 'Importa Torneo',
    
    // UI Elements
    ranking: 'Classifica',
    matches: 'Partite',
    teams: 'Squadre',
    statistics: 'Statistiche',
    print: 'Stampa',
    court: 'Campo',
    startTime: 'Ora di Inizio',
    save: 'Salva',
    ongoing: 'In Corso',
    completed: 'Completate',
    wins: 'V',
    losses: 'S',
    points: 'Punti',
    diploma: 'Diploma',
    matchProtocol: 'Protocollo di Partita',
    deleteTournament: 'Elimina',
    viewTournament: 'Visualizza',
    instructions: 'Istruzioni',
    tournaments: 'Tornei',
    noTournaments: 'Nessun torneo',
    createFirst: 'Crea il tuo primo torneo',
    back: 'Indietro'
  }
};

// 🌍 MARKET-SPECIFIC CONFIGURATIONS
export const marketConfig = {
  SE: {
    currency: 'SEK',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    defaultLanguage: 'sv',
    sportTerminology: 'pétanque'
  },
  FR: {
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLanguage: 'fr',
    sportTerminology: 'pétanque'
  },
  DE: {
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    defaultLanguage: 'de',
    sportTerminology: 'boule'
  },
  ES: {
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLanguage: 'es',
    sportTerminology: 'petanca'
  },
  IT: {
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLanguage: 'it',
    sportTerminology: 'bocce'
  },
  GB: {
    currency: 'GBP',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    defaultLanguage: 'en',
    sportTerminology: 'boules'
  }
};

// 🎯 AUTO-DETECT USER LANGUAGE
export const detectUserLanguage = () => {
  // 1. Check localStorage
  const saved = localStorage.getItem('boule-pro-language');
  if (saved && SUPPORTED_LANGUAGES[saved]) {
    return saved;
  }
  
  // 2. Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang;
  }
  
  // 3. Default to Swedish
  return 'sv';
};

// 💾 SAVE USER LANGUAGE PREFERENCE
export const saveLanguagePreference = (lang) => {
  localStorage.setItem('boule-pro-language', lang);
};

export default translations;
