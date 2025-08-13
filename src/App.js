import React, { useState, useEffect } from 'react';

const App = () => {
  const [tournaments, setTournaments] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
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
    gameSystem: 'swiss', // swiss, monrad, pool
    swissRounds: 3,
    monradRounds: 4,
    poolSize: 4,
    poolsToAdvance: 2, // antal lag per pool som går vidare till cup
    teamsPerPool: 3
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

  const createTournament = () => {
    if (newTournamentName.trim()) {
      const newTournament = {
        id: Date.now().toString(),
        name: newTournamentName.trim(),
        date: new Date().toLocaleDateString('sv-SE'),
        teams: [],
        matches: [],
        settings: { ...tournamentSettings },
        gameSystem: tournamentSettings.gameSystem,
        pools: [], // för pool-spel
        poolResults: [], // resultat från poolspel
        currentPhase: 'setup', // setup, swiss, monrad, pools, cup, finished
        currentRound: 0
      };
      setTournaments([...tournaments, newTournament]);
      setNewTournamentName('');
      setIsCreateModalOpen(false);
    }
  };

  const deleteTournament = (tournamentId) => {
    if (window.confirm('Är du säker på att du vill radera denna turnering?')) {
      setTournaments(tournaments.filter(t => t.id !== tournamentId));
    }
  };

  const openTournament = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setCurrentView('tournament');
  };

  const goToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTournamentId(null);
  };

  // Förbättrade Print-funktioner med spelare, ranking och licensnummer
  const generatePrintContent = (tournament, type) => {
    const timestamp = new Date().toLocaleString('sv-SE');
    
    const baseStyles = `
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.4;
          color: #000;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 3px solid #0d9488;
          padding-bottom: 20px;
        }
        .tournament-title { 
          font-size: 32px; 
          font-weight: bold; 
          color: #0d9488;
          margin: 0 0 10px 0;
        }
        .tournament-info {
          font-size: 18px;
          color: #666;
          margin: 8px 0;
        }
        .print-timestamp {
          font-size: 14px;
          color: #999;
          margin-top: 15px;
        }
        .ranking-table, .match-table, .team-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 25px;
          font-size: 13px;
        }
        .ranking-table th, .ranking-table td,
        .match-table th, .match-table td,
        .team-table th, .team-table td { 
          border: 1px solid #333; 
          padding: 10px 8px; 
          text-align: left; 
          vertical-align: top;
        }
        .ranking-table th, .match-table th, .team-table th { 
          background-color: #0d9488; 
          color: white; 
          font-weight: bold;
          font-size: 14px;
        }
        .ranking-position { 
          font-weight: bold; 
          text-align: center;
          width: 60px;
          font-size: 16px;
        }
        .winner-row { 
          background-color: #fef3c7; 
          font-weight: bold;
        }
        .top-three { 
          background-color: #f0fdf4; 
        }
        .match-completed { 
          background-color: #f0fdf4; 
        }
        .match-pending { 
          background-color: #fef3c7; 
        }
        .section-title {
          font-size: 24px;
          font-weight: bold;
          color: #0d9488;
          margin: 35px 0 20px 0;
          border-bottom: 2px solid #0d9488;
          padding-bottom: 8px;
        }
        .tournament-settings {
          background-color: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          margin: 25px 0;
          border-left: 5px solid #0d9488;
        }
        .player-info {
          margin: 2px 0;
          font-size: 12px;
        }
        .player-name {
          font-weight: bold;
          color: #1e293b;
        }
        .player-details {
          color: #64748b;
          font-size: 11px;
        }
        .license-number {
          color: #0d9488;
          font-weight: 500;
        }
        .team-name-cell {
          font-weight: bold;
          font-size: 14px;
          color: #1e293b;
        }
        .stats-highlight {
          font-weight: bold;
          color: #0d9488;
        }
      </style>
    `;

    let content = '';
    
    if (type === 'ranking') {
      const sortedTeams = [...tournament.teams].sort((a, b) => {
        if (a.wins !== b.wins) return b.wins - a.wins;
        return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
      });

      content = `
        <div class="section-title">🏆 Slutlig Ranking & Resultat</div>
        <p style="font-size: 16px; color: #64748b; margin-bottom: 20px;">
          <strong>Spelsystem:</strong> ${tournament.gameSystem === 'swiss' ? 'Swiss-system' : 
                                        tournament.gameSystem === 'monrad' ? 'Monrad-system' : 
                                        'Pool-spel + Cup'}
        </p>
        <table class="ranking-table">
          <thead>
            <tr>
              <th class="ranking-position">Plats</th>
              <th>Lagnamn & Spelare</th>
              <th>Vinster</th>
              <th>Förluster</th>
              <th>Poäng För</th>
              <th>Poäng Emot</th>
              <th>Skillnad</th>
            </tr>
          </thead>
          <tbody>
            ${sortedTeams.map((team, index) => {
              const playersInfo = team.players?.map(player => `
                <div class="player-info">
                  <span class="player-name">${player.name}</span>
                  ${player.ranking ? `<span class="player-details"> • Ranking: ${player.ranking}</span>` : ''}
                  ${player.licenseNumber ? `<span class="player-details"> • Lic: <span class="license-number">${player.licenseNumber}</span></span>` : ''}
                </div>
              `).join('') || '<div class="player-info"><span class="player-details">Inga spelare registrerade</span></div>';
              
              return `
                <tr class="${index === 0 ? 'winner-row' : index < 3 ? 'top-three' : ''}">
                  <td class="ranking-position">${index + 1}${index === 0 ? ' 👑' : index === 1 ? ' 🥈' : index === 2 ? ' 🥉' : ''}</td>
                  <td>
                    <div class="team-name-cell">${team.name}</div>
                    ${playersInfo}
                  </td>
                  <td class="stats-highlight">${team.wins}</td>
                  <td>${team.losses}</td>
                  <td class="stats-highlight">${team.pointsFor}</td>
                  <td>${team.pointsAgainst}</td>
                  <td class="stats-highlight">${team.pointsFor - team.pointsAgainst >= 0 ? '+' : ''}${team.pointsFor - team.pointsAgainst}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (type === 'schedule') {
      const matchesByRound = tournament.matches.reduce((acc, match) => {
        const key = `${match.phase}-${match.round}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(match);
        return acc;
      }, {});

      content = Object.entries(matchesByRound).map(([roundKey, matches]) => {
        const [phase, round] = roundKey.split('-');
        const roundNumber = parseInt(round);
        
        let roundTitle = '';
        if (phase === 'swiss') {
          roundTitle = roundNumber === 1 ? 
            '🎲 Första lotting (Swiss Rond 1)' : 
            `🔄 Swiss Rond ${roundNumber}`;
        } else if (phase === 'monrad') {
          roundTitle = roundNumber === 1 ? 
            '🎲 Första lotting (Monrad Rond 1)' : 
            `🔄 Monrad Rond ${roundNumber}`;
        } else if (phase === 'pools') {
          const poolName = matches[0]?.poolName || `Pool ${roundNumber}`;
          roundTitle = `🏊 ${poolName}`;
        } else {
          const cupStage = matches[0]?.cupStage || '';
          roundTitle = `🏆 ${cupStage}`;
        }

        return `
          <div class="section-title">${roundTitle}</div>
          <table class="match-table">
            <thead>
              <tr>
                <th style="width: 80px;">Match</th>
                <th>Lag 1 & Spelare</th>
                <th>Lag 2 & Spelare</th>
                <th style="width: 100px;">Resultat</th>
                <th style="width: 100px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${matches.map((match, index) => {
                const team1 = tournament.teams.find(t => t.id === match.team1Id);
                const team2 = tournament.teams.find(t => t.id === match.team2Id);
                
                const team1Info = team1 ? `
                  <div class="team-name-cell">${team1.name}</div>
                  ${team1.players?.map(p => `
                    <div class="player-info">
                      <span class="player-name">${p.name}</span>
                      ${p.ranking ? `<span class="player-details"> (${p.ranking})</span>` : ''}
                      ${p.licenseNumber ? `<span class="player-details"> • ${p.licenseNumber}</span>` : ''}
                    </div>
                  `).join('') || ''}
                ` : 'Okänt lag';
                
                const team2Info = team2 ? `
                  <div class="team-name-cell">${team2.name}</div>
                  ${team2.players?.map(p => `
                    <div class="player-info">
                      <span class="player-name">${p.name}</span>
                      ${p.ranking ? `<span class="player-details"> (${p.ranking})</span>` : ''}
                      ${p.licenseNumber ? `<span class="player-details"> • ${p.licenseNumber}</span>` : ''}
                    </div>
                  `).join('') || ''}
                ` : 'Okänt lag';
                
                return `
                  <tr class="${match.isCompleted ? 'match-completed' : 'match-pending'}">
                    <td><strong>Match ${index + 1}</strong></td>
                    <td>${team1Info}</td>
                    <td>${team2Info}</td>
                    <td class="stats-highlight">${match.isCompleted ? `${match.team1Score} - ${match.team2Score}` : '-'}</td>
                    <td>${match.isCompleted ? '✅ Avslutad' : '⏳ Väntande'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      }).join('');
    } else if (type === 'teams') {
      content = `
        <div class="section-title">👥 Anmälda Lag & Spelare</div>
        <table class="team-table">
          <thead>
            <tr>
              <th style="width: 60px;">#</th>
              <th>Lagnamn</th>
              <th>Spelare, Ranking & Licensnummer</th>
              <th style="width: 100px;">Antal Spelare</th>
            </tr>
          </thead>
          <tbody>
            ${tournament.teams.map((team, index) => {
              const playersInfo = team.players?.map(player => `
                <div class="player-info">
                  <span class="player-name">${player.name}</span>
                  ${player.ranking ? `<span class="player-details"> • Ranking: <strong>${player.ranking}</strong></span>` : ''}
                  ${player.licenseNumber ? `<span class="player-details"> • Licensnr: <span class="license-number">${player.licenseNumber}</span></span>` : ''}
                </div>
              `).join('') || '<div class="player-info"><span class="player-details">Inga spelare registrerade</span></div>';
              
              return `
                <tr>
                  <td class="stats-highlight"><strong>${index + 1}</strong></td>
                  <td class="team-name-cell">${team.name}</td>
                  <td>${playersInfo}</td>
                  <td class="stats-highlight"><strong>${team.players?.length || 0}</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${tournament.name} - ${type === 'ranking' ? 'Ranking' : type === 'schedule' ? 'Spelschema' : 'Lag-lista'}</title>
          ${baseStyles}
        </head>
        <body>
          ${printOptions.includeLogo ? `
            <div class="header">
              <div class="tournament-title">🏆 ${tournament.name}</div>
              <div class="tournament-info">${tournament.date} • ${tournament.settings.teamType.toUpperCase()} • ${tournament.settings.ageCategory}</div>
              <div class="tournament-info">
                Fas: ${tournament.currentPhase === 'setup' ? 'Förberedelse' :
                       tournament.currentPhase === 'swiss' ? `Swiss Rond ${tournament.currentRound}` :
                       tournament.currentPhase === 'monrad' ? `Monrad Rond ${tournament.currentRound}` :
                       tournament.currentPhase === 'pools' ? 'Pool-spel' :
                       tournament.currentPhase === 'cup' ? 'Cup-spel' : 'Avslutad'}
                • ${tournament.teams.length} lag
                • ${tournament.matches.filter(m => m.isCompleted).length}/${tournament.matches.length} matcher klara
              </div>
              ${printOptions.includeTimestamp ? `<div class="print-timestamp">Utskrivet: ${timestamp}</div>` : ''}
            </div>
          ` : ''}
          
          <div class="tournament-settings">
            <strong>📋 Turneringsinställningar:</strong>
            Lagtyp: ${tournament.settings.teamType} • 
            Ålderskategori: ${tournament.settings.ageCategory} • 
            Spelsystem: ${tournament.gameSystem === 'swiss' ? `Swiss (${tournament.settings.swissRounds} ronder)` : 
                        tournament.gameSystem === 'monrad' ? `Monrad (${tournament.settings.monradRounds} ronder)` : 
                        `Pool-spel (${tournament.settings.poolSize} lag/pool, ${tournament.settings.poolsToAdvance} går vidare)`}
          </div>
          
          ${content}
          
          <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 20px;">
            <strong>Genererat av Boule Pro Tävlingar</strong> • www.boulepro.se • ${timestamp}
          </div>
        </body>
      </html>
    `;
  };

  // Snabb utskriftsfunktioner
  const printRanking = (tournament) => {
    const printContent = generatePrintContent(tournament, 'ranking');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const printSchedule = (tournament) => {
    const printContent = generatePrintContent(tournament, 'schedule');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const printTeams = (tournament) => {
    const printContent = generatePrintContent(tournament, 'teams');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handlePrint = (tournament) => {
    const printContent = generatePrintContent(tournament, printOptions.type);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
    setIsPrintModalOpen(false);
  };

  // Button Component med Tailwind
  const Button = ({ children, onClick, variant = 'primary', disabled, className = '' }) => {
    const variants = {
      primary: 'bg-teal-600 hover:bg-teal-700 text-white',
      secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      print: 'bg-blue-600 hover:bg-blue-700 text-white'
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          px-4 py-3 rounded-lg border-none font-medium text-sm
          transition-all duration-200 transform
          hover:-translate-y-0.5 active:translate-y-0
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variants[variant]}
          ${className}
        `}
      >
        {children}
      </button>
    );
  };

  // Input Component med Tailwind
  const Input = ({ value, onChange, placeholder, type = 'text', className = '' }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md text-sm
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          ${className}
        `}
      />
    );
  };

  // Select Component med Tailwind
  const Select = ({ value, onChange, options, className = '' }) => {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          ${className}
        `}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  // Modal Component med Tailwind
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl leading-none bg-none border-none cursor-pointer"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="bg-teal-600 text-white p-4 rounded-lg mb-8">
            <h1 className="text-2xl font-bold m-0">
              🏆 Boule Pro Tävlingar
            </h1>
            <p className="text-teal-100 text-sm mt-1 mb-0">
              Swiss System + Monrad + Pool-spel med professionell utskrift
            </p>
          </header>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  <button
                    onClick={() => alert('Här skulle en söksida för tidigare tävlingar öppnas där man kan:\n\n🔍 Söka efter specifika turneringar\n📅 Filtrera på datum\n🏆 Filtrera på kategori (V55, V65, etc.)\n📍 Söka på plats\n👥 Hitta lag eller spelare\n📊 Se historisk statistik\n\nI en riktig implementation skulle detta navigera till en dedikerad söksida!')}
                    className="bg-none border-none text-teal-600 text-3xl font-bold cursor-pointer underline hover:text-teal-800 p-0"
                  >
                    🔍 Tidigare tävlingar
                  </button>
                </h2>
                <p className="text-slate-600 m-0">
                  Hantera professionella boule-turneringar med avancerade utskriftsmöjligheter
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  + Ny tävling
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsInstructionsModalOpen(true)}
                  className="text-sm px-4 py-2"
                >
                  📖 Instruktioner
                </Button>
              </div>
            </div>
            
            {tournaments.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Välkommen till Boule Pro!
                </h3>
                <p className="text-slate-600 mb-6">
                  Skapa din första professionella turnering med avancerade utskriftsmöjligheter.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Skapa din första tävling
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    className="bg-white border border-slate-200 rounded-lg p-5 cursor-pointer 
                             transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1" onClick={() => openTournament(tournament.id)}>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">
                          {tournament.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {tournament.date}
                        </p>
                        
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {tournament.settings.teamType.toUpperCase()}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tournament.settings.ageCategory}
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            {tournament.gameSystem === 'swiss' ? 'Swiss' : 
                             tournament.gameSystem === 'monrad' ? 'Monrad' : 'Pool+Cup'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            tournament.currentPhase === 'setup' ? 'bg-gray-100 text-gray-800' :
                            tournament.currentPhase === 'swiss' ? 'bg-yellow-100 text-yellow-800' :
                            tournament.currentPhase === 'monrad' ? 'bg-yellow-100 text-yellow-800' :
                            tournament.currentPhase === 'pools' ? 'bg-blue-100 text-blue-800' :
                            tournament.currentPhase === 'cup' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {tournament.currentPhase === 'setup' ? 'Förberedelse' :
                             tournament.currentPhase === 'swiss' ? `Swiss R${tournament.currentRound}` :
                             tournament.currentPhase === 'monrad' ? `Monrad R${tournament.currentRound}` :
                             tournament.currentPhase === 'pools' ? 'Pool-spel' :
                             tournament.currentPhase === 'cup' ? 'Cup-spel' : 'Avslutad'}
                          </span>
                        </div>
                        
                        <div className="flex gap-4 text-sm text-slate-600">
                          <span>👥 {tournament.teams.length} lag</span>
                          <span>🏆 {tournament.matches.filter(m => m.isCompleted).length}/{tournament.matches.length} matcher</span>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTournament(tournament.id);
                        }}
                        className="text-xs px-2 py-1"
                      >
                        🗑️
                      </Button>
                    </div>

                    {/* Utskriftsknappar */}
                    <div className="flex gap-2 pt-3 border-t border-slate-200 flex-wrap">
                      <Button
                        variant="print"
                        onClick={(e) => {
                          e.stopPropagation();
                          printRanking(tournament);
                        }}
                        className="text-xs px-2 py-1 flex-1 min-w-[85px]"
                      >
                        🖨️ Ranking
                      </Button>
                      <Button
                        variant="print"
                        onClick={(e) => {
                          e.stopPropagation();
                          printSchedule(tournament);
                        }}
                        className="text-xs px-2 py-1 flex-1 min-w-[85px]"
                      >
                        📄 Schema
                      </Button>
                      <Button
                        variant="print"
                        onClick={(e) => {
                          e.stopPropagation();
                          printTeams(tournament);
                        }}
                        className="text-xs px-2 py-1 flex-1 min-w-[85px]"
                      >
                        📋 Lag-lista
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTournamentId(tournament.id);
                          setIsPrintModalOpen(true);
                        }}
                        className="text-xs px-2 py-1 flex-1 min-w-[85px]"
                      >
                        ⚙️ Anpassa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Tournament Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Skapa ny tävling"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tävlingsnamn
              </label>
              <Input
                value={newTournamentName}
                onChange={setNewTournamentName}
                placeholder="T.ex. Sommar-cupen 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spelsystem
              </label>
              <Select
                value={tournamentSettings.gameSystem}
                onChange={(value) => setTournamentSettings({...tournamentSettings, gameSystem: value})}
                options={[
                  { value: 'swiss', label: 'Swiss-system (parning efter resultat)' },
                  { value: 'monrad', label: 'Monrad-system (slumpmässig parning)' },
                  { value: 'pool', label: 'Pool-spel + Cup (gruppspel sedan utslagning)' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Swiss-specifika inställningar */}
            {tournamentSettings.gameSystem === 'swiss' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Swiss-ronder
                  </label>
                  <Select
                    value={tournamentSettings.swissRounds}
                    onChange={(value) => setTournamentSettings({...tournamentSettings, swissRounds: parseInt(value)})}
                    options={[
                      { value: '2', label: '2 ronder' },
                      { value: '3', label: '3 ronder' },
                      { value: '4', label: '4 ronder' },
                      { value: '5', label: '5 ronder' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lag per pool (sista rond)
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
            )}

            {/* Monrad-specifika inställningar */}
            {tournamentSettings.gameSystem === 'monrad' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monrad-ronder
                </label>
                <Select
                  value={tournamentSettings.monradRounds}
                  onChange={(value) => setTournamentSettings({...tournamentSettings, monradRounds: parseInt(value)})}
                  options={[
                    { value: '3', label: '3 ronder' },
                    { value: '4', label: '4 ronder' },
                    { value: '5', label: '5 ronder' },
                    { value: '6', label: '6 ronder' }
                  ]}
                />
                <p className="text-xs text-slate-600 mt-1">
                  Monrad: Slumpmässig parning varje rond, inget hänsyn till tidigare resultat
                </p>
              </div>
            )}

            {/* Pool-specifika inställningar */}
            {tournamentSettings.gameSystem === 'pool' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lag per pool
                  </label>
                  <Select
                    value={tournamentSettings.poolSize}
                    onChange={(value) => setTournamentSettings({...tournamentSettings, poolSize: parseInt(value)})}
                    options={[
                      { value: '3', label: '3 lag per pool' },
                      { value: '4', label: '4 lag per pool' },
                      { value: '5', label: '5 lag per pool' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lag som går vidare
                  </label>
                  <Select
                    value={tournamentSettings.poolsToAdvance}
                    onChange={(value) => setTournamentSettings({...tournamentSettings, poolsToAdvance: parseInt(value)})}
                    options={[
                      { value: '1', label: '1 lag per pool' },
                      { value: '2', label: '2 lag per pool' },
                      { value: '3', label: '3 lag per pool (endast om 5 lag/pool)' }
                    ]}
                  />
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={createTournament} 
                className="flex-1"
                disabled={!newTournamentName.trim()}
              >
                Skapa tävling
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Avbryt
              </Button>
            </div>
          </div>
        </Modal>

        {/* Instruktioner Modal */}
        <Modal
          isOpen={isInstructionsModalOpen}
          onClose={() => setIsInstructionsModalOpen(false)}
          title="📖 Instruktioner - Boule Pro Tävlingar"
        >
          <div className="flex flex-col gap-5">
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-green-800 text-base font-semibold mb-3">🖨️ Nya utskriftsfunktioner för alla spelsystem!</h3>
              <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                <li><strong>🖨️ Skriv ut ranking</strong> - Fungerar för Swiss, Monrad och Pool-spel</li>
                <li><strong>📄 Skriv ut spelschema</strong> - Visar alla matcher oavsett spelsystem</li>
                <li><strong>📋 Skriv ut lag-lista</strong> - Komplett med ranking och licensnummer</li>
                <li><strong>⚙️ Anpassa utskrift</strong> - Olika alternativ för olika spelsystem</li>
              </ul>
            </div>

            <div>
              <h3 className="text-teal-600 text-base font-semibold mb-3">🎯 Spelsystem:</h3>
              <div className="text-sm text-gray-700 space-y-3">
                <p><strong>🔄 Swiss-system:</strong> Lag paras ihop baserat på resultat från tidigare ronder. De bästa möter de bästa.</p>
                <p><strong>🎲 Monrad-system:</strong> Slumpmässig parning varje rond, inget hänsyn till tidigare resultat.</p>
                <p><strong>🏊 Pool-spel:</strong> Lag delas in i pooler där alla möter alla. De bästa från varje pool går vidare till cup-spel.</p>
                <p><strong>🏆 Cup-spel:</strong> Utslagning efter poolspel eller som avslutning på Swiss/Monrad.</p>
              </div>
            </div>

            <div>
              <h3 className="text-teal-600 text-base font-semibold mb-3">📋 Turneringsflöde:</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>1. Skapa turnering:</strong> Välj spelsystem, lagtyp och inställningar.</p>
                <p><strong>2. Registrera lag:</strong> Lägg till lag med spelare, ranking och licensnummer.</p>
                <p><strong>3. Swiss/Monrad:</strong> Flera ronder med olika parningsystem.</p>
                <p><strong>4. Pool-spel:</strong> Gruppspel där alla möter alla inom gruppen.</p>
                <p><strong>5. Cup-spel:</strong> Kvartsfinal, semifinal och final för de bästa lagen.</p>
              </div>
            </div>

            <div>
              <h3 className="text-teal-600 text-base font-semibold mb-3">📋 Spelarinformation:</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Spelarnamn:</strong> Obligatoriskt för alla spelare</p>
                <p><strong>Ranking:</strong> Valfritt - ange spelarens aktuella ranking (t.ex. "A", "B1", "C2")</p>
                <p><strong>Licensnummer:</strong> Valfritt - spelarens officiella licensnummer från förbundet</p>
              </div>
            </div>

            <div>
              <h3 className="text-teal-600 text-base font-semibold mb-3">🖨️ Utskriftstips:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Använd <strong>A4-papper</strong> i stående läge för bästa resultat</li>
                <li>Aktivera <strong>"Bakgrundsgrafik"</strong> i utskriftsinställningar för färger</li>
                <li>Välj <strong>"Anpassa till sida"</strong> om innehållet är för stort</li>
                <li>Perfekt för att hänga upp på anslagstavla eller skicka till spelare</li>
                <li>Alla utskrifter innehåller timestamp och turneringsinformation</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="text-yellow-800 text-sm font-semibold mb-2">💡 Pro-tips:</h4>
              <ul className="list-disc list-inside text-xs text-yellow-800 space-y-1">
                <li>Skriv ut lag-listan innan tävlingen börjar för registrering</li>
                <li>Använd spelschema-utskrift för domare och funktionärer</li>
                <li>Ranking-utskrift är perfekt att hänga upp under tävlingen</li>
                <li>Spara alla utskrifter som PDF för digital arkivering</li>
              </ul>
            </div>

            <div className="flex pt-4">
              <Button 
                onClick={() => setIsInstructionsModalOpen(false)}
                className="flex-1"
              >
                Stäng instruktioner
              </Button>
            </div>
          </div>
        </Modal>

        {/* Print Modal */}
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title="🖨️ Avancerade utskriftsinställningar"
        >
          <div className="flex flex-col gap-5">
            
            <div>
              <h3 className="text-teal-600 text-base font-semibold mb-3">📄 Vad vill du skriva ut?</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="ranking"
                    checked={printOptions.type === 'ranking'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                    className="text-teal-600"
                  />
                  <span><strong>🏆 Aktuell ranking</strong> - Poängtabell för alla spelsystem</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="schedule"
                    checked={printOptions.type === 'schedule'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                    className="text-teal-600"
                  />
                  <span><strong>🎯 Spelschema</strong> - Swiss/Monrad-ronder eller Pool-matcher</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="teams"
                    checked={printOptions.type === 'teams'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                    className="text-teal-600"
                  />
                  <span><strong>👥 Lag-lista</strong> - Alla anmälda lag med spelare, ranking och licensnummer</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-teal-600 text-base font-semibold mb-3">⚙️ Utskriftsinställningar</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printOptions.includeLogo}
                    onChange={(e) => setPrintOptions({...printOptions, includeLogo: e.target.checked})}
                    className="text-teal-600"
                  />
                  <span>Inkludera header med turneringsnamn och info</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printOptions.includeTimestamp}
                    onChange={(e) => setPrintOptions({...printOptions, includeTimestamp: e.target.checked})}
                    className="text-teal-600"
                  />
                  <span>Visa utskriftsdatum och tid</span>
                </label>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <h4 className="text-green-800 text-sm font-semibold mb-2">💡 Tips för bästa resultat:</h4>
              <ul className="list-disc list-inside text-xs text-green-800 space-y-1">
                <li>Använd <strong>A4-papper</strong> i stående läge</li>
                <li>Aktivera <strong>"Bakgrundsgrafik"</strong> i utskriftsinställningar</li>
                <li>Välj <strong>"Anpassa till sida"</strong> om innehållet är för stort</li>
                <li>Alla utskrifter innehåller <strong>spelarnamn, ranking och licensnummer</strong></li>
                <li>Perfekt för att <strong>hänga upp på anslagstavla</strong></li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => {
                  const tournament = tournaments.find(t => t.id === selectedTournamentId);
                  if (tournament) handlePrint(tournament);
                }}
                variant="print"
                className="flex-1"
              >
                🖨️ Skriv ut nu
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsPrintModalOpen(false)}
                className="flex-1"
              >
                Avbryt
              </Button>
            </div>

            <div className="text-xs text-slate-600 text-center border-t border-slate-200 pt-3">
              <strong>Förhandsvisning:</strong> Utskriften öppnas i nytt fönster där du kan se förhandsvisning innan utskrift
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Tournament View
  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);
  
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="bg-teal-600 text-white p-4 rounded-lg mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={goToDashboard}
              className="bg-none border-none text-white text-2xl font-bold cursor-pointer underline hover:text-teal-200"
            >
              🏆 Boule Pro Tävlingar
            </button>
            {selectedTournament && (
              <p className="text-teal-100 text-base mt-1 mb-0">
                {selectedTournament.name} • {selectedTournament.date}
              </p>
            )}
          </div>
          
          {selectedTournament && (
            <div className="flex gap-2">
              <Button
                variant="print"
                onClick={() => printRanking(selectedTournament)}
                className="text-sm px-3 py-2"
              >
                🖨️ Ranking
              </Button>
              <Button
                variant="print"
                onClick={() => printSchedule(selectedTournament)}
                className="text-sm px-3 py-2"
              >
                📄 Schema
              </Button>
              <Button
                variant="print"
                onClick={() => printTeams(selectedTournament)}
                className="text-sm px-3 py-2"
              >
                📋 Lag-lista
              </Button>
            </div>
          )}
        </header>
        
        <div className="bg-white p-10 rounded-lg text-center shadow-md">
          <h1 className="text-3xl text-slate-800 mb-4">
            🚧 Turneringssida under utveckling
          </h1>
          <p className="text-base text-slate-600 mb-6">
            Här kommer funktioner för lagregistrering och matchhantering för alla spelsystem att byggas steg för steg.
            <br />
            <strong>Utskriftsfunktionerna är redan klara och fungerar för alla spelsystem!</strong>
          </p>
          
          <div className="bg-green-50 p-6 rounded-xl mb-8 border border-green-200 text-left">
            <h3 className="text-green-800 mb-4 text-center font-semibold">🎯 Kommande funktioner per spelsystem:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 bg-green-100 rounded-lg">
                <h4 className="text-green-800 mb-2 text-base font-medium">🔄 Swiss-system</h4>
                <ul className="text-green-800 text-sm space-y-1 list-disc list-inside">
                  <li>Automatisk parning baserat på poäng</li>
                  <li>Undviker att samma lag möts igen</li>
                  <li>Färghantering (vit/röd kulor)</li>
                  <li>Automatisk cup-generering efter sista ronden</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-100 rounded-lg">
                <h4 className="text-blue-800 mb-2 text-base font-medium">🎲 Monrad-system</h4>
                <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                  <li>Helt slumpmässig parning varje rond</li>
                  <li>Enkel och rättvis för alla lag</li>
                  <li>Perfekt för sociala turneringar</li>
                  <li>Ranking baserat endast på vinster</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-100 rounded-lg">
                <h4 className="text-yellow-800 mb-2 text-base font-medium">🏊 Pool-spel + Cup</h4>
                <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
                  <li>Automatisk poolindelning</li>
                  <li>Alla möter alla inom poolen</li>
                  <li>Flexibel avancering (1-3 lag per pool)</li>
                  <li>Cup-träd från poolresultat</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-5 rounded-lg mb-6 border border-yellow-200">
            <h4 className="text-yellow-800 text-base font-semibold mb-3">✅ Vad som redan fungerar perfekt:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              <div>
                <strong className="text-yellow-800">🖨️ Utskriftssystem:</strong>
                <ul className="mt-1 text-sm text-yellow-800 list-disc list-inside">
                  <li>Ranking för alla system</li>
                  <li>Spelschema per rond/pool</li>
                  <li>Komplett lag-lista</li>
                </ul>
              </div>
              <div>
                <strong className="text-yellow-800">📋 Data-hantering:</strong>
                <ul className="mt-1 text-sm text-yellow-800 list-disc list-inside">
                  <li>Spelarnamn & ranking</li>
                  <li>Licensnummer</li>
                  <li>Automatisk sparning</li>
                </ul>
              </div>
              <div>
                <strong className="text-yellow-800">⚙️ Flexibilitet:</strong>
                <ul className="mt-1 text-sm text-yellow-800 list-disc list-inside">
                  <li>3 olika spelsystem</li>
                  <li>Anpassbara inställningar</li>
                  <li>Professionell layout</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button onClick={goToDashboard} className="mt-5">
            ← Tillbaka till dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;