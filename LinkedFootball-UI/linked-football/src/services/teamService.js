const TeamService = {
    async getAllTeams() {
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      const sparqlQuery = `
        PREFIX schema: <https://schema.org/>
  
        SELECT ?team ?name ?photo ?coach ?stadium ?color ?foundingDate ?location ?value ?comp ?compName WHERE {
          ?team a schema:SportsTeam ;
                schema:photo ?photo ;
                schema:name ?name ;
                schema:coach ?coach ;
                schema:StadiumOrArena ?stadium ;
                schema:color ?color ;
                schema:foundingDate ?foundingDate ;
                schema:location ?location ;
                schema:value ?value ;
                schema:memberOf ?comp .

        # Retrieve the competition's name
        ?comp schema:name ?compName .
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
        value: binding.value?.value || "0",
        competition: binding.comp?.value || "Unknown",
        compName: binding.compName?.value || "Unknown",
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

        SELECT ?team ?name ?photo ?coach ?stadium ?color ?foundingDate ?location ?value ?compName ?comp WHERE {
        ?team a schema:SportsTeam ;
                schema:photo ?photo ;
                schema:name ?name ;
                schema:coach ?coach ;
                schema:StadiumOrArena ?stadium ;
                schema:color ?color ;
                schema:foundingDate ?foundingDate ;
                schema:value ?value ;
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

      //console.log("RAW DATA", data);
    
      const teams = data.results.bindings.map((binding) => ({
        team: binding.team.value,
        name: binding.name.value,
        photo: binding.photo.value,
        coach: binding.coach?.value || "Unknown",
        stadium: binding.stadium?.value || "Unknown",
        color: binding.color?.value || "Unknown",
        foundingDate: binding.foundingDate?.value || "Unknown",
        value: binding.value?.value || "0",
        location: binding.location?.value || "Unknown",
        compName: binding.compName?.value || "Unknown",
        competition: binding.comp?.value || "Unknown",
      }));
    
      return teams;
    },

    async getAllTeamsOrdered(orderByField = "name", sortOrder = "ASC") {
    
      // Define the SPARQL endpoint
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    
      // Map JavaScript field names to SPARQL variables
      const fieldMapping = {
        name: "?name",
        coach: "?coach",
        foundingDate: "?foundingDate",
      };
    
      // Ensure the orderByField is valid
      const orderField = fieldMapping[orderByField] || "?name"; // Default to team name
      const orderDirection = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"; // Default to ASC
    
      // SPARQL query with ORDER BY clause
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
        }
        ORDER BY ${orderDirection}(${orderField})
      `;
    
      // Send the SPARQL query
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
    
      // Map the results to JavaScript objects
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

    async getTeamsByCompetitionOrdered(competition, orderByField = "name", sortOrder = "ASC") {
      const competitionUrl = competition;
      if (!competitionUrl) {
        throw new Error("Competition URL is missing");
      }
    
      // Define the SPARQL endpoint
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    
      // Map JavaScript field names to SPARQL variables
      const fieldMapping = {
        name: "?name",
        coach: "?coach",
        foundingDate: "?foundingDate",
      };
    
      // Ensure the orderByField is valid
      const orderField = fieldMapping[orderByField] || "?name"; // Default to team name
      const orderDirection = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"; // Default to ASC
    
      // SPARQL query with ORDER BY clause
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
        ORDER BY ${orderDirection}(${orderField})
      `;
    
      // Send the SPARQL query
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
    
      // Map the results to JavaScript objects
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
    }
    
  };
  
  export default TeamService;
  