import requests
import pandas as pd

def fetch_all_positions():
    endpoint_url = "https://query.wikidata.org/sparql"
    query = """
    SELECT DISTINCT ?position ?positionLabel WHERE {
      ?position wdt:P31 wd:Q4611891.  # P31 = instance of; Q4611891 = association football position
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    """
    response = requests.get(endpoint_url, params={'query': query, 'format': 'json'})
    
    if response.status_code == 200:
        results = response.json()
        positions = [
            {'name': item['positionLabel']['value'], 'uri': item['position']['value']}
            for item in results['results']['bindings']
        ]
        return positions
    else:
        raise Exception(f"SPARQL query failed with code {response.status_code}")

positions_data = fetch_all_positions()
df = pd.DataFrame(positions_data)
df.to_csv("positions_with_uris.csv", index=False)
print("Football positions data saved to positions_with_uris.csv")
