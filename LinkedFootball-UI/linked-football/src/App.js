import logo from './logo.svg';
import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Menubar } from 'primereact/menubar';
import { useState } from 'react';

/* Components */
import CompetitionComponent from './components/competitionComponent';
import TeamsComponent from './components/teamComponent';

const App = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Manage active tab
  const [selectedCompetition, setSelectedCompetition] = useState(null); // Selected competition context

  // Define menu items for the Menubar
  const items = [
    { label: "Competitions", icon: "pi pi-fw pi-calendar", command: () => setActiveIndex(1) },
    { label: "Teams", icon: "pi pi-fw pi-users", command: () => setTeamsTab() },
    { label: "Players", icon: "pi pi-fw pi-user", command: () => setActiveIndex(3) },
    { label: "SPARQL Query", icon: "pi pi-fw pi-search", command: () => setActiveIndex(4) },
  ];

  // function to set active index to 2 and clean selected competition (to be used in the command of the Teams tab)
  const setTeamsTab = () => {
    setActiveIndex(2);
    setSelectedCompetition(null);
  };

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
          color: 'white', 
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
      <div className="App">
        {/* Menubar with logo on the left and tabs on the right */}
        <Menubar model={items} start={start} style={{ backgroundColor: '#808080' }} />

        <div className="content" style={{ padding: "2rem", color: "white" }}>
          {/* Conditionally render based on activeIndex */}
          {activeIndex === 1 && (
            <CompetitionComponent onSelectCompetition={setSelectedCompetition} setActiveIndex={setActiveIndex} />
          )}
          {activeIndex === 2 && (
            <TeamsComponent competition={selectedCompetition} />
          )}
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;
