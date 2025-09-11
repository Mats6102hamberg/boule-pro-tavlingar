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
    swissRounds: 3,
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
        currentPhase: 'setup',
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
  };

  const handlePrint = (tournament) => {
    const content = generatePrintContent(tournament, printOptions.format);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  // Button Component
  const Button = ({ children, onClick, variant = 'primary', disabled, style = {} }) => {
    const variants = {
      primary: { backgroundColor: '#0d9488', color: 'white' },
      secondary: { backgroundColor: '#e2e8f0', color: '#1e293b' },
      danger: { backgroundColor: '#dc2626', color: 'white' },
      success: { backgroundColor: '#16a34a', color: 'white' }
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '500',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          fontSize: '14px',
          ...variants[variant],
          ...style
        }}
      >
        {children}
      </button>
    );
  };

  // Input Component
  const Input = ({ value, onChange, placeholder, type = 'text', style = {} }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
          ...style
        }}
      />
    );
  };

  // Select Component
  const Select = ({ value, onChange, options, style = {} }) => {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: 'white',
          ...style
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

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%',
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1e293b',
              margin: 0
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#64748b'
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

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        padding: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <header style={{
            backgroundColor: '#0d9488',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '32px'
          }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              Boule Pro Tävlingar
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
              Swiss System + Cup-spel
            </p>
          </header>
          
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#0d9488',
                marginBottom: '16px',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
              onClick={() => alert('Här skulle en söksida för tidigare tävlingar öppnas där man kan:\n\n🔍 Söka efter specifika turneringar\n📅 Filtrera på datum\n🏆 Filtrera på kategori (V55, V65, etc.)\n📍 Söka på plats\n👥 Hitta lag eller spelare\n📊 Se historisk statistik\n\nI en riktig implementation skulle detta navigera till en dedikerad söksida!')}
              >
                🔍 Tidigare tävlingar
              </h2>
              <p style={{ 
                color: '#64748b', 
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: '500'
              }}>
                Hantera professionella boule-turneringar
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  + Ny tävling
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsInstructionsModalOpen(true)}
                  style={{
                    fontSize: '14px',
                    padding: '10px 16px'
                  }}
                >
                  📖 Instruktioner
                </Button>
              </div>
            </div>
            
            {tournaments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  Välkommen till Boule Pro!
                </h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>
                  Skapa din första professionella turnering för att komma igång.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Skapa din första tävling
                </Button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '24px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
              }}>
                {tournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    onClick={() => openTournament(tournament.id)}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '4px'
                        }}>
                          {tournament.name}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#64748b',
                          marginBottom: '8px'
                        }}>
                          {tournament.date}
                        </p>
                        
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          marginBottom: '12px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            backgroundColor: '#d1fae5',
                            color: '#065f46',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {tournament.settings.teamType.toUpperCase()}
                          </span>
                          <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {tournament.settings.ageCategory}
                          </span>
                          <span style={{
                            backgroundColor: tournament.currentPhase === 'setup' ? '#f3f4f6' :
                                           tournament.currentPhase === 'swiss' ? '#fef3c7' :
                                           tournament.currentPhase === 'cup' ? '#fed7aa' : '#dcfce7',
                            color: tournament.currentPhase === 'setup' ? '#374151' :
                                   tournament.currentPhase === 'swiss' ? '#92400e' :
                                   tournament.currentPhase === 'cup' ? '#9a3412' : '#166534',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {tournament.currentPhase === 'setup' ? 'Förberedelse' :
                             tournament.currentPhase === 'swiss' ? `Swiss Rond ${tournament.currentRound}` :
                             tournament.currentPhase === 'cup' ? 'Cup-spel' : 'Avslutad'}
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '14px',
                          color: '#64748b'
                        }}>
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
                        style={{
                          fontSize: '12px',
                          padding: '4px 8px'
                        }}
                      >
                        🗑️
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
              <Input
                value={newTournamentName}
                onChange={setNewTournamentName}
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
                onClick={createTournament} 
                style={{ flex: 1 }}
                disabled={!newTournamentName.trim()}
              >
                Skapa tävling
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsCreateModalOpen(false)}
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="teams"
                    checked={printOptions.type === 'teams'}
                    onChange={(e) => setPrintOptions({...printOptions, type: e.target.value})}
                  />
                  <span><strong>👥 Lag-lista</strong> - Alla anmälda lag och spelare</span>
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

  // Tournament View (kommer i nästa steg)
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      padding: '32px',
      textAlign: 'center'
    }}>
      <header style={{
        backgroundColor: '#0d9488',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <button
          onClick={goToDashboard}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Boule Pro Tävlingar
        </button>
      </header>
      
      <h1>Turneringssida kommer snart...</h1>
      <p>Vi bygger turneringsfunktionerna steg för steg</p>
      <Button onClick={goToDashboard} style={{ marginTop: '20px' }}>
        Tillbaka till dashboard
      </Button>
    </div>
  );
};

export default App;