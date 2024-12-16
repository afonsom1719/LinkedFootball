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
  
      // Transform SPARQL JSON results into an array of objects
      const competitions = data.results.bindings.map((binding) => ({
        name: binding.name.value,
        location: binding.location.value,
        photo: binding.photo.value,
        start_date: binding.start_date.value,
        end_date: binding.end_date.value,
      }));
  
      return competitions;
    },
  };
  
  export default CompetitionService;
  