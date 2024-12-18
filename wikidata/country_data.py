import requests
import pandas as pd

def fetch_all_countries():
    endpoint_url = "https://query.wikidata.org/sparql"
    query = """
    SELECT ?country ?countryLabel WHERE {
      ?country wdt:P31 wd:Q6256.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    """
    response = requests.get(endpoint_url, params={'query': query, 'format': 'json'})
    
    if response.status_code == 200:
        results = response.json()
        countries = [
            {'name': item['countryLabel']['value'], 'uri': item['country']['value']}
            for item in results['results']['bindings']
        ]
        return countries
    else:
        raise Exception(f"SPARQL query failed with code {response.status_code}")

countries_data = fetch_all_countries()
df = pd.DataFrame(countries_data)
df.to_csv("countries_with_uris.csv", index=False)
print("Country data saved to countries_with_uris.csv")
