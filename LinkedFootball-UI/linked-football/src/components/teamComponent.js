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
        //console.log("TEAMS DATA", data);
        setTeams(data);
      } else {
        // Fetch all teams if no competition is selected
        const data = await TeamService.getAllTeams();
        //const data = await TeamService.getAllTeamsOrdered();
        //console.log("TEAMS DATA", data);
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
          <Column
            field="name"
            sortable
            header="Name"
            body={(rowData) => {
              // Check if the wikiDataTeamUri exists and is not empty
              if (rowData.wikiDataTeamUri && rowData.wikiDataTeamUri !== "") {
                return (
                  <a href={rowData.wikiDataTeamUri} target="_blank" rel="noopener noreferrer">
                    {rowData.name}
                  </a>
                );
              }
              // If wikiDataTeamUri is empty, just display the text
              return rowData.name || "N/A";
            }}
          />
          <Column
            field="compName"
            sortable
            header="Competition"
            body={(rowData) => (
              <a href={`http://localhost:3000/LinkedFootball/${rowData.competition.split("/").pop()}`} target="_blank" rel="noopener noreferrer">
                {rowData.compName}
              </a>
            )}
          />
          <Column
            header="Coach"
            sortable
            body={(rowData) => {
              // Check if the coachUri exists and is not empty
              if (rowData.coachUri && rowData.coachUri !== "") {
                return (
                  <a href={rowData.coachUri} target="_blank" rel="noopener noreferrer">
                    {rowData.coach}
                  </a>
                );
              }
              // If coachUri is empty, just display the text
              return rowData.coach || "Unknown";
            }}
          ></Column>
          <Column
            header="Stadium"
            sortable
            body={(rowData) => {
              // Check if the stadiumUri exists and is not empty
              if (rowData.stadiumUri && rowData.stadiumUri !== "") {
                return (
                  <a href={rowData.stadiumUri} target="_blank" rel="noopener noreferrer">
                    {rowData.stadiumName}
                  </a>
                );
              }
              // If stadiumUri is empty, just display the text
              return rowData.stadiumName || "N/A";
            }}
          ></Column>
          <Column field="color" header="Colors" />
          <Column field="foundingDate" sortable header="Founding Date" />
          <Column field="location" header="Location" />
          <Column field="value" sortable header="Value" body={(rowData) => `${rowData.value}€`}></Column>
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
