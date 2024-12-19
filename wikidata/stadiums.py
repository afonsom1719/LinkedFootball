import requests
import pandas as pd

def fetch_stadiums_for_league(league_id, league_name):
    endpoint_url = "https://query.wikidata.org/sparql"
    query = f"""
    SELECT DISTINCT ?team ?teamLabel ?stadium ?stadiumLabel WHERE {{
      ?team wdt:P31 wd:Q476028;  # Instances of "association football club"
            wdt:P118 wd:{league_id};  # Member of the specified league
            wdt:P115 ?stadium.       # Has stadium (P115)
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    response = requests.get(endpoint_url, params={'query': query, 'format': 'json'})
    
    if response.status_code == 200:
        results = response.json()
        stadiums = [
            {
                'league': league_name,
                'team': item['teamLabel']['value'],
                'team_uri': item['team']['value'],
                'stadium': item.get('stadiumLabel', {}).get('value', 'Unknown'),
                'stadium_uri': item.get('stadium', {}).get('value', 'Unknown')
            }
            for item in results['results']['bindings']
        ]
        return stadiums
    else:
        raise Exception(f"SPARQL query failed for {league_name} with code {response.status_code}")

leagues = [
    {"name": "Liga Portugal", "id": "Q182994"},
    {"name": "Premier League", "id": "Q9448"},
    {"name": "Bundesliga", "id": "Q82595"},
    {"name": "La Liga", "id": "Q324867"},
    {"name": "Serie A", "id": "Q15804"}
]

all_stadiums = []
for league in leagues:
    print(f"Fetching stadiums for {league['name']}...")
    stadiums = fetch_stadiums_for_league(league['id'], league['name'])
    all_stadiums.extend(stadiums)

df = pd.DataFrame(all_stadiums)
df.to_csv("stadiums_uris.csv", index=False)
print("Stadiums per league saved to stadiums_uris.csv")
