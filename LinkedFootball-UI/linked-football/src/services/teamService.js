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
        // Log the competition object to verify its structure and value
        console.log("getTeamsByCompetition", competition);
      
        // Ensure the competition URL is valid
        const competitionUrl = competition;
        if (!competitionUrl) {
          throw new Error("Competition URL is missing");
        }
      
        // Define SPARQL endpoint
        const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      
        // Define the SPARQL query with dynamic competition URL
        const sparqlQuery = `
          PREFIX schema: <https://schema.org/>
        
          SELECT ?team ?name ?photo ?comp WHERE {
            ?team a schema:SportsTeam ;
                  schema:photo ?photo ;
                  schema:name ?name ;
                  schema:memberOf <${competitionUrl}> .  # Dynamic competition URL
          }
        `;
      
        // Send request to the SPARQL endpoint
        const response = await fetch(sparqlEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            query: sparqlQuery,
          }),
        });
      
        // Handle any errors with the request
        if (!response.ok) {
          throw new Error("Failed to fetch SPARQL data");
        }
      
        // Parse the JSON response from the SPARQL query
        const data = await response.json();
      
        // Transform SPARQL JSON results into an array of objects
        const teams = data.results.bindings.map((binding) => ({
          team: binding.team.value,
          name: binding.name.value,
          photo: binding.photo.value,
          competition: binding.comp?.value || "Unknown",  // Optional competition info
        }));
      
        // Return the array of teams
        return teams;
      },      
  };
  
  export default TeamService;
  