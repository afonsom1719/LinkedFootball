import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import TeamService from "../services/teamService";
import ContextMenuComponent from "./contextMenuComponent";

const TeamsComponent = ({ competition, setSelectedTeam, setActiveIndex }) => {
  const [teams, setTeams] = useState([]); // Store teams data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch teams based on selected competition or all teams
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      if (competition) {
        // Fetch teams for the selected competition
        const data = await TeamService.getTeamsByCompetition(
          competition.competition
        );
        //const data = await TeamService.getTeamsByCompetitionOrdered(competition.competition);
        setTeams(data);
        console.log("TEAMS DATA IN TEAMS COMPONENT", data);
      } else {
        // Fetch all teams if no competition is selected
        const data = await TeamService.getAllTeams();
        //const data = await TeamService.getAllTeamsOrdered();
        setTeams(data);
      }
      setLoading(false);
    };

    fetchTeams();
  }, [competition]);

  // Template to render the logo in the DataTable
  const logoBodyTemplate = (rowData) => (
    <img src={rowData.photo} alt={rowData.name} width="50" />
  );

  // Handle row selection (when a team is selected)
  const onRowSelect = (e) => {
    setSelectedTeam(e.data); // Set selected team in the parent component (App)
    setActiveIndex(3); // Switch to Players tab (index 3)
  };

  return (
    <div className="teams">
      <header>
        <h1 style={{ color: "#374151", fontWeight: 700 }}>
          {competition ? `Teams in ${competition.name}` : "All Teams"}
        </h1>
      </header>
      <main>
        <DataTable
          value={teams} // Pass teams data to DataTable
          loading={loading} // Show loading indicator when data is being fetched
          responsiveLayout="scroll" // Make table scrollable
          stripedRows // Stripes for rows
          selectionMode="single" // Enable single row selection
          onRowSelect={onRowSelect} // Handle row selection
          paginator
          rows={20}
          rowsPerPageOptions={[10, 20, 50, 100]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        >
          {/* Define columns to display in the DataTable */}
          <Column header="Logo" body={logoBodyTemplate} />
          <Column field="name" sortable header="Name" />
          <Column field="compName" header="Competition" />
          <Column field="coach" sortable header="Coach" />
          <Column field="stadium" header="Stadium" />
          <Column field="color" header="Colors" />
          <Column field="foundingDate" sortable header="Founding Date" />
          <Column field="location" header="Location" />
          <Column
            header="Actions"
            body={(rowData) => {
              const entityId = rowData.team.split("/").pop(); 
              return <ContextMenuComponent entityURI={entityId} />;
            }}
          />
        </DataTable>
      </main>
    </div>
  );
};

export default TeamsComponent;
