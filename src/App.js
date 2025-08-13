import React, { useState, useEffect } from 'react';

// Den här koden är din, men med korrigerade Tailwind-klasser för en mörk design.
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
      <p>Spelsystem: ${tournament.settings.gameSystem}</p>
    `;

    const playerRows = tournament.teams.map(team => `
      <tr>
        <td>${team.name}</td>
        <td>${team.players.join(', ')}</td>
        <td>${team.licenseNumber}</td>
        <td>${team.rank}</td>
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
  };

  const handlePrint = (tournament) => {
    const content = generatePrintContent(tournament, printOptions.format);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Boule Pro</h1>
        {currentView === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Turneringar</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Skapa Ny Turnering
            </button>
            {tournaments.length === 0 ? (
              <p className="text-gray-400">Inga turneringar skapade än.</p>
            ) : (
              <ul className="space-y-4">
                {tournaments.map(tournament => (
                  <li
                    key={tournament.id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{tournament.name}</h3>
                        <p className="text-gray-400">{tournament.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openTournament(tournament.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Öppna
                        </button>
                        <button
                          onClick={() => deleteTournament(tournament.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Radera
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {currentView === 'tournament' && selectedTournamentId && (
          <TournamentView
            tournamentId={selectedTournamentId}
            onBack={goToDashboard}
            onPrint={handlePrint}
            printOptions={printOptions}
            setPrintOptions={setPrintOptions}
          />
        )}
        {isCreateModalOpen && (
          <CreateTournamentModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={createTournament}
            newTournamentName={newTournamentName}
            setNewTournamentName={setNewTournamentName}
            tournamentSettings={tournamentSettings}
            setTournamentSettings={setTournamentSettings}
          />
        )}
        {isInstructionsModalOpen && (
          <InstructionsModal onClose={() => setIsInstructionsModalOpen(false)} />
        )}
        {isPrintModalOpen && (
          <PrintOptionsModal
            onClose={() => setIsPrintModalOpen(false)}
            printOptions={printOptions}
            setPrintOptions={setPrintOptions}
            onPrint={handlePrint}
            tournament={tournaments.find(t => t.id === selectedTournamentId)}
          />
        )}
      </div>
    </div>
  );
};

export default App;