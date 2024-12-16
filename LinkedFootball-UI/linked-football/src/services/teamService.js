const TeamService = {
    async getAllTeams() {
        console.log("getAllTeams");
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      const sparqlQuery = `
        PREFIX schema: <https://schema.org/> 
  
        SELECT ?team ?name ?photo ?comp WHERE {
          ?team a schema:SportsTeam ;
          schema:photo ?photo ;
          schema:name ?name ;
          schema:memberOf ?comp .
        }
      `;
  
      const response = await fetch(sparqlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          query: sparqlQuery,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch SPARQL data");
      }
  
      const data = await response.json();
  
      // Transform SPARQL JSON results into an array of objects
      const teams = data.results.bindings.map((binding) => ({
        team: binding.team.value,
        name: binding.name.value,
        photo: binding.photo.value,
        competition: binding.comp?.value || "Unknown",
      }));
  
      return teams;
    },
  
    async getTeamsByCompetition(competition) {
        console.log("getTeamsByCompetition", competition);
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      const sparqlQuery = `
        PREFIX schema: <https://schema.org/> 
  
        SELECT ?team ?name ?photo ?comp WHERE {
          ?team a schema:SportsTeam ;
          schema:photo ?photo ;
          schema:name ?name ;
          schema:memberOf <${competition.competition}> .
        }
      `;
  
      const response = await fetch(sparqlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          query: sparqlQuery,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch SPARQL data");
      }
  
      const data = await response.json();
  
      // Transform SPARQL JSON results into an array of objects
      const teams = data.results.bindings.map((binding) => ({
        team: binding.team.value,
        name: binding.name.value,
        photo: binding.photo.value,
        competition: binding.comp?.value || "Unknown",
      }));
  
      return teams;
    },
  };
  
  export default TeamService;
  