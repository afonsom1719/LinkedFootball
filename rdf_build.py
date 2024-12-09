import csv
import os

# Define namespaces and base URI
SCHEMA = "https://schema.org/"
BASE_URI = "http://example.org/clubs/"

# Generate unique club ID
def generate_club_id(club_name):
    return club_name.replace(" ", "_").replace(",", "").replace(".", "").replace("&", "and")

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

# Append new details to RDF
def append_details_to_rdf(value_csv, details_csv, rdf_file):
    # Read existing triples
    existing_triples = read_existing_triples(rdf_file)

    # Initialize RDF file with prefixes if it doesn't exist
    if not os.path.exists(rdf_file):
        with open(rdf_file, mode="w", encoding="utf-8") as rdf:
            rdf.write(f"@prefix schema: <{SCHEMA}> .\n")
            rdf.write(f"@prefix : <{BASE_URI}> .\n\n")

    # Process club values CSV
    club_values = {}
    with open(value_csv, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            club_id = generate_club_id(row["Club"])
            club_values[club_id] = row["Value"]

    # Process additional details CSV
    with open(details_csv, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        new_content = []
        for row in reader:
            club_id = generate_club_id(row["Name"])
            subject = f":{club_id}"
            properties = []

            # Add properties from values CSV
            if club_id in club_values and (
                subject not in existing_triples or "schema:value" not in existing_triples[subject]
            ):
                properties.append(f"    schema:value \"{club_values[club_id]}\"^^<http://www.w3.org/2001/XMLSchema#integer>")

            # Add properties from details CSV
            def add_property_if_new(prop, value):
                if subject not in existing_triples or f"schema:{prop}" not in existing_triples[subject]:
                    properties.append(f"    schema:{prop} {value}")

            add_property_if_new("photo", f"<{row['Crest']}>")
            add_property_if_new("coach", f"\"{row['Coach']}\"")
            add_property_if_new("StadiumOrArena", f"\"{row['Stadium']}\"")
            add_property_if_new("color", f"\"{row['Colors']}\"")
            add_property_if_new("foundingDate", f"\"{row['Foundation']}\"")
            add_property_if_new("location", f"\"{row['Address']}\"")
            add_property_if_new("memberOf", f"\"{row['CompetitionId']}\"")

            if properties:
                # Combine properties for the subject
                club_block = f"{subject} a schema:SportsTeam ;\n" + " ;\n".join(properties) + " .\n\n"
                new_content.append(club_block)

        # Append the new content to the RDF file
        if new_content:
            with open(rdf_file, mode="a", encoding="utf-8") as rdf:
                rdf.writelines(new_content)
            print(f"Added details for {len(new_content)} clubs.")
        else:
            print("No new details to add.")

# Example usage
value_csv = "tm_values/ES1_club_values.csv"  # Replace with your values CSV filename
details_csv = "data/competition_teams_PD.csv"  # Replace with your details CSV filename
rdf_file = "clubs.ttl"
append_details_to_rdf(value_csv, details_csv, rdf_file)

print(f"Details from {value_csv} and {details_csv} have been added to {rdf_file}.")
