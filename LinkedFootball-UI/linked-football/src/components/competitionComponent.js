import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompetitionService from '../services/competitionService';
import ContextMenuComponent from './contextMenuComponent';

const CompetitionsComponent = ({ onSelectCompetition, setActiveIndex }) => {
  const [competitions, setCompetitions] = useState([]); // State for competitions data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      const data = await CompetitionService.getCompetitions2(); // Fetch data from the service
      //console.log("COMPETITIONS DATA", data);
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
          <Column
            field="name"
            sortable
            header="Name"
            body={(rowData) => {
              // Check if the wikiDataCompUri exists and is not empty
              if (rowData.wikiDataCompUri && rowData.wikiDataCompUri !== "") {
                return (
                  <a href={rowData.wikiDataCompUri} target="_blank" rel="noopener noreferrer">
                    {rowData.name}
                  </a>
                );
              }
              // If wikiDataCompUri is empty, just display the text
              return rowData.name || "N/A";
            }}
          />
          <Column
            header="Location"
            sortable
            body={(rowData) => {
              if (rowData.locationUri && rowData.locationUri !== "") {
                return (
                  <a href={rowData.locationUri} target="_blank" rel="noopener noreferrer">
                    {rowData.location}
                  </a>
                );
              }
              // If locationUri is empty, just display the text
              return rowData.location || "N/A";
            }}
          ></Column>
          <Column field="start_date" sortable header="Start Date"></Column>
          <Column field="end_date" sortable header="End Date"></Column>
          <Column
            header="Actions"
            body={(rowData) => {
              const entityId = rowData.competition.split("/").pop(); 
              return <ContextMenuComponent entityURI={entityId} />;
            }}
          />
        </DataTable>
      </main>
    </div>
  );
};

export default CompetitionsComponent;
