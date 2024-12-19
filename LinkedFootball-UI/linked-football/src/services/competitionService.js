const CompetitionService = {
    async getCompetitions() {
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      const sparqlQuery = `
        PREFIX schema: <https://schema.org/> 
  
        SELECT ?competition ?name ?location ?photo ?start_date ?end_date WHERE {
          ?competition a schema:SportsOrganization ;
          schema:photo ?photo ;
          schema:name ?name ;
          schema:location ?location ;
          schema:startDate ?start_date ;
          schema:endDate ?end_date .
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
  
      // Transform SPARQL JSON results into an array of objects
      const competitions = data.results.bindings.map((binding) => ({
        competition: binding.competition.value,
        name: binding.name.value,
        location: binding.location.value,
        photo: binding.photo.value,
        start_date: binding.start_date.value,
        end_date: binding.end_date.value,
      }));
  
      return competitions;
    },




    async getCompetitions2() {
      const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query"; 
      const sparqlQuery = `
        PREFIX schema: <https://schema.org/> 
      
        SELECT ?competition ?name ?location ?photo ?start_date ?end_date ?wikiDataCompUri WHERE {
          ?competition a schema:SportsOrganization ;
          schema:photo ?photo ;
          schema:name ?name ;
          schema:location ?location ;
          schema:startDate ?start_date ;
          schema:endDate ?end_date ;
          schema:sameAs ?wikiDataCompUri .
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
    
      const groupedCompetitions = {};
    
      // Iterate over the bindings to group competitions by their URI
      data.results.bindings.forEach((binding) => {
        const competitionUri = binding.competition.value;
    
        if (!groupedCompetitions[competitionUri]) {
          groupedCompetitions[competitionUri] = {
            competition: competitionUri,
            name: binding.name.value,
            photo: binding.photo.value,
            start_date: binding.start_date.value,
            end_date: binding.end_date.value,
            location: "", // Initialize as empty
            locationUri: "", // Initialize as empty
            wikiDataCompUri: binding.wikiDataCompUri.value,
          };
        }
    
        // Merge location and locationUri
        if (binding.location) {
          if (binding.location.type === "literal") {
            groupedCompetitions[competitionUri].location = binding.location.value;
          } else if (binding.location.type === "uri") {
            groupedCompetitions[competitionUri].locationUri = binding.location.value;
          }
        }
      });
    
      // Convert grouped competitions object to an array
      const competitions = Object.values(groupedCompetitions);
    
      return competitions;
    },
    
    


  };
  
  export default CompetitionService;
  