import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PlayerService from "../services/playerService";

const PlayersComponent = ({ team }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalRecords, setTotalRecords] = useState(0); // Track total records for pagination
  const [first, setFirst] = useState(0); // For tracking current page offset
  const [rows, setRows] = useState(25); // Set default rows per page to 25

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      if (team) {
        const data = await PlayerService.getPlayersByTeam(team.team, rows, first);
        const total = await PlayerService.getNumberOfPlayersByTeam(team.team);
        setPlayers(data);
        setTotalRecords(total);
      } else {
        console.log("Fetching all players");
        const data = await PlayerService.getAllPlayers(rows, first);
        const total = await PlayerService.getNumberOfPlayers();
        setPlayers(data);
        setTotalRecords(total);
      }
      console.log("Total Records:", totalRecords);
      setLoading(false);
    };

    fetchPlayers();
  }, [team]);

  const logoBodyTemplate = (rowData) => (
    <img src={rowData.photo} alt={rowData.name} width="50" />
  );

  // Pagination event handler
  const onPage = (event) => {
    setFirst(event.first); // Update current page offset
    setRows(event.rows); // Update the number of rows per page
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
          rows={rows} // Default rows per page
          totalRecords={totalRecords} // Total records for pagination
          first={first} // Track the current page
          onPage={onPage} // Handle pagination change
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50]} // Options for rows per page
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
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
