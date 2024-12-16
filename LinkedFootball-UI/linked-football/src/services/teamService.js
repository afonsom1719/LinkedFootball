const TeamService = {
    async getAllTeams() {
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      const sparqlQuery = `
        PREFIX schema: <https://schema.org/>
  
        SELECT ?team ?name ?photo ?coach ?stadium ?color ?foundingDate ?location ?comp WHERE {
          ?team a schema:SportsTeam ;
                schema:photo ?photo ;
                schema:name ?name ;
                schema:coach ?coach ;
                schema:StadiumOrArena ?stadium ;
                schema:color ?color ;
                schema:foundingDate ?foundingDate ;
                schema:location ?location ;
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
        coach: binding.coach?.value || "Unknown",
        stadium: binding.stadium?.value || "Unknown",
        color: binding.color?.value || "Unknown",
        foundingDate: binding.foundingDate?.value || "Unknown",
        location: binding.location?.value || "Unknown",
        competition: binding.comp?.value || "Unknown",
      }));
    
      return teams;
    },
  
    async getTeamsByCompetition(competition) {
      const competitionUrl = competition;
      if (!competitionUrl) {
        throw new Error("Competition URL is missing");
      }
    
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      const sparqlQuery = `
        PREFIX schema: <https://schema.org/>

        SELECT ?team ?name ?photo ?coach ?stadium ?color ?foundingDate ?location ?compName WHERE {
        ?team a schema:SportsTeam ;
                schema:photo ?photo ;
                schema:name ?name ;
                schema:coach ?coach ;
                schema:StadiumOrArena ?stadium ;
                schema:color ?color ;
                schema:foundingDate ?foundingDate ;
                schema:location ?location ;
                schema:memberOf ?comp .

        # Retrieve the competition's name
        ?comp schema:name ?compName .
        
        # Filter for the specific competition URL
        FILTER (?comp = <${competitionUrl}>)
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

      console.log("RAW DATA", data);
    
      const teams = data.results.bindings.map((binding) => ({
        team: binding.team.value,
        name: binding.name.value,
        photo: binding.photo.value,
        coach: binding.coach?.value || "Unknown",
        stadium: binding.stadium?.value || "Unknown",
        color: binding.color?.value || "Unknown",
        foundingDate: binding.foundingDate?.value || "Unknown",
        location: binding.location?.value || "Unknown",
        compName: binding.compName?.value || "Unknown",
      }));
    
      return teams;
    },
  };
  
  export default TeamService;
  