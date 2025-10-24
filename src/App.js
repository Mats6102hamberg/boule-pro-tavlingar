import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import QRCode from 'qrcode';

// 🌍 TRANSLATIONS - Multi-language support
const translations = {
  sv: {
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
    addTeam: 'Lägg till lag',
    teamName: 'Lagnamn',
    players: 'Spelare',
    licenseNumber: 'Licensnummer',
    contactInfo: 'Kontaktinformation',
    startSwissRound: 'Starta Swiss-rond',
    startCupPhase: 'Starta Cup-spel',
    nextCupRound: 'Nästa Cup-rond',
    liveResultBoard: 'Live Resultat-tavla',
    exportTournament: 'Exportera Turnering',
    importTournament: 'Importera Turnering',
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
  en: {
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
    addTeam: 'Add Team',
    teamName: 'Team Name',
    players: 'Players',
    licenseNumber: 'License Number',
    contactInfo: 'Contact Info',
    startSwissRound: 'Start Swiss Round',
    startCupPhase: 'Start Cup Phase',
    nextCupRound: 'Next Cup Round',
    liveResultBoard: 'Live Result Board',
    exportTournament: 'Export Tournament',
    importTournament: 'Import Tournament',
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
  }
};

// Add CSS animations with better browser support - RUN ONLY ONCE - Updated
if (!document.getElementById('boule-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'boule-styles';
  styleSheet.textContent = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px); 
        -webkit-transform: translateY(0px);
      }
      50% { 
        transform: translateY(-20px); 
        -webkit-transform: translateY(-20px);
      }
    }
    @keyframes bounce {
      0%, 100% { 
        transform: translateY(0); 
        -webkit-transform: translateY(0);
      }
      50% { 
        transform: translateY(-10px); 
        -webkit-transform: translateY(-10px);
      }
    }
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1); 
        -webkit-transform: scale(1);
      }
      50% { 
        transform: scale(1.1); 
        -webkit-transform: scale(1.1);
      }
    }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes slideIn {
      0% { 
        opacity: 0; 
        transform: translateY(-50px) scale(0.9); 
        -webkit-transform: translateY(-50px) scale(0.9);
      }
      100% { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
        -webkit-transform: translateY(0) scale(1);
      }
    }
    .gradient-bg {
      background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
      -webkit-animation: gradient 15s ease infinite;
    }
    * {
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(styleSheet);
}

// Isolerad Tournament Name Input för att förhindra re-render problem - FLYTTAD UTANFÖR App
const TournamentNameInput = React.memo(({ value, onChange, placeholder }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#3b82f6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    e.target.style.background = 'white';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      autoFocus
      style={{
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.3s ease',
        background: 'rgba(255, 255, 255, 0.9)'
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
});

// Modal Component - Stabil och enkel - FLYTTAD UTANFÖR App
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50,
        backdropFilter: 'blur(8px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '24px',
        maxWidth: '500px',
        width: '100%',
        padding: '32px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(45deg, #f1f5f9, #e2e8f0)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(45deg, #e2e8f0, #cbd5e1)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(45deg, #f1f5f9, #e2e8f0)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [tournaments, setTournaments] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isLiveView, setIsLiveView] = useState(false);
  const [language, setLanguage] = useState('sv'); // 🌍 Språk: sv eller en
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedTeamForQR, setSelectedTeamForQR] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [printOptions, setPrintOptions] = useState({
    type: 'ranking',
    includeLogo: true,
    includeTimestamp: true,
    format: 'detailed'
  });
  const [newTournamentName, setNewTournamentName] = useState('');
  const [tournamentSettings, setTournamentSettings] = useState({
    teamType: 'dubbel',
    ageCategory: 'öppen',
    swissRounds: 3,
    teamsPerPool: 3
  });
  const [newTeam, setNewTeam] = useState({
    name: '',
    players: ['', ''],
    licenseNumber: '',
    contactInfo: ''
  });

  // Ladda data från localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('boule-pro-tournaments');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTournaments(parsedData.tournaments || []);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Spara data till localStorage
  useEffect(() => {
    if (tournaments.length >= 0) {
      localStorage.setItem('boule-pro-tournaments', JSON.stringify({ tournaments }));
    }
  }, [tournaments]);

  const createTournament = useCallback(() => {
    if (newTournamentName.trim()) {
      const newTournament = {
        id: Date.now().toString(),
        name: newTournamentName.trim(),
        date: new Date().toLocaleDateString('sv-SE'),
        teams: [],
        matches: [],
        settings: { ...tournamentSettings },
        currentPhase: 'setup',
        currentRound: 0
      };
      setTournaments(prev => [...prev, newTournament]);
      setNewTournamentName('');
      setIsCreateModalOpen(false);
    }
  }, [newTournamentName, tournamentSettings]);

  const deleteTournament = useCallback((tournamentId) => {
    if (window.confirm('Är du säker på att du vill radera denna turnering?')) {
      setTournaments(prev => prev.filter(t => t.id !== tournamentId));
    }
  }, []);

  const openTournament = useCallback((tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setCurrentView('tournament');
  }, []);

  const goToDashboard = useCallback(() => {
    setCurrentView('dashboard');
    setSelectedTournamentId(null);
  }, []);

  const addTeam = useCallback(() => {
    if (newTeam.name.trim() && newTeam.players.some(p => p.trim())) {
      const tournament = tournaments.find(t => t.id === selectedTournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          teams: [...tournament.teams, {
            id: Date.now().toString(),
            name: newTeam.name.trim(),
            players: newTeam.players.filter(p => p.trim()),
            licenseNumber: newTeam.licenseNumber.trim(),
            contactInfo: newTeam.contactInfo.trim(),
            wins: 0,
            losses: 0,
            points: 0,
            buchholz: 0
          }]
        };
        
        setTournaments(prev => prev.map(t => 
          t.id === selectedTournamentId ? updatedTournament : t
        ));
        
        // Reset form
        setNewTeam({
          name: '',
          players: ['', ''],
          licenseNumber: '',
          contactInfo: ''
        });
        setIsAddTeamModalOpen(false);
      }
    }
  }, [newTeam, selectedTournamentId, tournaments]);

  const updateTeamPlayers = useCallback((teamType) => {
    const playerCount = teamType === 'singel' ? 1 : teamType === 'dubbel' ? 2 : 3;
    const newPlayers = Array(playerCount).fill('');
    setNewTeam(prev => ({ ...prev, players: newPlayers }));
  }, []);

  // ⚡ SWISS SYSTEM - Matchparning med Buchholz
  const calculateBuchholz = useCallback((team, matches) => {
    // Buchholz = summan av alla motståndarnas poäng
    const opponentIds = matches
      .filter(m => m.isCompleted && (m.team1Id === team.id || m.team2Id === team.id))
      .map(m => m.team1Id === team.id ? m.team2Id : m.team1Id);
    
    return opponentIds.reduce((sum, oppId) => {
      const opponent = tournaments.find(t => t.teams.find(tm => tm.id === oppId));
      if (opponent) {
        const oppTeam = opponent.teams.find(tm => tm.id === oppId);
        return sum + (oppTeam?.points || 0);
      }
      return sum;
    }, 0);
  }, [tournaments]);

  const generateSwissRoundPairings = useCallback((tournament) => {
    const teams = [...tournament.teams];
    
    // Sortera lag efter poäng (och Buchholz vid lika)
    teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const buchholzA = calculateBuchholz(a, tournament.matches);
      const buchholzB = calculateBuchholz(b, tournament.matches);
      return buchholzB - buchholzA;
    });

    const pairings = [];
    const paired = new Set();

    // Hitta tidigare motståndare för varje lag
    const previousOpponents = new Map();
    tournament.matches.forEach(match => {
      if (!previousOpponents.has(match.team1Id)) previousOpponents.set(match.team1Id, new Set());
      if (!previousOpponents.has(match.team2Id)) previousOpponents.set(match.team2Id, new Set());
      previousOpponents.get(match.team1Id).add(match.team2Id);
      previousOpponents.get(match.team2Id).add(match.team1Id);
    });

    // Para ihop lag från toppen (undvik omatcher)
    for (let i = 0; i < teams.length; i++) {
      if (paired.has(teams[i].id)) continue;
      
      for (let j = i + 1; j < teams.length; j++) {
        if (paired.has(teams[j].id)) continue;
        
        // Kolla om de mötts tidigare
        const hasPlayedBefore = previousOpponents.get(teams[i].id)?.has(teams[j].id);
        
        if (!hasPlayedBefore) {
          pairings.push({
            id: Date.now().toString() + Math.random(),
            team1Id: teams[i].id,
            team2Id: teams[j].id,
            team1Name: teams[i].name,
            team2Name: teams[j].name,
            team1Score: 0,
            team2Score: 0,
            round: tournament.currentRound + 1,
            phase: 'swiss',
            isCompleted: false,
            court: null
          });
          paired.add(teams[i].id);
          paired.add(teams[j].id);
          break;
        }
      }
    }

    return pairings;
  }, [calculateBuchholz]);

  const startSwissRound = useCallback(() => {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    if (tournament.teams.length < 4) {
      alert('Du behöver minst 4 lag för att starta Swiss-ronder!');
      return;
    }

    const newPairings = generateSwissRoundPairings(tournament);
    
    const updatedTournament = {
      ...tournament,
      currentPhase: 'swiss',
      currentRound: tournament.currentRound + 1,
      matches: [...tournament.matches, ...newPairings]
    };

    setTournaments(prev => prev.map(t => 
      t.id === selectedTournamentId ? updatedTournament : t
    ));
  }, [selectedTournamentId, tournaments, generateSwissRoundPairings]);

  // 🎯 MATCHHANTERING - Registrera resultat
  const updateMatchResult = useCallback((matchId, team1Score, team2Score) => {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    const match = tournament.matches.find(m => m.id === matchId);
    if (!match) return;

    // Uppdatera match med resultat
    const updatedMatches = tournament.matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          team1Score: parseInt(team1Score) || 0,
          team2Score: parseInt(team2Score) || 0,
          isCompleted: true
        };
      }
      return m;
    });

    // Beräkna nya poäng för lagen
    const updatedTeams = tournament.teams.map(team => {
      if (team.id === match.team1Id || team.id === match.team2Id) {
        // Räkna alla matcher för detta lag
        let wins = 0, losses = 0, draws = 0, points = 0;
        
        updatedMatches.forEach(m => {
          if (!m.isCompleted) return;
          
          if (m.team1Id === team.id) {
            if (m.team1Score > m.team2Score) { wins++; points += 2; }
            else if (m.team1Score < m.team2Score) losses++;
            else { draws++; points += 1; }
          } else if (m.team2Id === team.id) {
            if (m.team2Score > m.team1Score) { wins++; points += 2; }
            else if (m.team2Score < m.team1Score) losses++;
            else { draws++; points += 1; }
          }
        });

        return {
          ...team,
          wins,
          losses,
          draws,
          points,
          buchholz: calculateBuchholz(team, updatedMatches)
        };
      }
      return team;
    });

    const updatedTournament = {
      ...tournament,
      matches: updatedMatches,
      teams: updatedTeams
    };

    setTournaments(prev => prev.map(t => 
      t.id === selectedTournamentId ? updatedTournament : t
    ));
  }, [selectedTournamentId, tournaments, calculateBuchholz]);

  // 🏆 CUP SYSTEM - Generera bracket
  const startCupPhase = useCallback(() => {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    // Sortera lag efter poäng och Buchholz
    const sortedTeams = [...tournament.teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.buchholz - a.buchholz;
    });

    // Ta top 8 till cup
    const cupTeams = sortedTeams.slice(0, Math.min(8, sortedTeams.length));
    
    if (cupTeams.length < 4) {
      alert('Du behöver minst 4 lag för cup-spel! Kör fler Swiss-ronder.');
      return;
    }

    // Skapa kvartsfinal-matcher (1 vs 8, 2 vs 7, 3 vs 6, 4 vs 5)
    const quarterFinals = [];
    const pairs = [
      [0, 7], [1, 6], [2, 5], [3, 4]
    ];

    pairs.forEach(([i1, i2], index) => {
      if (cupTeams[i1] && cupTeams[i2]) {
        quarterFinals.push({
          id: Date.now().toString() + Math.random(),
          team1Id: cupTeams[i1].id,
          team2Id: cupTeams[i2].id,
          team1Name: cupTeams[i1].name,
          team2Name: cupTeams[i2].name,
          team1Score: 0,
          team2Score: 0,
          round: 'qf',
          phase: 'cup',
          matchNumber: index + 1,
          isCompleted: false,
          court: null
        });
      }
    });

    const updatedTournament = {
      ...tournament,
      currentPhase: 'cup',
      matches: [...tournament.matches, ...quarterFinals]
    };

    setTournaments(prev => prev.map(t => 
      t.id === selectedTournamentId ? updatedTournament : t
    ));
  }, [selectedTournamentId, tournaments]);

  const advanceCupRound = useCallback(() => {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    const currentCupMatches = tournament.matches.filter(m => m.phase === 'cup' && !m.isCompleted);
    
    if (currentCupMatches.length > 0) {
      alert('Alla matcher i nuvarande rond måste vara klara först!');
      return;
    }

    const completedCupMatches = tournament.matches.filter(m => m.phase === 'cup' && m.isCompleted);
    const lastRound = completedCupMatches[completedCupMatches.length - 1]?.round || 'qf';

    let nextMatches = [];

    if (lastRound === 'qf') {
      // Skapa semifinaler
      const qfMatches = completedCupMatches.filter(m => m.round === 'qf');
      
      for (let i = 0; i < qfMatches.length; i += 2) {
        const winner1 = qfMatches[i].team1Score > qfMatches[i].team2Score ? 
          { id: qfMatches[i].team1Id, name: qfMatches[i].team1Name } : 
          { id: qfMatches[i].team2Id, name: qfMatches[i].team2Name };
        
        const winner2 = qfMatches[i + 1].team1Score > qfMatches[i + 1].team2Score ? 
          { id: qfMatches[i + 1].team1Id, name: qfMatches[i + 1].team1Name } : 
          { id: qfMatches[i + 1].team2Id, name: qfMatches[i + 1].team2Name };

        nextMatches.push({
          id: Date.now().toString() + Math.random(),
          team1Id: winner1.id,
          team2Id: winner2.id,
          team1Name: winner1.name,
          team2Name: winner2.name,
          team1Score: 0,
          team2Score: 0,
          round: 'sf',
          phase: 'cup',
          matchNumber: Math.floor(i / 2) + 1,
          isCompleted: false,
          court: null
        });
      }
    } else if (lastRound === 'sf') {
      // Skapa final och bronsmatch
      const sfMatches = completedCupMatches.filter(m => m.round === 'sf');
      
      // Final
      const finalist1 = sfMatches[0].team1Score > sfMatches[0].team2Score ? 
        { id: sfMatches[0].team1Id, name: sfMatches[0].team1Name } : 
        { id: sfMatches[0].team2Id, name: sfMatches[0].team2Name };
      
      const finalist2 = sfMatches[1].team1Score > sfMatches[1].team2Score ? 
        { id: sfMatches[1].team1Id, name: sfMatches[1].team1Name } : 
        { id: sfMatches[1].team2Id, name: sfMatches[1].team2Name };

      nextMatches.push({
        id: Date.now().toString() + Math.random(),
        team1Id: finalist1.id,
        team2Id: finalist2.id,
        team1Name: finalist1.name,
        team2Name: finalist2.name,
        team1Score: 0,
        team2Score: 0,
        round: 'final',
        phase: 'cup',
        matchNumber: 1,
        isCompleted: false,
        court: null
      });

      // Bronsmatch
      const bronze1 = sfMatches[0].team1Score > sfMatches[0].team2Score ? 
        { id: sfMatches[0].team2Id, name: sfMatches[0].team2Name } : 
        { id: sfMatches[0].team1Id, name: sfMatches[0].team1Name };
      
      const bronze2 = sfMatches[1].team1Score > sfMatches[1].team2Score ? 
        { id: sfMatches[1].team2Id, name: sfMatches[1].team2Name } : 
        { id: sfMatches[1].team1Id, name: sfMatches[1].team1Name };

      nextMatches.push({
        id: Date.now().toString() + Math.random(),
        team1Id: bronze1.id,
        team2Id: bronze2.id,
        team1Name: bronze1.name,
        team2Name: bronze2.name,
        team1Score: 0,
        team2Score: 0,
        round: 'bronze',
        phase: 'cup',
        matchNumber: 2,
        isCompleted: false,
        court: null
      });
    }

    if (nextMatches.length > 0) {
      const updatedTournament = {
        ...tournament,
        matches: [...tournament.matches, ...nextMatches]
      };

      setTournaments(prev => prev.map(t => 
        t.id === selectedTournamentId ? updatedTournament : t
      ));
    }
  }, [selectedTournamentId, tournaments]);

  // 💾 EXPORT/IMPORT - Backup & Restore
  const exportTournament = useCallback(() => {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    const dataStr = JSON.stringify(tournament, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tournament.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [selectedTournamentId, tournaments]);

  const exportAllTournaments = useCallback(() => {
    const dataStr = JSON.stringify(tournaments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Alla_Turneringar_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [tournaments]);

  const importTournament = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        
        // Kolla om det är en array (alla turneringar) eller ett objekt (en turnering)
        if (Array.isArray(imported)) {
          // Importera alla turneringar
          setTournaments(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newTournaments = imported.filter(t => !existingIds.has(t.id));
            return [...prev, ...newTournaments];
          });
          alert(`Importerade ${imported.length} turneringar!`);
        } else {
          // Importera en turnering
          setTournaments(prev => {
            const exists = prev.some(t => t.id === imported.id);
            if (exists) {
              return prev.map(t => t.id === imported.id ? imported : t);
            }
            return [...prev, imported];
          });
          alert(`Turnering "${imported.name}" importerad!`);
        }
      } catch (error) {
        alert('Fel vid import: Ogiltig fil-format!');
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }, []);

  // 🏟️ BANHANTERING - Tilldela matcher till banor
  const assignCourt = useCallback((matchId, courtNumber) => {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    const updatedMatches = tournament.matches.map(m => 
      m.id === matchId ? { ...m, court: courtNumber } : m
    );

    const updatedTournament = {
      ...tournament,
      matches: updatedMatches
    };

    setTournaments(prev => prev.map(t => 
      t.id === selectedTournamentId ? updatedTournament : t
    ));
  }, [selectedTournamentId, tournaments]);

  // ⏱️ TIDTABELL - Schemaläggning
  const setMatchStartTime = useCallback((matchId, startTime) => {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    const updatedMatches = tournament.matches.map(m => 
      m.id === matchId ? { ...m, startTime: startTime } : m
    );

    const updatedTournament = {
      ...tournament,
      matches: updatedMatches
    };

    setTournaments(prev => prev.map(t => 
      t.id === selectedTournamentId ? updatedTournament : t
    ));
  }, [selectedTournamentId, tournaments]);

  // 📸 QR-KOD - Generera QR för laginformation
  const generateQRCode = useCallback(async (team, tournament) => {
    const teamInfo = {
      lag: team.name,
      spelare: team.players.join(', '),
      turnering: tournament.name,
      datum: tournament.date,
      licens: team.licenseNumber || 'Ingen',
      kontakt: team.contactInfo || 'Ingen'
    };
    
    const dataString = JSON.stringify(teamInfo, null, 2);
    
    try {
      const qrDataURL = await QRCode.toDataURL(dataString, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0ea5e9',
          light: '#ffffff'
        }
      });
      setQrCodeDataURL(qrDataURL);
      setSelectedTeamForQR(team);
      setQrModalOpen(true);
    } catch (error) {
      console.error('QR-kod fel:', error);
    }
  }, []);

  // 🌍 MULTI-LANGUAGE - Toggle mellan svenska och engelska
  const t = translations[language];
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sv' ? 'en' : 'sv');
  };

  // Förbättrade Print-funktioner med spelare, ranking och licensnummer
  const generatePrintContent = useCallback((tournament, type) => {
    const timestamp = new Date().toLocaleString('sv-SE');
    
    // 🏆 DIPLOM - För topp 3
    if (type === 'diploma') {
      const sortedTeams = [...tournament.teams].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return (b.buchholz || 0) - (a.buchholz || 0);
      });
      
      const winner = sortedTeams[0];
      if (!winner) return '';

      return `
        <html>
          <head>
            <style>
              @page { margin: 0; }
              body {
                margin: 0;
                padding: 40px;
                font-family: 'Georgia', serif;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .diploma {
                background: white;
                padding: 60px;
                border: 20px double #f59e0b;
                max-width: 800px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.2);
              }
              .diploma h1 {
                font-size: 48px;
                color: #92400e;
                margin: 20px 0;
                text-transform: uppercase;
                letter-spacing: 4px;
              }
              .trophy { font-size: 120px; margin: 20px 0; }
              .place { font-size: 36px; color: #f59e0b; margin: 20px 0; font-weight: bold; }
              .team { font-size: 32px; color: #1e293b; margin: 20px 0; font-weight: bold; }
              .players { font-size: 20px; color: #64748b; margin: 10px 0; }
              .tournament { font-size: 24px; color: #475569; margin: 30px 0; }
              .signature { margin-top: 60px; font-size: 18px; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="diploma">
              <div class="trophy">🏆</div>
              <h1>Diplom</h1>
              <div class="place">1:a Plats</div>
              <div class="team">${winner.name}</div>
              <div class="players">${winner.players.join(' & ')}</div>
              <div class="tournament">${tournament.name}</div>
              <div class="tournament">${tournament.date}</div>
              <div class="signature">
                <p>___________________________</p>
                <p>Tävlingsarrangör</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }
    
    // 📋 MATCHPROTOKOLL - Detaljerat
    if (type === 'matchprotocol') {
      return `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .protocol { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 30px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
              .match-info { margin: 20px 0; }
              .match-info div { margin: 10px 0; font-size: 16px; }
              .label { font-weight: bold; display: inline-block; width: 150px; }
              .teams { margin: 30px 0; }
              .team { border: 1px solid #000; padding: 15px; margin: 10px 0; }
              .score-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .score-table th, .score-table td { border: 1px solid #000; padding: 10px; text-align: center; }
              .signature-section { margin-top: 60px; display: flex; justify-content: space-around; }
              .signature-box { text-align: center; }
              .signature-line { width: 200px; border-bottom: 1px solid #000; margin: 40px auto 10px; }
            </style>
          </head>
          <body>
            <div class="protocol">
              <div class="header">
                <h1>🎯 MATCHPROTOKOLL</h1>
                <h2>${tournament.name}</h2>
              </div>
              
              <div class="match-info">
                <div><span class="label">Datum:</span> ${tournament.date}</div>
                <div><span class="label">Tävlingstyp:</span> ${tournament.settings.teamType.toUpperCase()}</div>
                <div><span class="label">Kategori:</span> ${tournament.settings.ageCategory}</div>
                <div><span class="label">Matchnummer:</span> _______</div>
                <div><span class="label">Bana:</span> _______</div>
                <div><span class="label">Starttid:</span> _______</div>
              </div>

              <div class="teams">
                <div class="team">
                  <h3>Lag 1: _________________________</h3>
                  <p>Spelare: _________________________</p>
                </div>
                <div class="team">
                  <h3>Lag 2: _________________________</h3>
                  <p>Spelare: _________________________</p>
                </div>
              </div>

              <table class="score-table">
                <thead>
                  <tr>
                    <th>Måne</th>
                    <th>Lag 1</th>
                    <th>Lag 2</th>
                  </tr>
                </thead>
                <tbody>
                  ${Array.from({length: 15}, (_, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  `).join('')}
                  <tr style="font-weight: bold; background: #f3f4f6;">
                    <td>TOTALT</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <div class="signature-section">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p>Domare</p>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p>Lag 1</p>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p>Lag 2</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
    }
    
    const baseStyles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f4f4f4; }
        .footer { margin-top: 20px; font-size: 0.9em; color: #666; }
      </style>
    `;

    const tournamentInfo = `
      <h1>${tournament.name}</h1>
      <p>Datum: ${tournament.date}</p>
      <p>Typ: ${tournament.settings.teamType}</p>
      <p>Ålderskategori: ${tournament.settings.ageCategory}</p>
    `;

    const playerRows = tournament.teams.map(team => `
      <tr>
        <td>${team.name}</td>
        <td>${team.players.join(', ')}</td>
        <td>${team.licenseNumber || ''}</td>
        <td>${team.rank || ''}</td>
      </tr>
    `).join('');

    const playerTable = `
      <h2>Spelare</h2>
      <table>
        <tr>
          <th>Lag</th>
          <th>Spelare</th>
          <th>Licensnummer</th>
          <th>Ranking</th>
        </tr>
        ${playerRows}
      </table>
    `;

    const content = `
      ${baseStyles}
      <div class="container">
        ${tournamentInfo}
        ${type === 'detailed' ? playerTable : ''}
        <div class="footer">
          <p>Utskrivet: ${timestamp}</p>
        </div>
      </div>
    `;

    return content;
  }, []);

  const handlePrint = useCallback((tournament) => {
    const content = generatePrintContent(tournament, printOptions.format);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }, [generatePrintContent, printOptions.format]);

  // Button Component - Enkel och stabil
  const Button = ({ children, onClick, variant = 'primary', disabled, style = {}, type = 'button' }) => {
    const variants = {
      primary: { 
        background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
      },
      secondary: { 
        background: 'linear-gradient(45deg, #e2e8f0, #cbd5e1)',
        color: '#1e293b',
        boxShadow: '0 4px 15px rgba(148, 163, 184, 0.3)'
      },
      danger: { 
        background: 'linear-gradient(45deg, #ef4444, #dc2626)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
      },
      success: { 
        background: 'linear-gradient(45deg, #10b981, #059669)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
      }
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          fontWeight: '600',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          fontSize: '14px',
          transition: 'all 0.3s ease',
          transform: 'translateY(0)',
          ...variants[variant],
          ...style
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.filter = 'brightness(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.filter = 'brightness(1)';
          }
        }}
      >
        {children}
      </button>
    );
  };

  // Select Component - Enkel och stabil
  const Select = ({ value, onChange, options, style = {} }) => {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          fontSize: '16px',
          outline: 'none',
          backgroundColor: 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e2e8f0';
          e.target.style.boxShadow = 'none';
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  // Stabil onChange handler för tournament name
  const handleTournamentNameChange = useCallback((newValue) => {
    setNewTournamentName(newValue);
  }, []);

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%)',
        padding: '0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative'
      }}>
        {/* 🌍 Språkväxlingsknapp - Fixed top right */}
        <button
          onClick={toggleLanguage}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            padding: '12px 24px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            zIndex: 9999,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          🌍 {language === 'sv' ? 'English' : 'Svenska'}
        </button>

        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)',
          color: 'white',
          padding: '80px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Animated Background Circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{
              fontSize: '72px',
              marginBottom: '20px',
              animation: 'bounce 2s ease-in-out infinite'
            }}>
              🏆
            </div>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              margin: '0 0 16px 0',
              background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}>
              Boule Pro Tävlingar
            </h1>
            <p style={{
              fontSize: '24px',
              margin: '0 0 40px 0',
              opacity: 0.9,
              fontWeight: '300'
            }}>
              Swiss System • Monrad • Pool-spel med professionell utskrift
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '60px'
            }}>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
                }}
              >
                🚀 {t.createTournament}
              </button>
              
              <button
                onClick={() => {
                  const featuresSection = document.getElementById('features-section');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                📖 Instruktioner
              </button>
            </div>

            {/* Feature Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: '600' }}>Swiss System</h3>
                <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>Automatisk parning för rättvisa matcher</p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: '600' }}>Professionell</h3>
                <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>Utskrifter för anslagstavla</p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>💾</div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: '600' }}>Automatisk</h3>
                <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>Sparar data automatiskt</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 FEATURES SEKTION - Klickbara funktioner */}
        <div id="features-section" style={{
          maxWidth: '1400px',
          margin: '-60px auto 60px auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              🎯 Alla Funktioner
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '48px'
            }}>
              {[
                { icon: '⚡', title: 'Swiss System', desc: 'Automatisk intelligent matchparning', id: 'swiss' },
                { icon: '🎯', title: 'Matchhantering', desc: 'Live resultatregistrering 0-13', id: 'match' },
                { icon: '🏆', title: 'Cup/Slutspel', desc: 'Kvartsfinal, Semi, Final', id: 'cup' },
                { icon: '🌐', title: 'Live Resultat-tavla', desc: 'Fullskärm för projektor', id: 'live' },
                { icon: '📊', title: 'Avancerad Statistik', desc: 'Ranking + Buchholz', id: 'stats' },
                { icon: '💾', title: 'Export/Import', desc: 'Backup & restore', id: 'backup' },
                { icon: '🏟️', title: 'Banhantering', desc: 'Tilldela matcher till banor', id: 'court' },
                { icon: '⏱️', title: 'Tidtabell', desc: 'Schema med starttider', id: 'schedule' },
                { icon: '🖨️', title: 'Utskrifter', desc: 'Diplom & Matchprotokoll', id: 'print' },
                { icon: '📱', title: 'PWA', desc: 'Installera som app', id: 'pwa' },
                { icon: '📸', title: 'QR-koder', desc: 'Generera för laginformation', id: 'qr' },
                { icon: '🌍', title: 'Multi-language', desc: 'Svenska/Engelska', id: 'language' }
              ].map((feature, index) => (
                <a
                  key={index}
                  href={`#feature-${feature.id}`}
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#1e293b' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{feature.desc}</p>
                </a>
              ))}
            </div>

            {/* INSTRUKTIONER FÖR VARJE FUNKTION */}
            <div style={{
              borderTop: '2px solid #e2e8f0',
              paddingTop: '48px'
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                📖 Instruktioner
              </h3>

              {/* Swiss System */}
              <div id="feature-swiss" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  ⚡ Swiss System
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Swiss System parar automatiskt lag baserat på deras ranking. Bästa lagen möter varandra för rättvis tävling.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li>Klicka "Starta Swiss-rond" för att generera matcher</li>
                  <li>Registrera resultat 0-13 för varje match</li>
                  <li>Ranking uppdateras automatiskt med Buchholz-beräkning</li>
                  <li>Starta nästa rond när alla matcher är klara</li>
                </ul>
              </div>

              {/* Matchhantering */}
              <div id="feature-match" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  🎯 Matchhantering
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Registrera resultat live och se statistik uppdateras i realtid.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li>Skriv in poäng för varje lag (0-13)</li>
                  <li>Tilldela bana och starttid vid behov</li>
                  <li>Klicka "Spara Resultat" när matchen är klar</li>
                  <li>Ranking uppdateras automatiskt</li>
                </ul>
              </div>

              {/* Cup/Slutspel */}
              <div id="feature-cup" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  🏆 Cup/Slutspel
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Efter Swiss-ronderna startar Cup-spel med Top 8 lag.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li>Klicka "Starta Cup-spel" när Swiss-fas är klar</li>
                  <li>Kvartsfinal: 1 vs 8, 2 vs 7, 3 vs 6, 4 vs 5</li>
                  <li>Semifinal: Vinnare möts</li>
                  <li>Final + Bronsmatch för 3:e plats</li>
                </ul>
              </div>

              {/* Live Resultat-tavla */}
              <div id="feature-live" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  🌐 Live Resultat-tavla
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Visa live-resultat på storskärm eller projektor för publiken.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li>Klicka "Live Resultat-tavla" i turneringen</li>
                  <li>Fullskärmsläge (F11) för bästa vy</li>
                  <li>Uppdateras automatiskt när resultat registreras</li>
                  <li>Perfekt för anslagstavla eller projektor</li>
                </ul>
              </div>

              {/* Export/Import */}
              <div id="feature-backup" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  💾 Export/Import (Backup)
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Säkerhetskopiera turneringar till JSON-fil och återställ vid behov.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li>Klicka "💾 Exportera Turnering" för att spara</li>
                  <li>Klicka "📂 Importera Turnering" för att återställa</li>
                  <li>Välj JSON-fil från din dator</li>
                  <li>All data återställs exakt som den var</li>
                </ul>
              </div>

              {/* QR-koder */}
              <div id="feature-qr" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  📸 QR-koder
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Generera QR-koder med komplett laginformation.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li>Klicka 📸-ikonen på ett lag</li>
                  <li>QR-kod genereras med alla uppgifter</li>
                  <li>Ladda ner som PNG-bild</li>
                  <li>Skanna med mobil för snabb åtkomst</li>
                </ul>
              </div>

              {/* PWA */}
              <div id="feature-pwa" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  📱 PWA - Installera som App
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Installera Boule PRO som en native app på mobil eller desktop.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li><strong>Chrome/Edge:</strong> Klicka installera-ikonen i adressfältet</li>
                  <li><strong>Safari (iOS):</strong> Dela → "Lägg till på hemskärmen"</li>
                  <li><strong>Android:</strong> Chrome-meny → "Installera appen"</li>
                  <li>Fungerar offline och som native app!</li>
                </ul>
              </div>

              {/* Multi-language */}
              <div id="feature-language" style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1e40af', marginBottom: '16px' }}>
                  🌍 Multi-language
                </h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '12px' }}>
                  Växla mellan svenska och engelska.
                </p>
                <ul style={{ color: '#64748b', lineHeight: '1.8' }}>
                  <li>Klicka "🌍 English" uppe till höger</li>
                  <li>Alla viktiga texter översätts</li>
                  <li>Klicka igen för att byta tillbaka till Svenska</li>
                  <li>Fler språk kommer snart (Franska, Tyska, m.fl.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 32px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ 
                fontSize: '42px', 
                fontWeight: '700', 
                background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px',
                cursor: 'pointer'
              }}
              onClick={() => alert('Här skulle en söksida för tidigare tävlingar öppnas där man kan:\n\n🔍 Söka efter specifika turneringar\n📅 Filtrera på datum\n🏆 Filtrera på kategori (V55, V65, etc.)\n📍 Söka på plats\n👥 Hitta lag eller spelare\n📊 Se historisk statistik\n\nI en riktig implementation skulle detta navigera till en dedikerad söksida!')}
              >
                🔍 Tidigare Tävlingar
              </h2>
              <p style={{ 
                color: '#64748b', 
                margin: 0,
                fontSize: '20px',
                fontWeight: '400'
              }}>
                Hantera professionella boule-turneringar med avancerade funktioner
              </p>
            </div>
            
            {tournaments.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 40px',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '20px',
                border: '2px dashed #38bdf8',
                margin: '40px 0'
              }}>
                <div style={{ 
                  fontSize: '80px', 
                  marginBottom: '24px',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  🏆
                </div>
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#0c4a6e',
                  marginBottom: '16px'
                }}>
                  {language === 'sv' ? 'Välkommen till Boule Pro!' : 'Welcome to Boule Pro!'}
                </h3>
                <p style={{ 
                  color: '#0369a1', 
                  marginBottom: '32px',
                  fontSize: '18px',
                  maxWidth: '400px',
                  margin: '0 auto 32px auto',
                  lineHeight: '1.6'
                }}>
                  {language === 'sv' ? 'Skapa din första professionella turnering med avancerade utskriftsmöjligheter och automatisk Swiss System-parning.' : 'Create your first professional tournament with advanced printing and automatic Swiss System pairing.'}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{
                    background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '50px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(14, 165, 233, 0.4)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(14, 165, 233, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(14, 165, 233, 0.4)';
                  }}
                >
                  ✨ {language === 'sv' ? 'Skapa Din Första Tävling' : 'Create Your First Tournament'}
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '32px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                margin: '40px 0'
              }}>
                {tournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    onClick={() => openTournament(tournament.id)}
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(0)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-8px)';
                      e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                      e.target.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b)'
                    }}></div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '22px',
                          fontWeight: '700',
                          color: '#1e293b',
                          marginBottom: '8px',
                          background: 'linear-gradient(45deg, #1e293b, #3b82f6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {tournament.name}
                        </h3>
                        <p style={{
                          fontSize: '16px',
                          color: '#64748b',
                          marginBottom: '16px',
                          fontWeight: '500'
                        }}>
                          📅 {tournament.date}
                        </p>
                        
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          marginBottom: '16px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            background: 'linear-gradient(45deg, #d1fae5, #a7f3d0)',
                            color: '#065f46',
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            border: '1px solid #bbf7d0'
                          }}>
                            {tournament.settings.teamType.toUpperCase()}
                          </span>
                          <span style={{
                            background: 'linear-gradient(45deg, #dbeafe, #bfdbfe)',
                            color: '#1e40af',
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            border: '1px solid #93c5fd'
                          }}>
                            {tournament.settings.ageCategory}
                          </span>
                          <span style={{
                            background: tournament.currentPhase === 'setup' ? 'linear-gradient(45deg, #f3f4f6, #e5e7eb)' :
                                       tournament.currentPhase === 'swiss' ? 'linear-gradient(45deg, #fef3c7, #fde68a)' :
                                       tournament.currentPhase === 'cup' ? 'linear-gradient(45deg, #fed7aa, #fdba74)' : 'linear-gradient(45deg, #dcfce7, #bbf7d0)',
                            color: tournament.currentPhase === 'setup' ? '#374151' :
                                   tournament.currentPhase === 'swiss' ? '#92400e' :
                                   tournament.currentPhase === 'cup' ? '#9a3412' : '#166534',
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontWeight: '600'
                          }}>
                            {tournament.currentPhase === 'setup' ? '⚙️ Förberedelse' :
                             tournament.currentPhase === 'swiss' ? `⚡ Swiss Rond ${tournament.currentRound}` :
                             tournament.currentPhase === 'cup' ? '🏆 Cup-spel' : '✅ Avslutad'}
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          gap: '20px',
                          fontSize: '16px',
                          color: '#475569',
                          fontWeight: '500'
                        }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            👥 {tournament.teams.length} lag
                          </span>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            � {tournament.matches.filter(m => m.isCompleted).length}/{tournament.matches.length}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTournament(tournament.id);
                        }}
                        style={{
                          background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Team Modal */}
        <Modal
          isOpen={isAddTeamModalOpen}
          onClose={() => {
            setIsAddTeamModalOpen(false);
          }}
          title="Lägg till nytt lag"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Lagnamn *
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                placeholder="T.ex. Boule Stjärnorna"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Spelare *
              </label>
              {newTeam.players.map((player, index) => (
                <input
                  key={index}
                  type="text"
                  value={player}
                  onChange={(e) => {
                    const updatedPlayers = [...newTeam.players];
                    updatedPlayers[index] = e.target.value;
                    setNewTeam({...newTeam, players: updatedPlayers});
                  }}
                  placeholder={`Spelare ${index + 1}`}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    marginBottom: index < newTeam.players.length - 1 ? '8px' : '0'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Licensnummer (valfritt)
              </label>
              <input
                type="text"
                value={newTeam.licenseNumber}
                onChange={(e) => setNewTeam({...newTeam, licenseNumber: e.target.value})}
                placeholder="T.ex. 12345"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Kontaktinfo (valfritt)
              </label>
              <input
                type="text"
                value={newTeam.contactInfo}
                onChange={(e) => setNewTeam({...newTeam, contactInfo: e.target.value})}
                placeholder="T.ex. telefon eller e-post"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              paddingTop: '16px'
            }}>
              <Button 
                onClick={addTeam}
                style={{ flex: 1 }}
                disabled={!newTeam.name.trim() || !newTeam.players.some(p => p.trim())}
              >
                Lägg till lag
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsAddTeamModalOpen(false);
                  setNewTeam({
                    name: '',
                    players: ['', ''],
                    licenseNumber: '',
                    contactInfo: ''
                  });
                }}
                style={{ flex: 1 }}
              >
                Avbryt
              </Button>
            </div>
          </div>
        </Modal>

        {/* Create Tournament Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Skapa ny tävling"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Tävlingsnamn
              </label>
              <TournamentNameInput
                value={newTournamentName}
                onChange={handleTournamentNameChange}
                placeholder="T.ex. Sommar-cupen 2024"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Lagtyp
              </label>
              <Select
                value={tournamentSettings.teamType}
                onChange={(value) => setTournamentSettings({...tournamentSettings, teamType: value})}
                options={[
                  { value: 'singel', label: 'Singel (1 spelare)' },
                  { value: 'dubbel', label: 'Dubbel (2 spelare)' },
                  { value: 'trippel', label: 'Trippel (3 spelare)' }
                ]}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Ålderskategori
              </label>
              <Select
                value={tournamentSettings.ageCategory}
                onChange={(value) => setTournamentSettings({...tournamentSettings, ageCategory: value})}
                options={[
                  { value: 'öppen', label: 'Öppen (alla åldrar)' },
                  { value: 'V55', label: 'Veteran 55+ (V55)' },
                  { value: 'V65', label: 'Veteran 65+ (V65)' },
                  { value: 'V75', label: 'Veteran 75+ (V75)' }
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Swiss-ronder
                </label>
                <Select
                  value={tournamentSettings.swissRounds}
                  onChange={(value) => setTournamentSettings({...tournamentSettings, swissRounds: parseInt(value)})}
                  options={[
                    { value: '2', label: '2 ronder' },
                    { value: '3', label: '3 ronder' },
                    { value: '4', label: '4 ronder' }
                  ]}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Lag per pool
                </label>
                <Select
                  value={tournamentSettings.teamsPerPool}
                  onChange={(value) => setTournamentSettings({...tournamentSettings, teamsPerPool: parseInt(value)})}
                  options={[
                    { value: '3', label: '3 lag' },
                    { value: '4', label: '4 lag' }
                  ]}
                />
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              paddingTop: '16px'
            }}>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  createTournament();
                }}
                style={{ flex: 1 }}
              >
                Skapa tävling
              </Button>
              <Button 
                variant="secondary" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCreateModalOpen(false);
                }}
                style={{ flex: 1 }}
              >
                Avbryt
              </Button>
            </div>
          </div>
        </Modal>

        {/* Instructions Modal */}
        <Modal
          isOpen={isInstructionsModalOpen}
          onClose={() => setIsInstructionsModalOpen(false)}
          title="📖 Instruktioner för Boule Pro Tävlingar"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#0d9488', marginBottom: '12px', fontSize: '16px' }}>🏆 Välkommen till Boule Pro!</h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#64748b' }}>
                Detta system hjälper dig att organisera professionella bouletävlingar med Swiss System och Cup-spel.
              </p>
            </div>

            <div>
              <h3 style={{ color: '#0d9488', marginBottom: '12px', fontSize: '16px' }}>🎯 Så här kommer du igång:</h3>
              <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#64748b' }}>
                <li><strong>Skapa en ny tävling</strong> - Klicka på "Ny tävling" och fyll i grundinformation</li>
                <li><strong>Lägg till lag</strong> - Registrera alla deltagande lag med spelare</li>
                <li><strong>Starta Swiss-ronder</strong> - Systemet parar automatiskt ihop lagen</li>
                <li><strong>Spela cup-final</strong> - De bästa lagen går vidare till slutspel</li>
                <li><strong>Skriv ut resultat</strong> - Professionella utskrifter för anslagstavla</li>
              </ol>
            </div>

            <div>
              <h3 style={{ color: '#0d9488', marginBottom: '12px', fontSize: '16px' }}>⚙️ Turneringsinställningar:</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#64748b' }}>
                <li><strong>Singel/Dubbel/Trippel:</strong> Antal spelare per lag</li>
                <li><strong>Ålderskategori:</strong> Öppen, V55, V65, V75</li>
                <li><strong>Swiss-ronder:</strong> 2-4 kvalronder innan cup</li>
                <li><strong>Lag per pool:</strong> Gruppstorlek i Swiss-systemet</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #bbf7d0'
            }}>
              <h4 style={{ color: '#166534', margin: '0 0 8px 0', fontSize: '14px' }}>💡 Pro-tips:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#166534' }}>
                <li>Använd <strong>Swiss System</strong> för rättvisa matcher</li>
                <li>Kör <strong>3-4 ronder</strong> för bästa ranking</li>
                <li>Skriv ut <strong>spelschema</strong> för anslagstavla</li>
                <li>Spara <strong>turneringsdata</strong> automatiskt i webbläsaren</li>
              </ul>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              paddingTop: '16px'
            }}>
              <Button 
                onClick={() => setIsInstructionsModalOpen(false)}
                style={{ flex: 1 }}
              >
                Förstått!
              </Button>
            </div>
          </div>
        </Modal>

        {/* Print Modal */}
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title="🖨️ Skriv ut turneringsdata"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <h3 style={{ color: '#0d9488', marginBottom: '12px', fontSize: '16px' }}>📄 Vad vill du skriva ut?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="ranking"
                    checked={printOptions.type === 'ranking'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                  />
                  <span><strong>🏆 Aktuell ranking</strong> - Poängtabell med alla lag</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="schedule"
                    checked={printOptions.type === 'schedule'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                  />
                  <span><strong>🎯 Spelschema</strong> - Alla matcher per rond</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', background: '#fafafa', borderRadius: '8px' }}>
                  <input
                    type="radio"
                    value="teams"
                    checked={printOptions.type === 'teams'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                  />
                  <span><strong>👥 Lag-lista</strong> - Alla anmälda lag och spelare</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', background: '#fef3c7', borderRadius: '8px', border: '2px solid #f59e0b' }}>
                  <input
                    type="radio"
                    value="diploma"
                    checked={printOptions.type === 'diploma'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                  />
                  <span><strong>🏆 Diplom</strong> - Vackert diplom för vinnaren</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', background: '#e0f2fe', borderRadius: '8px', border: '2px solid #0ea5e9' }}>
                  <input
                    type="radio"
                    value="matchprotocol"
                    checked={printOptions.type === 'matchprotocol'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                  />
                  <span><strong>📋 Matchprotokoll</strong> - Tomt protokoll för domare</span>
                </label>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#0d9488', marginBottom: '12px', fontSize: '16px' }}>⚙️ Utskriftsinställningar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={printOptions.includeLogo}
                    onChange={(e) => setPrintOptions({...printOptions, includeLogo: e.target.checked})}
                  />
                  <span>Inkludera header med turneringsnamn och info</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={printOptions.includeTimestamp}
                    onChange={(e) => setPrintOptions({...printOptions, includeTimestamp: e.target.checked})}
                  />
                  <span>Visa utskriftsdatum och tid</span>
                </label>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #bbf7d0'
            }}>
              <h4 style={{ color: '#166534', margin: '0 0 8px 0', fontSize: '14px' }}>💡 Tips för bästa resultat:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#166534' }}>
                <li>Använd <strong>A4-papper</strong> i stående läge</li>
                <li>Aktivera <strong>"Bakgrundsgrafik"</strong> i utskriftsinställningar</li>
                <li>Välj <strong>"Anpassa till sida"</strong> om innehållet är för stort</li>
                <li>Perfekt för att <strong>hänga upp på anslagstavla</strong></li>
              </ul>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              paddingTop: '16px'
            }}>
              <Button 
                onClick={() => {
                  const tournament = tournaments.find(t => t.id === selectedTournamentId);
                  if (tournament) handlePrint(tournament);
                }}
                style={{ 
                  flex: 1,
                  backgroundColor: '#1e40af',
                  color: 'white'
                }}
              >
                🖨️ Skriv ut nu
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsPrintModalOpen(false)}
                style={{ flex: 1 }}
              >
                Avbryt
              </Button>
            </div>

            <div style={{
              fontSize: '12px',
              color: '#64748b',
              textAlign: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '12px'
            }}>
              <strong>Förhandsvisning:</strong> Utskriften öppnas i nytt fönster där du kan se förhandsvisning innan utskrift
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // 🌐 LIVE VIEW - Publikt skärm för projektor
  if (isLiveView) {
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) {
      setIsLiveView(false);
      return null;
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
        padding: '40px',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Close Live View Button */}
        <button
          onClick={() => setIsLiveView(false)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '64px', fontWeight: '800', margin: '0 0 16px 0', textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            🏆 {tournament.name}
          </h1>
          <div style={{ fontSize: '24px', opacity: 0.9 }}>
            {tournament.currentPhase === 'swiss' ? `Swiss Rond ${tournament.currentRound}` :
             tournament.currentPhase === 'cup' ? 'Cup-spel' :
             tournament.currentPhase === 'setup' ? 'Förberedelse' : 'Avslutad'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1600px', margin: '0 auto' }}>
          {/* Ranking */}
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>📊 Ranking</h2>
            <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px', padding: '20px', color: '#1e293b' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(45deg, #3b82f6, #1e40af)', color: 'white' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '18px' }}>#</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '18px' }}>Lag</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '18px' }}>V-F</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '18px' }}>Poäng</th>
                  </tr>
                </thead>
                <tbody>
                  {[...tournament.teams]
                    .sort((a, b) => {
                      if (b.points !== a.points) return b.points - a.points;
                      return (b.buchholz || 0) - (a.buchholz || 0);
                    })
                    .map((team, index) => (
                      <tr key={team.id} style={{
                        background: index % 2 === 0 ? '#f8fafc' : 'white',
                        borderBottom: '1px solid #e2e8f0'
                      }}>
                        <td style={{ padding: '16px', fontSize: '20px', fontWeight: '700', color: index < 3 ? '#3b82f6' : '#64748b' }}>
                          {index + 1}
                          {index === 0 && ' 🥇'}
                          {index === 1 && ' 🥈'}
                          {index === 2 && ' 🥉'}
                        </td>
                        <td style={{ padding: '16px', fontSize: '20px', fontWeight: '600' }}>{team.name}</td>
                        <td style={{ padding: '16px', fontSize: '20px', textAlign: 'center', color: '#64748b' }}>
                          {team.wins || 0}-{team.losses || 0}
                        </td>
                        <td style={{ padding: '16px', fontSize: '28px', fontWeight: '700', textAlign: 'center', color: '#3b82f6' }}>
                          {team.points || 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pågående matcher */}
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>🎯 Pågående matcher</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tournament.matches.filter(m => !m.isCompleted).length > 0 ? (
                tournament.matches.filter(m => !m.isCompleted).map(match => (
                  <div key={match.id} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '24px',
                    color: '#1e293b',
                    border: '3px solid #fbbf24',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', marginBottom: '12px' }}>
                      {match.phase === 'swiss' ? `Swiss Rond ${match.round}` :
                       match.round === 'qf' ? 'Kvartsfinal' :
                       match.round === 'sf' ? 'Semifinal' :
                       match.round === 'final' ? '🏆 FINAL' :
                       match.round === 'bronze' ? '🥉 Bronsmatch' : 'Match'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', flex: 1 }}>{match.team1Name}</div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#64748b', padding: '0 20px' }}>vs</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', flex: 1, textAlign: 'right' }}>{match.team2Name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  padding: '40px',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <div style={{ fontSize: '20px', fontWeight: '600' }}>Alla matcher är klara!</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          maxWidth: '1200px',
          margin: '40px auto 0'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>{tournament.teams.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Lag</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>{tournament.matches.filter(m => m.isCompleted).length}</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Klara</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>{tournament.matches.filter(m => !m.isCompleted).length}</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Kvarstående</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>
              {tournament.currentPhase === 'swiss' ? tournament.currentRound : tournament.currentPhase === 'cup' ? 'Cup' : '-'}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Fas</div>
          </div>
        </div>
      </div>
    );
  }

  // Tournament View - Nu med faktisk funktionalitet v2
  const tournament = tournaments.find(t => t.id === selectedTournamentId);
  
  if (!tournament) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        padding: '32px',
        textAlign: 'center'
      }}>
        <h1>Turnering hittades inte</h1>
        <Button onClick={goToDashboard}>Tillbaka till dashboard</Button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%)',
      padding: '0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '20px 32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={goToDashboard}
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ← Tillbaka
            </button>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {tournament.name}
              </h1>
              <p style={{
                margin: '4px 0 0 0',
                color: '#64748b',
                fontSize: '16px'
              }}>
                📅 {tournament.date} • {tournament.settings.teamType} • {tournament.settings.ageCategory}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              onClick={() => setIsPrintModalOpen(true)}
              variant="secondary"
            >
              🖨️ Skriv ut
            </Button>
            <Button
              onClick={() => deleteTournament(tournament.id)}
              variant="danger"
            >
              🗑️ Radera
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 32px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          
          {/* Tournament Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '2px solid #0ea5e9'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>
                {tournament.teams.length}
              </h3>
              <p style={{ margin: 0, color: '#0369a1', fontWeight: '500' }}>Lag anmälda</p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '2px solid #22c55e'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#14532d' }}>
                {tournament.matches.filter(m => m.isCompleted).length}/{tournament.matches.length}
              </h3>
              <p style={{ margin: 0, color: '#166534', fontWeight: '500' }}>Matcher spelade</p>
            </div>
            
            <div style={{
              background: tournament.currentPhase === 'setup' ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' :
                         tournament.currentPhase === 'swiss' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
                         tournament.currentPhase === 'cup' ? 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)' : 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: tournament.currentPhase === 'setup' ? '2px solid #6b7280' :
                      tournament.currentPhase === 'swiss' ? '2px solid #f59e0b' :
                      tournament.currentPhase === 'cup' ? '2px solid #ea580c' : '2px solid #22c55e'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {tournament.currentPhase === 'setup' ? '⚙️' :
                 tournament.currentPhase === 'swiss' ? '⚡' :
                 tournament.currentPhase === 'cup' ? '🏆' : '✅'}
              </div>
              <h3 style={{ 
                margin: '0 0 4px 0', 
                fontSize: '18px', 
                fontWeight: '700',
                color: tournament.currentPhase === 'setup' ? '#374151' :
                       tournament.currentPhase === 'swiss' ? '#92400e' :
                       tournament.currentPhase === 'cup' ? '#9a3412' : '#14532d'
              }}>
                {tournament.currentPhase === 'setup' ? 'Förberedelse' :
                 tournament.currentPhase === 'swiss' ? `Swiss Rond ${tournament.currentRound}` :
                 tournament.currentPhase === 'cup' ? 'Cup-spel' : 'Avslutad'}
              </h3>
              <p style={{ 
                margin: 0, 
                fontWeight: '500',
                color: tournament.currentPhase === 'setup' ? '#4b5563' :
                       tournament.currentPhase === 'swiss' ? '#a16207' :
                       tournament.currentPhase === 'cup' ? '#c2410c' : '#166534'
              }}>
                Aktuell fas
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <button
              onClick={() => {
                const teamType = tournament?.settings?.teamType || 'dubbel';
                updateTeamPlayers(teamType);
                setIsAddTeamModalOpen(true);
              }}
              style={{
                background: 'linear-gradient(45deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Lägg till lag</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Registrera deltagande lag</div>
            </button>

            <button
              onClick={() => alert('Här skulle Swiss-ronder startas:\n\n• Automatisk parning baserat på poäng\n• Monrad-system för rättvisa matcher\n• Undvik att samma lag möts igen\n• Generera spelschema för aktuell rond\n\nI en fullständig version skulle detta starta Swiss-systemet.')}
              style={{
                background: tournament.teams.length < 4 ? 'linear-gradient(45deg, #94a3b8, #64748b)' : 'linear-gradient(45deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: tournament.teams.length < 4 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: tournament.teams.length < 4 ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.4)',
                opacity: tournament.teams.length < 4 ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (tournament.teams.length >= 4) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (tournament.teams.length >= 4) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                }
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                {tournament.currentPhase === 'setup' ? 'Starta Swiss' : 'Nästa rond'}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                {tournament.teams.length < 4 ? 'Behöver minst 4 lag' : 'Automatisk parning'}
              </div>
            </button>

            <button
              onClick={startSwissRound}
              disabled={tournament.teams.length < 4 || (tournament.currentPhase === 'swiss' && tournament.matches.some(m => m.phase === 'swiss' && m.round === tournament.currentRound && !m.isCompleted))}
              style={{
                background: tournament.teams.length < 4 ? 'linear-gradient(45deg, #9ca3af, #6b7280)' : 'linear-gradient(45deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: tournament.teams.length < 4 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                opacity: tournament.teams.length < 4 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (tournament.teams.length >= 4) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (tournament.teams.length >= 4) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                }
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Starta Swiss-rond</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Automatisk parning</div>
            </button>

            <button
              onClick={startCupPhase}
              disabled={tournament.currentPhase !== 'swiss' || tournament.currentRound < tournament.settings.swissRounds}
              style={{
                background: tournament.currentPhase === 'swiss' && tournament.currentRound >= tournament.settings.swissRounds ? 'linear-gradient(45deg, #ec4899, #db2777)' : 'linear-gradient(45deg, #9ca3af, #6b7280)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: tournament.currentPhase === 'swiss' && tournament.currentRound >= tournament.settings.swissRounds ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                opacity: tournament.currentPhase === 'swiss' && tournament.currentRound >= tournament.settings.swissRounds ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (tournament.currentPhase === 'swiss' && tournament.currentRound >= tournament.settings.swissRounds) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (tournament.currentPhase === 'swiss' && tournament.currentRound >= tournament.settings.swissRounds) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.4)';
                }
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Starta Cup-spel</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Top 8 till slutspel</div>
            </button>

            {tournament.currentPhase === 'cup' && tournament.matches.filter(m => m.phase === 'cup' && m.isCompleted).length > 0 && (
              <button
                onClick={advanceCupRound}
                style={{
                  background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>➡️</div>
                <div style={{ fontWeight: '700', marginBottom: '4px' }}>Nästa Cup-rond</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Semifinal/Final</div>
              </button>
            )}

            <button
              onClick={() => setIsLiveView(true)}
              style={{
                background: 'linear-gradient(45deg, #06b6d4, #0891b2)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.4)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌐</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Live Resultat-tavla</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>För projektor/storskärm</div>
            </button>

            <button
              onClick={exportTournament}
              style={{
                background: 'linear-gradient(45deg, #14b8a6, #0d9488)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(20, 184, 166, 0.4)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💾</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Exportera Turnering</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Backup till JSON-fil</div>
            </button>

            <label style={{
              background: 'linear-gradient(45deg, #a855f7, #9333ea)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)';
            }}>
              <input
                type="file"
                accept=".json"
                onChange={importTournament}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📂</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Importera Turnering</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Läs in från backup</div>
            </label>
          </div>

          {/* Tournament Info */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              📋 Turneringsinställningar
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <strong>Lagtyp:</strong> {tournament.settings.teamType}
              </div>
              <div>
                <strong>Ålderskategori:</strong> {tournament.settings.ageCategory}
              </div>
              <div>
                <strong>Swiss-ronder:</strong> {tournament.settings.swissRounds}
              </div>
              <div>
                <strong>Lag per pool:</strong> {tournament.settings.teamsPerPool}
              </div>
            </div>
          </div>

          {/* Teams List */}
          {tournament.teams.length > 0 && (
            <div style={{
              marginTop: '30px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                👥 Anmälda lag ({tournament.teams.length})
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {tournament.teams.map((team, index) => (
                  <div
                    key={team.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1e293b'
                      }}>
                        {index + 1}. {team.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => generateQRCode(team, tournament)}
                          style={{
                            background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            width: '24px',
                            height: '24px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Generera QR-kod"
                        >
                          📸
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Vill du ta bort laget "${team.name}"?`)) {
                              const updatedTournament = {
                                ...tournament,
                                teams: tournament.teams.filter(t => t.id !== team.id)
                              };
                              setTournaments(prev => prev.map(t => 
                                t.id === selectedTournamentId ? updatedTournament : t
                              ));
                            }
                          }}
                          style={{
                            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            width: '24px',
                            height: '24px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: '4px'
                    }}>
                      <strong>Spelare:</strong> {team.players.join(', ')}
                    </div>
                    {team.licenseNumber && (
                      <div style={{
                        fontSize: '14px',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        <strong>Licens:</strong> {team.licenseNumber}
                      </div>
                    )}
                    {team.contactInfo && (
                      <div style={{
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <strong>Kontakt:</strong> {team.contactInfo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tournament.teams.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '20px',
              border: '2px dashed #38bdf8',
              marginTop: '30px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e', marginBottom: '8px' }}>
                Inga lag anmälda ännu
              </h3>
              <p style={{ color: '#0369a1', marginBottom: '20px' }}>
                Börja med att lägga till lag för att kunna starta turneringen.
              </p>
              <button
                onClick={() => {
                  const teamType = tournament?.settings?.teamType || 'dubbel';
                  updateTeamPlayers(teamType);
                  setIsAddTeamModalOpen(true);
                }}
                style={{
                  background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➞ Lägg till första laget
              </button>
            </div>
          )}

          {/* 🎯 MATCHER & RESULTAT */}
          {tournament.matches.length > 0 && (
            <div style={{
              marginTop: '30px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #f59e0b'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#78350f',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🎯 Matcher ({tournament.matches.filter(m => !m.isCompleted).length} pågående)
              </h3>

              {/* Aktuella matcher */}
              {tournament.matches.filter(m => !m.isCompleted).length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#92400e', marginBottom: '12px', fontSize: '16px' }}>
                    ⏱️ Aktuella matcher
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {tournament.matches.filter(m => !m.isCompleted).map(match => (
                      <div key={match.id} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '2px solid #fbbf24',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '600', marginBottom: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                              <span>
                                {match.phase === 'swiss' ? `Swiss Rond ${match.round}` : 
                                 match.round === 'qf' ? 'Kvartsfinal' :
                                 match.round === 'sf' ? 'Semifinal' :
                                 match.round === 'final' ? '🏆 FINAL' :
                                 match.round === 'bronze' ? '🥉 Bronsmatch' : 'Match'}
                              </span>
                              {match.court && <span style={{ background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>🏟️ Bana {match.court}</span>}
                              {match.startTime && <span style={{ background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>⏰ {match.startTime}</span>}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                              {match.team1Name} <span style={{ color: '#64748b', fontWeight: '400' }}>vs</span> {match.team2Name}
                            </div>
                            {/* Bana och Tid inputs */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                              <input
                                type="number"
                                min="1"
                                placeholder="Bana"
                                value={match.court || ''}
                                onChange={(e) => assignCourt(match.id, parseInt(e.target.value) || null)}
                                style={{
                                  width: '70px',
                                  padding: '6px',
                                  fontSize: '14px',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px'
                                }}
                              />
                              <input
                                type="time"
                                value={match.startTime || ''}
                                onChange={(e) => setMatchStartTime(match.id, e.target.value)}
                                style={{
                                  padding: '6px',
                                  fontSize: '14px',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px'
                                }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="number"
                              min="0"
                              max="13"
                              placeholder="0"
                              style={{
                                width: '60px',
                                padding: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                textAlign: 'center',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px'
                              }}
                              id={`team1-${match.id}`}
                            />
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#64748b' }}>-</span>
                            <input
                              type="number"
                              min="0"
                              max="13"
                              placeholder="0"
                              style={{
                                width: '60px',
                                padding: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                textAlign: 'center',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px'
                              }}
                              id={`team2-${match.id}`}
                            />
                            <button
                              onClick={() => {
                                const score1 = document.getElementById(`team1-${match.id}`).value;
                                const score2 = document.getElementById(`team2-${match.id}`).value;
                                if (score1 && score2) {
                                  updateMatchResult(match.id, score1, score2);
                                } else {
                                  alert('Fyll i båda poängen!');
                                }
                              }}
                              style={{
                                background: 'linear-gradient(45deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              ✔️ Spara
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slutförda matcher */}
              {tournament.matches.filter(m => m.isCompleted).length > 0 && (
                <div>
                  <h4 style={{ color: '#92400e', marginBottom: '12px', fontSize: '16px' }}>
                    ✅ Slutförda matcher ({tournament.matches.filter(m => m.isCompleted).length})
                  </h4>
                  <div style={{ display: 'grid', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {tournament.matches.filter(m => m.isCompleted).map(match => (
                      <div key={match.id} style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '14px', color: '#1e293b' }}>
                          <span style={{ fontWeight: '600' }}>{match.team1Name}</span>
                          <span style={{ color: '#64748b', margin: '0 8px' }}>vs</span>
                          <span style={{ fontWeight: '600' }}>{match.team2Name}</span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: match.team1Score > match.team2Score ? '#10b981' : match.team2Score > match.team1Score ? '#ef4444' : '#64748b' }}>
                          {match.team1Score} - {match.team2Score}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 📊 RANKING & STATISTIK */}
          {tournament.teams.length > 0 && tournament.currentPhase !== 'setup' && (
            <div style={{
              marginTop: '30px',
              background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #8b5cf6'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#5b21b6',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📊 Ranking & Poäng
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '600' }}>#</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '600' }}>Lag</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: '600' }}>Matcher</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: '600' }}>V</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: '600' }}>F</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: '600' }}>Poäng</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: '600' }}>Buchholz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...tournament.teams]
                      .sort((a, b) => {
                        if (b.points !== a.points) return b.points - a.points;
                        return (b.buchholz || 0) - (a.buchholz || 0);
                      })
                      .map((team, index) => (
                        <tr key={team.id} style={{
                          background: index % 2 === 0 ? '#faf5ff' : 'white',
                          borderBottom: '1px solid #e9d5ff'
                        }}>
                          <td style={{ padding: '12px', fontWeight: '700', color: index < 3 ? '#8b5cf6' : '#64748b' }}>
                            {index + 1}
                            {index === 0 && ' 🥇'}
                            {index === 1 && ' 🥈'}
                            {index === 2 && ' 🥉'}
                          </td>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{team.name}</td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>
                            {(team.wins || 0) + (team.losses || 0) + (team.draws || 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#10b981', fontWeight: '600' }}>
                            {team.wins || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>
                            {team.losses || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '18px', fontWeight: '700', color: '#8b5cf6' }}>
                            {team.points || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: '500' }}>
                            {team.buchholz || 0}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Statistik */}
              <div style={{
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid #ddd6fe'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#5b21b6' }}>
                    {tournament.matches.filter(m => m.isCompleted).length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Spelade matcher</div>
                </div>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid #ddd6fe'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#5b21b6' }}>
                    {tournament.matches.filter(m => !m.isCompleted).length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Kvarstående</div>
                </div>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid #ddd6fe'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#5b21b6' }}>
                    {tournament.currentPhase === 'swiss' ? tournament.currentRound : tournament.currentPhase === 'cup' ? 'Cup' : '-'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Aktuell fas</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 📸 QR-KOD MODAL */}
        {qrModalOpen && selectedTeamForQR && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button
                onClick={() => setQrModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>

              <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>
                📸 QR-Kod för {selectedTeamForQR.name}
              </h2>

              {qrCodeDataURL && (
                <img
                  src={qrCodeDataURL}
                  alt="QR Code"
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: 'auto',
                    margin: '20px 0',
                    border: '4px solid #0ea5e9',
                    borderRadius: '12px'
                  }}
                />
              )}

              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'left',
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '20px'
              }}>
                <p style={{ margin: '4px 0' }}><strong>Lag:</strong> {selectedTeamForQR.name}</p>
                <p style={{ margin: '4px 0' }}><strong>Spelare:</strong> {selectedTeamForQR.players.join(', ')}</p>
                {selectedTeamForQR.licenseNumber && (
                  <p style={{ margin: '4px 0' }}><strong>Licens:</strong> {selectedTeamForQR.licenseNumber}</p>
                )}
                {selectedTeamForQR.contactInfo && (
                  <p style={{ margin: '4px 0' }}><strong>Kontakt:</strong> {selectedTeamForQR.contactInfo}</p>
                )}
              </div>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `QR_${selectedTeamForQR.name}.png`;
                  link.href = qrCodeDataURL;
                  link.click();
                }}
                style={{
                  background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                💾 Ladda ner QR-kod
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;