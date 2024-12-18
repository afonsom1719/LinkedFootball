import logo from './logo.svg';
import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Menubar } from 'primereact/menubar';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/* Components */
import CompetitionComponent from './components/competitionComponent';
import TeamsComponent from './components/teamComponent';
import PlayersComponent from './components/playerComponent';
import EntityPageMinimal from './components/entityPageMinimal'; // Minimal RDF display page

const App = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Manage active tab
  const [selectedCompetition, setSelectedCompetition] = useState(null); // Selected competition context
  const [selectedTeam, setSelectedTeam] = useState(null); // Selected team context

  // Define menu items for the Menubar
  const items = [
    { label: "Competitions", icon: "pi pi-fw pi-calendar", command: () => setActiveIndex(1) },
    { 
      label: "Teams", 
      icon: "pi pi-fw pi-users", 
      command: () => {
        setActiveIndex(2);
        setSelectedCompetition(null); 
        setSelectedTeam(null); // Clear selected team
      }
    },
    { 
      label: "Players", 
      icon: "pi pi-fw pi-user", 
      command: () => {
        setActiveIndex(3);
        setSelectedTeam(null); // Clear selected team
      }
    },
  ];

  // Define the start section with the logo
  const start = (
    <div className="logo" style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginRight: '20px' }}>
      <span 
        style={{ 
          color: 'var(--primary-600)', 
          fontWeight: 'bold', 
          fontSize: '20px', 
          fontFamily: "'Alata', sans-serif", 
        }}
      >
        Linked
      </span>
      <span 
        style={{ 
          color: '#374151', 
          fontWeight: 'bold', 
          fontSize: '20px', 
          fontFamily: "'Alata', sans-serif", 
        }}
      >
        Football
      </span>
    </div>
  );

  return (
    <PrimeReactProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Standard App Routes */}
            <Route path="/" element={
              <>
                <Menubar model={items} start={start} style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
                <div className="content" style={{ padding: "2rem", color: "white" }}>
                  {activeIndex === 1 && <CompetitionComponent onSelectCompetition={setSelectedCompetition} setActiveIndex={setActiveIndex} />}
                  {activeIndex === 2 && <TeamsComponent competition={selectedCompetition} setSelectedTeam={setSelectedTeam} setActiveIndex={setActiveIndex} />}
                  {activeIndex === 3 && <PlayersComponent team={selectedTeam} />}
                </div>
              </>
            } />

            {/* Minimal RDF Page */}
            <Route path="/LinkedFootball/:entity" element={<EntityPageMinimal />} />
          </Routes>
        </div>
      </Router>
    </PrimeReactProvider>
  );
};

export default App;
