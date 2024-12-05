import requests
from bs4 import BeautifulSoup
import csv

def scrape_transfermarkt_competition(url):
    # Define competition name from the url to be used in the CSV file naming
    competition_name = url.split('/')[-1]

    # Define headers for the requests
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }

    # Step 1: Fetch the competition page
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Step 2: Extract clubs' names and URLs
    clubs = soup.find_all('td', class_='hauptlink no-border-links')
    clubs_list = []
    for club in clubs:
        club_name = club.find('a').text
        club_url = club.find('a')['href']
        clubs_list.append([club_name, 'https://www.transfermarkt.co.uk' + club_url])

    # Step 3: Fetch and clean club values
    club_values = {}
    for club in clubs_list:
        club_name, club_url = club
        club_response = requests.get(club_url, headers=headers)
        club_soup = BeautifulSoup(club_response.text, 'html.parser')
        club_value = club_soup.find('a', class_='data-header__market-value-wrapper').text
        if club_value:
            club_value = club_value.replace('Total market value', '').replace('€', '').replace('\n', '').replace(' ', '')
            if 'bn' in club_value:
                club_value = float(club_value.replace('bn', '')) * 1_000_000_000
            elif 'm' in club_value:
                club_value = float(club_value.replace('m', '')) * 1_000_000
            else:
                club_value = club_value
        else:
            club_value = 0
        club_values[club_name] = int(club_value)

    # Export club values to a CSV
    teams_csv_name = competition_name + '_club_values.csv'
    with open(teams_csv_name, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Club', 'Value'])
        for club, value in club_values.items():
            writer.writerow([club, value])

    # Step 4: Fetch and clean player data
    players_dict = {}
    for club in clubs_list:
        club_name, club_url = club
        club_response = requests.get(club_url, headers=headers)
        club_soup = BeautifulSoup(club_response.text, 'html.parser')
        players = club_soup.find_all('tr', class_=['odd', 'even'])
        for player in players:
            player_name = player.find('a').text
            player_value = player.find_all('td')[-1].text.strip()
            players_dict[player_name] = [club_name, player_value]

    # Clean player data
    cleaned_players_dict = {}
    for player, details in players_dict.items():
        player_name = player.strip()
        club_name = details[0].strip()
        market_value = details[1].replace('€', '').replace(' ', '')
        if 'm' in market_value:
            market_value = int(float(market_value.replace('m', '')) * 1_000_000)
        elif 'k' in market_value:
            market_value = int(float(market_value.replace('k', '')) * 1_000)
        elif market_value == '-':
            market_value = 0
        else:
            market_value = 0
        cleaned_players_dict[player_name] = [club_name, market_value]

    # Export player data to a CSV
    players_csv_name = competition_name + '_players_data.csv'
    with open(players_csv_name, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Player', 'Club', 'Market Value'])
        for player, details in cleaned_players_dict.items():
            writer.writerow([player, details[0], details[1]])

    print("Scraping complete. Data exported to 'club_values.csv' and 'players_data.csv'.")
