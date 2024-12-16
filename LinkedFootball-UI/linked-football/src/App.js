import logo from './logo.svg';
import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Menubar } from 'primereact/menubar';
/* Components */
import CompetitionComponent from './components/competitionComponent';
import { useState } from 'react';

const App = () => {

  const [activeIndex, setActiveIndex] = useState(0); // Manage active tab

  // Define menu items for the Menubar
  const items = [
    { label: "Home", icon: "pi pi-fw pi-home", command: () => setActiveIndex(0) },
    { label: "Competitions", icon: "pi pi-fw pi-calendar", command: () => setActiveIndex(1) },
    { label: "Teams", icon: "pi pi-fw pi-users", command: () => setActiveIndex(2) },
    { label: "Players", icon: "pi pi-fw pi-user", command: () => setActiveIndex(3) },
    { label: "SPARQL Query", icon: "pi pi-fw pi-search", command: () => setActiveIndex(4) },
  ];

  // Define the start section with the logo
  const start = (
    <div className="logo" style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginRight: '20px' }}>
      <span className="money" 
        style={{ 
          color: 'var(--primary-600)', 
          fontWeight: 'bold', 
          fontSize: '20px', 
          fontFamily: "'Alata', sans-serif", 
        }}
      >
        Linked
      </span>
      <span className="viz" 
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
        <Menubar model={items} start={start} style={{ backgroundColor: '#808080'}} />

        <div className="content" style={{ padding: "2rem", color: "white" }}>
          <CompetitionComponent /> {/* Render the Competitions component here */}
        </div>
  
      </div>
    </PrimeReactProvider>
  );
}

export default App;
