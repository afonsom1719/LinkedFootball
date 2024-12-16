import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//import './competitionComponent.css'; // Your styles
import CompetitionService from '../services/competitionService';

const CompetitionComponent = () => {
  const [competitions, setCompetitions] = useState([]); // State for competitions data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      const data = await CompetitionService.getCompetitions(); // Fetch data from the service
      setCompetitions(data);
      setLoading(false);
    };

    fetchCompetitions();
  }, []);

  // Template for rendering logos in the DataTable
  const logoBodyTemplate = (rowData) => (
    <img src={rowData.photo} alt={rowData.name} width="50" />
  );

  return (
    <div className="competitions">
      <header>
        <h1 style={{ color: '#374151', fontWeight: 700 }}>Competitions</h1>
        <p>Explore football competitions and their details.</p>
      </header>
      <main>
        <DataTable
          value={competitions}
          loading={loading}
          responsiveLayout="scroll"
          stripedRows
        >
          <Column header="Logo" body={logoBodyTemplate}></Column>
          <Column field="name" header="Name"></Column>
          <Column field="location" header="Country"></Column>
          <Column field="type" header="Type/Format"></Column>
          <Column field="start_date" header="Start Date"></Column>
          <Column field="end_date" header="End Date"></Column>
        </DataTable>
      </main>
{/*       <footer>
        <p>
          Explore the project on{" "}
          <a
            href="https://github.com/afonsom1719/LinkedFootball"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
        <p>&copy; 2024 LinkedFootball</p>
      </footer> */}
    </div>
  );
};

export default CompetitionComponent;
