import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const FUSEKI_QUERY_ENDPOINT = "http://localhost:3030/LinkedFootball/query";

const EntityPageMinimal = () => {
  const { entity } = useParams(); // Extract entity from the URL
  const [rdfData, setRdfData] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRdfData = async () => {
      const entityUri = `http://localhost:3030/LinkedFootball/${entity}`;
      const sparqlQuery = `
        DESCRIBE <${entityUri}>
      `;

      try {
        const response = await fetch(FUSEKI_QUERY_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ query: sparqlQuery }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch RDF data.");
        }

        const data = await response.text();
        setRdfData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRdfData();
  }, [entity]);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <pre>{rdfData}</pre>
    </div>
  );
};

export default EntityPageMinimal;
