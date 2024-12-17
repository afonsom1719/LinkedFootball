import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompetitionService from '../services/competitionService';

const CompetitionsComponent = ({ onSelectCompetition, setActiveIndex }) => {
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

  // Handle row click
  const onRowSelect = (e) => {
    onSelectCompetition(e.data); // Pass selected competition to App
    setActiveIndex(2); // Switch to Teams tab
  };

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
          selectionMode="single"
          onRowSelect={onRowSelect} // Row selection handler
        >
          <Column header="Logo" body={logoBodyTemplate}></Column>
          <Column field="name" header="Name"></Column>
          <Column field="location" header="Country"></Column>
          {/* <Column field="type" header="Type/Format"></Column> */}
          <Column field="start_date" header="Start Date"></Column>
          <Column field="end_date" header="End Date"></Column>
        </DataTable>
      </main>
    </div>
  );
};

export default CompetitionsComponent;
