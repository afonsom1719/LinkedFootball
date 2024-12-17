import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PlayerService from "../services/playerService";

const PlayersComponent = ({ team }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  //const [totalRecords, setTotalRecords] = useState(0); 
  const [first, setFirst] = useState(0); 
  const [rows, setRows] = useState(10); 

  // Fetch paginated data whenever `team`, `rows`, or `first` changes
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      let data;
      //let total;
      
      if (team) {
        data = await PlayerService.getPlayersByTeam(team.team);
        //data = await PlayerService.getPlayersByTeam(team.team, rows, first);
        //total = await PlayerService.getNumberOfPlayersByTeam(team.team);
      } else {
        data = await PlayerService.getAllPlayers();
        //data = await PlayerService.getAllPlayers(rows, first);
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
          <Column field="name" header="Name"></Column>
          <Column field="role" header="Role"></Column>
          <Column field="birthDate" header="Birth Date"></Column>
          <Column field="birthPlace" header="Birth Place"></Column>
          <Column field="value" header="Value"></Column>
        </DataTable>
      </main>
    </div>
  );
};

export default PlayersComponent;
