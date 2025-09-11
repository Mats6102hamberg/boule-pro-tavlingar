import React, { useState, useEffect, useCallback } from 'react';

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

  // Förbättrade Print-funktioner med spelare, ranking och licensnummer
  const generatePrintContent = useCallback((tournament, type) => {
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
  }, []);

  const handlePrint = useCallback((tournament) => {
    const content = generatePrintContent(tournament, printOptions.format);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }, [generatePrintContent, printOptions.format]);

  // Button Component - Enkel och stabil
  const Button = ({ children, onClick, variant = 'primary', disabled, style = {} }) => {
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
                🚀 Skapa Ny Tävling
              </button>
              
              <button
                onClick={() => setIsInstructionsModalOpen(true)}
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
                  Välkommen till Boule Pro!
                </h3>
                <p style={{ 
                  color: '#0369a1', 
                  marginBottom: '32px',
                  fontSize: '18px',
                  maxWidth: '400px',
                  margin: '0 auto 32px auto',
                  lineHeight: '1.6'
                }}>
                  Skapa din första professionella turnering med avancerade utskriftsmöjligheter och automatisk Swiss System-parning.
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
                  ✨ Skapa Din Första Tävling
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