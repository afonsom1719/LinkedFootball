import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TeamService from '../services/teamService';

const TeamsComponent = ({ competition }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      if (competition) {
        // Fetch teams for the selected competition
        const data = await TeamService.getTeamsByCompetition(competition.competition);
        setTeams(data);
      } else {
        // Fetch all teams if no competition is selected
        const data = await TeamService.getAllTeams();
        setTeams(data);
      }
      setLoading(false);
    };

    fetchTeams();
  }, [competition]);  // Re-fetch when competition changes

  const logoBodyTemplate = (rowData) => (
    <img src={rowData.photo} alt={rowData.name} width="50" />
  );

  return (
    <div className="teams">
      <header>
        <h1 style={{ color: '#374151', fontWeight: 700 }}>
          {competition ? `Teams in ${competition.name}` : 'All Teams'}
        </h1>
      </header>
      <main>
        <DataTable value={teams} loading={loading} responsiveLayout="scroll" stripedRows>
          <Column header="Logo" body={logoBodyTemplate}></Column>
          <Column field="name" header="Name"></Column>
          <Column field="competition" header="Competition"></Column>
        </DataTable>
      </main>
    </div>
  );
};

export default TeamsComponent;
