import requests
import pandas as pd

def fetch_coaches_for_league(league_id, league_name):
    endpoint_url = "https://query.wikidata.org/sparql"
    query = f"""
    SELECT DISTINCT ?team ?teamLabel ?coach ?coachLabel WHERE {{
      ?team wdt:P31 wd:Q476028;  # Instances of "association football club"
            wdt:P118 wd:{league_id};  # Member of the specified league
            wdt:P286 ?coach.         # Has head coach (P286)
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    response = requests.get(endpoint_url, params={'query': query, 'format': 'json'})
    
    if response.status_code == 200:
        results = response.json()
        coaches = [
            {
                'league': league_name,
                'team': item['teamLabel']['value'],
                'team_uri': item['team']['value'],
                'coach': item.get('coachLabel', {}).get('value', 'Unknown'),
                'coach_uri': item.get('coach', {}).get('value', 'Unknown')
            }
            for item in results['results']['bindings']
        ]
        return coaches
    else:
        raise Exception(f"SPARQL query failed for {league_name} with code {response.status_code}")

leagues = [
    {"name": "Liga Portugal", "id": "Q182994"},
    {"name": "Premier League", "id": "Q9448"},
    {"name": "Bundesliga", "id": "Q82595"},
    {"name": "La Liga", "id": "Q324867"},
    {"name": "Serie A", "id": "Q15804"}
]

all_coaches = []
for league in leagues:
    print(f"Fetching coaches for {league['name']}...")
    coaches = fetch_coaches_for_league(league['id'], league['name'])
    all_coaches.extend(coaches)

df = pd.DataFrame(all_coaches)
df.to_csv("coaches_uris.csv", index=False)
print("Coaches per league saved to coaches_uris.csv")