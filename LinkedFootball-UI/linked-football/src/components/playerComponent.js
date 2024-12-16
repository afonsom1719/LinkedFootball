import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PlayerService from '../services/playerService';

const PlayersComponent = ({ team }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      if (team) {
        const data = await PlayerService.getPlayersByTeam(team.team);
        setPlayers(data);
      } else {
        const data = await PlayerService.getAllPlayers();
        setPlayers(data);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, [team]);

  const logoBodyTemplate = (rowData) => (
    <img src={rowData.photo} alt={rowData.name} width="50" />
  );

  return (
    <div className="players">
      <header>
        <h1 style={{ color: '#374151', fontWeight: 700 }}>
          {team ? `${team.name} Players` : 'All Players'}
        </h1>
      </header>
      <main>
        <DataTable value={players} loading={loading} responsiveLayout="scroll" stripedRows>
          <Column header="Photo" body={logoBodyTemplate}></Column>
          <Column field="name" header="Name"></Column>
          <Column field="role" header="Position"></Column>
          <Column field="birthDate" header="Birth Date"></Column>
          <Column field="birthPlace" header="Birth Place"></Column>
          <Column field="value" header="Value"></Column>
        </DataTable>
      </main>
    </div>
  );
};

export default PlayersComponent;
