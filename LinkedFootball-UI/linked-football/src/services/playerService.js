const PlayerService = {
  async getPlayersByTeamLimit(teamUrl, numberOfRows = 25, offset = 0) {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    const sparqlQuery = `
        PREFIX schema: <https://schema.org/>
  
        SELECT ?player ?name ?photo ?value ?role ?birthDate ?birthPlace ?team WHERE {
          ?player a schema:Person ;
          schema:name ?name ;
          schema:photo ?photo ;
          schema:value ?value ;
          schema:roleName ?role ;
          schema:birthDate ?birthDate ;
          schema:birthPlace ?birthPlace ;
          schema:athlete <${teamUrl}> .
        }
        LIMIT ${numberOfRows} OFFSET ${offset}
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

    const players = data.results.bindings.map((binding) => ({
      player: binding.player.value,
      name: binding.name.value,
      photo: binding.photo.value,
      value: binding.value?.value || "N/A",
      role: binding.role?.value || "N/A",
      birthDate: binding.birthDate?.value || "N/A",
      birthPlace: binding.birthPlace?.value || "N/A",
    }));

    return players;
  },

  // New function to get all players
  async getAllPlayersLimit(numberOfRows = 25, offset = 0) {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    const sparqlQuery = `
        PREFIX schema: <https://schema.org/>
  
        SELECT ?player ?name ?photo ?value ?role ?birthDate ?birthPlace WHERE {
          ?player a schema:Person ;
          schema:name ?name ;
          schema:photo ?photo ;
          schema:value ?value ;
          schema:roleName ?role ;
          schema:birthDate ?birthDate ;
          schema:birthPlace ?birthPlace .
        }
        LIMIT ${numberOfRows} OFFSET ${offset}
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

    const players = data.results.bindings.map((binding) => ({
      player: binding.player.value,
      name: binding.name.value,
      photo: binding.photo.value,
      value: binding.value?.value || "N/A",
      role: binding.role?.value || "N/A",
      birthDate: binding.birthDate?.value || "N/A",
      birthPlace: binding.birthPlace?.value || "N/A",
    }));

    return players;
  },

  // Function to get players by team with ordering
  async getPlayersByTeamOrdered(
    teamUrl,
    numberOfRows = 25,
    offset = 0,
    orderField = "name",
    orderDirection = "ASC"
  ) {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";

    // Ensure the order field is valid to prevent injection
    const validOrderFields = ["name", "value", "birthPlace", "birthDate"];
    if (!validOrderFields.includes(orderField)) {
      throw new Error("Invalid order field provided");
    }

    const sparqlQuery = `
            PREFIX schema: <https://schema.org/>
    
            SELECT ?player ?name ?photo ?value ?role ?birthDate ?birthPlace ?team WHERE {
              ?player a schema:Person ;
                      schema:name ?name ;
                      schema:photo ?photo ;
                      schema:value ?value ;
                      schema:roleName ?role ;
                      schema:birthDate ?birthDate ;
                      schema:birthPlace ?birthPlace ;
                      schema:athlete <${teamUrl}> .
            }
            ORDER BY ${orderDirection.toUpperCase()}(?${orderField})
            LIMIT ${numberOfRows} OFFSET ${offset}
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

    const players = data.results.bindings.map((binding) => ({
      player: binding.player.value,
      name: binding.name.value,
      photo: binding.photo.value,
      value: binding.value?.value || "N/A",
      role: binding.role?.value || "N/A",
      birthDate: binding.birthDate?.value || "N/A",
      birthPlace: binding.birthPlace?.value || "N/A",
    }));

    return players;
  },

  // Function to get all players with ordering
  async getAllPlayersOrdered(
    numberOfRows = 25,
    offset = 0,
    orderField = "name",
    orderDirection = "ASC"
  ) {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";

    // Ensure the order field is valid to prevent injection
    const validOrderFields = ["name", "value", "birthPlace", "birthDate"];
    if (!validOrderFields.includes(orderField)) {
      throw new Error("Invalid order field provided");
    }

    const sparqlQuery = `
            PREFIX schema: <https://schema.org/>
    
            SELECT ?player ?name ?photo ?value ?role ?birthDate ?birthPlace WHERE {
              ?player a schema:Person ;
                      schema:name ?name ;
                      schema:photo ?photo ;
                      schema:value ?value ;
                      schema:roleName ?role ;
                      schema:birthDate ?birthDate ;
                      schema:birthPlace ?birthPlace .
            }
            ORDER BY ${orderDirection.toUpperCase()}(?${orderField})
            LIMIT ${numberOfRows} OFFSET ${offset}
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

    const players = data.results.bindings.map((binding) => ({
      player: binding.player.value,
      name: binding.name.value,
      photo: binding.photo.value,
      value: binding.value?.value || "N/A",
      role: binding.role?.value || "N/A",
      birthDate: binding.birthDate?.value || "N/A",
      birthPlace: binding.birthPlace?.value || "N/A",
    }));

    return players;
  },

  async getNumberOfPlayers() {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    const sparqlQuery = `
        PREFIX schema: <https://schema.org/>
  
        SELECT (COUNT(?player) AS ?count) WHERE {
          ?player a schema:Person .
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

    return parseInt(data.results.bindings[0].count.value);
  },

  async getNumberOfPlayersByTeam(teamUrl) {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    const sparqlQuery = `
        PREFIX schema: <https://schema.org/>
  
        SELECT (COUNT(?player) AS ?count) WHERE {
          ?player a schema:Person ;
          schema:athlete <${teamUrl}> .
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

    return parseInt(data.results.bindings[0].count.value);
  },

  async getPlayersByTeam(teamUrl) {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    const sparqlQuery = `
      PREFIX schema: <https://schema.org/>
  
      SELECT ?player ?name ?photo ?value ?role ?birthDate ?birthPlace ?teamName WHERE {
        ?player a schema:Person ;
        schema:name ?name ;
        schema:photo ?photo ;
        schema:value ?value ;
        schema:roleName ?role ;
        schema:birthDate ?birthDate ;
        schema:birthPlace ?birthPlace ;
        schema:athlete <${teamUrl}> .
        
        # Retrieve the team's name
        <${teamUrl}> schema:name ?teamName .
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
  
    const groupedPlayers = {};
  
    // Iterate over the bindings to group players by their URI
    data.results.bindings.forEach((binding) => {
      const playerUri = binding.player.value;
  
      // Initialize player object if it doesn't exist
      if (!groupedPlayers[playerUri]) {
        groupedPlayers[playerUri] = {
          player: playerUri,
          name: binding.name.value,
          photo: binding.photo.value,
          value: binding.value?.value || "N/A",
          role: binding.role?.value || "N/A",
          roleUri: "", // Initialize as empty
          birthDate: binding.birthDate?.value || "N/A",
          birthPlace: "", // Initialize as empty
          birthPlaceUri: "", // Initialize as empty
          team: teamUrl,
          teamName: binding.teamName?.value || "N/A",
        };
      }
  
      // Now, merge birthPlace and birthPlaceUri
      if (binding.birthPlace) {
        if (binding.birthPlace.type === "literal") {
          // If it's a literal, set the birthPlace
          groupedPlayers[playerUri].birthPlace = binding.birthPlace.value;
        } else if (binding.birthPlace.type === "uri") {
          // If it's a URI, set the birthPlaceUri
          groupedPlayers[playerUri].birthPlaceUri = binding.birthPlace.value;
        }
      }
      if (binding.role) {
        if (binding.role.type === "literal") {
          // If it's a literal, set the role
          groupedPlayers[playerUri].role = binding.role.value;
        } else if (binding.role.type === "uri") {
          // If it's a URI, set the roleUri
          groupedPlayers[playerUri].roleUri = binding.role.value;
        }
      }
    });
  
    // Convert grouped players object to an array
    const players = Object.values(groupedPlayers);
  
    return players;
  },  

  // New function to get all players
  async getAllPlayers() {
    const sparqlEndpoint = "http://localhost:3030/LinkedFootball/query";
    const sparqlQuery = `
      PREFIX schema: <https://schema.org/>
  
      SELECT ?player ?name ?photo ?value ?role ?birthDate ?birthPlace ?team ?teamName WHERE {
        ?player a schema:Person ;
        schema:name ?name ;
        schema:photo ?photo ;
        schema:value ?value ;
        schema:roleName ?role ;
        schema:birthDate ?birthDate ;
        schema:birthPlace ?birthPlace ;
        schema:athlete ?team .
  
        # Retrieve the team's name
        ?team schema:name ?teamName .
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
  
    const groupedPlayers = {};
  
    // Iterate over the bindings to group players by their URI
    data.results.bindings.forEach((binding) => {
      const playerUri = binding.player.value;
  
      // Initialize player object if it doesn't exist
      if (!groupedPlayers[playerUri]) {
        groupedPlayers[playerUri] = {
          player: playerUri,
          name: binding.name.value,
          photo: binding.photo.value,
          value: binding.value?.value || "N/A",
          role: binding.role?.value || "N/A",
          roleUri: "", // Initialize as empty
          birthDate: binding.birthDate?.value || "N/A",
          birthPlace: "", // Initialize as empty
          birthPlaceUri: "", // Initialize as empty
          team: binding.team.value,
          teamName: binding.teamName?.value || "N/A",
        };
      }
  
      // Merge birthPlace and birthPlaceUri
      if (binding.birthPlace) {
        if (binding.birthPlace.type === "literal") {
          groupedPlayers[playerUri].birthPlace = binding.birthPlace.value;
        } else if (binding.birthPlace.type === "uri") {
          groupedPlayers[playerUri].birthPlaceUri = binding.birthPlace.value;
        }
      }
  
      // Merge role and roleUri
      if (binding.role) {
        if (binding.role.type === "literal") {
          groupedPlayers[playerUri].role = binding.role.value;
        } else if (binding.role.type === "uri") {
          groupedPlayers[playerUri].roleUri = binding.role.value;
        }
      }
    });
  
    // Convert grouped players object to an array
    const players = Object.values(groupedPlayers);
  
    return players;
  },  
};

export default PlayerService;
