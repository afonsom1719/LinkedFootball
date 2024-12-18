import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PlayerService from "../services/playerService";
import ContextMenuComponent from "./contextMenuComponent";

const PlayersComponent = ({ team }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  //const [totalRecords, setTotalRecords] = useState(0); 
  const [first, setFirst] = useState(0); 
  const [rows, setRows] = useState(10); 

  const positionOrder = {
    "Goalkeeper": 1,
    "Defence": 2, 
    "Left-Back": 3,
    "Centre-Back": 4,
    "Right-Back": 5,
    "Midfield": 6,
    "Defensive Midfield": 7,
    "Left Midfield": 8,
    "Central Midfield": 9,
    "Right Midfield": 10,
    "Attacking Midfield": 11,
    "Offence": 12,
    "Left Winger": 13,
    "Right Winger": 14,
    "Centre-Forward": 15,
  };
  const defaultOrder = 99;

  // Fetch paginated data whenever `team`, `rows`, or `first` changes
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      let data;
      //let total;
      
      if (team) {
        data = await PlayerService.getPlayersByTeam(team.team);
        //data = await PlayerService.getPlayersByTeam(team.team, rows, first);
        //data = getPlayersByTeamOrdered(team.team, rows, first, orderField, orderDirection);
        //total = await PlayerService.getNumberOfPlayersByTeam(team.team);
      } else {
        data = await PlayerService.getAllPlayers();
        //data = await PlayerService.getAllPlayers(rows, first);
        // 
        //total = await PlayerService.getNumberOfPlayers();
      }
  
      setPlayers(data);
      //setTotalRecords(total); 
      setLoading(false);
    };
  
    fetchPlayers();
  }, [team, rows, first]); 

  const logoBodyTemplate = (rowData) => (
    <img src={rowData.photo} alt={rowData.name} width="50" />
  );

  // Pagination event handler
  const onPage = (event) => {
    setFirst(event.first); // Update current page offset
    setRows(event.rows); // Update rows per page
  };

  return (
    <div className="players">
      <header>
        <h1 style={{ color: "#374151", fontWeight: 700 }}>
          {team ? `${team.name} Players` : "All Players"}
        </h1>
      </header>
      <main>
        <DataTable
          value={players}
          loading={loading}
          responsiveLayout="scroll"
          stripedRows
          paginator
          rows={10} 
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50]} 
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        >
          <Column header="Logo" body={logoBodyTemplate}></Column>
          <Column field="name" sortable header="Name"></Column>
          <Column
            field="teamName"
            sortable
            header="Team"
            body={(rowData) => (
              <a href={`http://localhost:3000/LinkedFootball/${rowData.team.split("/").pop()}`} target="_blank" rel="noopener noreferrer">
                {rowData.teamName}
              </a>
            )}
          />
          <Column field="role" sortable sortFunction={(e) => e.data.sort((a, b) => e.order * ((positionOrder[a[e.field]] || defaultOrder) - (positionOrder[b[e.field]] || defaultOrder)))} header="Role"></Column>
          <Column field="birthDate" sortable header="Birth Date"></Column>
          <Column field="birthPlace" sortable header="Birth Place"></Column>
          <Column field="value" sortable header="Value"></Column>
          <Column
            header="Actions"
            body={(rowData) => {
              const entityId = rowData.player.split("/").pop(); 
              return <ContextMenuComponent entityURI={entityId} />;
            }}
          />
        </DataTable>
      </main>
    </div>
  );
};

export default PlayersComponent;
