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
        const data = await TeamService.getTeamsByCompetition(competition.competition);
        setTeams(data);
      } else {
        const data = await TeamService.getAllTeams();
        setTeams(data);
      }
      setLoading(false);
    };

    fetchTeams();
  }, [competition]);

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
          <Column field="compName" header="Competition"></Column>
          <Column field="coach" header="Coach"></Column>
          <Column field="stadium" header="Stadium"></Column>
          <Column field="color" header="Colors"></Column>
          <Column field="foundingDate" header="Founding Date"></Column>
          <Column field="location" header="Location"></Column>
        </DataTable>
      </main>
    </div>
  );
};

export default TeamsComponent;
