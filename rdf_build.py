import csv
import os

# Define namespaces and base URI
SCHEMA = "https://schema.org/"
BASE_URI = "http://example.org/"

# Generate unique IDs
def generate_id(name, context=""):
    return f"{context}_{name}".replace(" ", "_").replace(",", "").replace(".", "").replace("&", "and")

# Read existing triples from RDF to check for duplicates
def read_existing_triples(rdf_file):
    if not os.path.exists(rdf_file):
        return {}
    triples = {}
    with open(rdf_file, mode="r", encoding="utf-8") as rdf:
        current_subject = None
        for line in rdf:
            line = line.strip()
            if line.startswith(":"):
                current_subject = line.split()[0]
                triples[current_subject] = []
            elif line.startswith("schema:") and current_subject:
                triples[current_subject].append(line.split()[0])
    return triples

# Append club and player details to RDF
def append_details_to_rdf(club_values_csv, club_details_csv, player_values_csv, player_details_csv, competitions_csv, rdf_file):
    # Read existing triples
    existing_triples = read_existing_triples(rdf_file)

    # Initialize RDF file with prefixes if it doesn't exist
    if not os.path.exists(rdf_file):
        with open(rdf_file, mode="w", encoding="utf-8") as rdf:
            rdf.write(f"@prefix schema: <{SCHEMA}> .\n")
            rdf.write(f"@prefix : <{BASE_URI}> .\n\n")

    new_content = []
    club_ids = []  # To store all club IDs for consolidation

    # Process club details CSV
    with open(club_details_csv, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            club_id = generate_id(row["Name"], "club")
            subject = f":{club_id}"
            club_ids.append(subject)

            properties = []
            def add_property_if_new(prop, value):
                if subject not in existing_triples or f"schema:{prop}" not in existing_triples[subject]:
                    properties.append(f"    schema:{prop} {value}")

            add_property_if_new("photo", f"<{row['Crest']}>")
            add_property_if_new("coach", f"\"{row['Coach']}\"")
            add_property_if_new("StadiumOrArena", f"\"{row['Stadium']}\"")
            add_property_if_new("color", f"\"{row['Colors']}\"")
            add_property_if_new("foundingDate", f"\"{row['Foundation']}\"")
            add_property_if_new("location", f"\"{row['Address']}\"")

            if properties:
                club_block = f"{subject} ;\n" + " ;\n".join(properties) + " .\n\n"
                new_content.append(club_block)

    # Consolidate shared properties for clubs
    if club_ids:
        consolidated_block = f"{' '.join(club_ids)}\n    a schema:SportsTeam ;\n    schema:memberOf {row['CompetitionId']} .\n\n"
        new_content.insert(0, consolidated_block)

    # Process player values CSV
    player_values = {}
    with open(player_values_csv, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            player_id = generate_id(row["Player"])
            player_values[player_id] = {
                "value": row["Market Value"],
                "photo": row["TmPictureLink"]
            }

    # Process player details CSV
    with open(player_details_csv, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            player_id = generate_id(row["Name"])
            subject = f":{player_id}"
            properties = []

            # Add properties from player values CSV
            if player_id in player_values:
                if subject not in existing_triples or "schema:value" not in existing_triples[subject]:
                    properties.append(
                        f"    schema:value \"{player_values[player_id]['value']}\"^^<http://www.w3.org/2001/XMLSchema#integer>"
                    )
                if subject not in existing_triples or "schema:photo" not in existing_triples[subject]:
                    properties.append(f"    schema:photo <{player_values[player_id]['photo']}>")

            # Add properties from player details CSV
            def add_property_if_new(prop, value):
                if subject not in existing_triples or f"schema:{prop}" not in existing_triples[subject]:
                    properties.append(f"    schema:{prop} {value}")

            add_property_if_new("name", f"\"{row['Name']}\"")
            add_property_if_new("roleName", f"\"{row['Position']}\"")
            add_property_if_new("birthDate", f"\"{row['Date of Birth']}\"^^<http://www.w3.org/2001/XMLSchema#date>")
            add_property_if_new("birthPlace", f"\"{row['Country']}\"")
            add_property_if_new("athlete", f":{generate_id(row['Team'], 'club')}")

            if properties:
                player_block = f"{subject} a schema:Person ;\n" + " ;\n".join(properties) + " .\n\n"
                new_content.append(player_block)

    with open(competitions_csv, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            print(row)
            competition_id = generate_id(row[" name"], "competition")
            subject = f":{competition_id}"
            properties = [
                f"    schema:name \"{row[' name']}\"",
                f"    schema:location \"{row[' country']}\"",
                f"    schema:photo <{row[' logo']}>",
                f"    schema:startDate \"{row[' startdate']}\"^^<http://www.w3.org/2001/XMLSchema#date>",
                f"    schema:endDate \"{row[' enddate']}\"^^<http://www.w3.org/2001/XMLSchema#date>"
            ]
            competition_block = f"{subject} a schema:SportsOrganization ;\n" + " ;\n".join(properties) + " .\n\n"
            new_content.append(competition_block)

    # Append the new content to the RDF file
    if new_content:
        with open(rdf_file, mode="a", encoding="utf-8") as rdf:
            rdf.writelines(new_content)
        print(f"Added details for {len(new_content)} new entities.")
    else:
        print("No new details to add.")

# Example usage
club_values_csv = "tm_values/PO1_club_values.csv"  # Replace with your club values CSV filename
club_details_csv = "data/competition_teams_PPL.csv"  # Replace with your club details CSV filename
player_values_csv = "tm_values/PO1_players_data.csv"  # Replace with your player values CSV filename
player_details_csv = "data/competition_players_PPL.csv"  # Replace with your player details CSV filename
competitions_csv = "data/competitions.csv"
rdf_file = "sports_data.ttl"  # Unified RDF file for clubs and players

append_details_to_rdf(club_values_csv, club_details_csv, player_values_csv, player_details_csv, competitions_csv, rdf_file)

print(f"Details from all CSVs have been merged into {rdf_file}.")
