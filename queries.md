# SPARQL Queries

### Get all competitions, with their id, name, location and photo

```
PREFIX schema: <https://schema.org/> 

SELECT ?competition ?name ?location ?photo ?start_date ?end_date WHERE {
  ?competition a schema:SportsOrganization ;
  schema:photo ?photo ;
  schema:name ?name ;
  schema:location ?location ;
  schema:startDate ?start_date ;
  schema:endDate ?end_date .
}
```


### Get all teams that participate in a competition

```
PREFIX schema: <https://schema.org/> 

SELECT ?team ?name ?photo ?comp WHERE {
  ?team a schema:SportsTeam ;
  schema:photo ?photo ;
  schema:name ?name ;
  schema:memberOf ?comp .
}

```

### Get all players that participate in a team

```
PREFIX schema: <https://schema.org/> 

SELECT ?player ?name ?photo ?role ?team WHERE {
  ?player a schema:Person ;
  schema:photo ?photo ;
  schema:name ?name ;
  schema:roleName ?role ;
  schema:athlete ?team .
}
```

### Get a team full information

```
PREFIX schema: <https://schema.org/> 

SELECT ?team ?name ?photo ?coach ?stadium ?color ?foundingDate ?location ?competition WHERE {
  ?team a schema:SportsTeam ;
  schema:name ?name ;
  schema:photo ?photo ;
  schema:coach ?coach ;
  schema:StadiumOrArena ?stadium ;
  schema:color ?color ;
  schema:foundingDate ?foundingDate ;
  schema:location ?location ;
  schema:memberOf ?competition .
}
```	

### Get a player full information

```
PREFIX schema: <https://schema.org/> 

SELECT ?player ?name ?photo ?value ?role ?birthDate ?birthPlace ?team WHERE {
  ?player a schema:Person ;
  schema:name ?name ;
  schema:photo ?photo ;
  schema:value ?value ;
  schema:roleName ?role ;
  schema:birthDate ?birthDate ;
  schema:birthPlace ?birthPlace ;
  schema:athlete ?team .
}
```



