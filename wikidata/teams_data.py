import requests
import pandas as pd

def fetch_teams_for_league(league_id, league_name):
    endpoint_url = "https://query.wikidata.org/sparql"
    query = f"""
    SELECT DISTINCT ?team ?teamLabel WHERE {{
      ?team wdt:P31 wd:Q476028;
            wdt:P118 wd:{league_id}.
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    response = requests.get(endpoint_url, params={'query': query, 'format': 'json'})
    
    if response.status_code == 200:
        results = response.json()
        teams = [
            {'league': league_name, 'team': item['teamLabel']['value'], 'uri': item['team']['value']}
            for item in results['results']['bindings']
        ]
        return teams
    else:
        raise Exception(f"SPARQL query failed for {league_name} with code {response.status_code}")

leagues = [
    {"name": "Liga Portugal", "id": "Q182994"},
    {"name": "Premier League", "id": "Q9448"},
    {"name": "Bundesliga", "id": "Q82595"},
    {"name": "La Liga", "id": "Q324867"},
    {"name": "Serie A", "id": "Q15804"}
]

all_teams = []
for league in leagues:
    print(f"Fetching teams for {league['name']}...")
    teams = fetch_teams_for_league(league['id'], league['name'])
    all_teams.extend(teams)

df = pd.DataFrame(all_teams)
df.to_csv("teams_uris.csv", index=False)
print("Teams per league saved to teams_uris.csv")
