Make sure npm 18 is installed.
Run command 'npm install'
?Run command 'npm run setup'
Run command 'npm start'
Use end points

PUT: /deck/{idToUpdate}:
    Only update name and description
        Object:
            {
	            "name": "Updated Pokemon Deck",
	            "description": "An updated Deck"
            }




Example Object:
{
  "name": "Second Seeding Pokemon Deck",
  "description": "Second Deck",
  "cards": [
    {
      "hp": 90,
      "name": "Squirtle",
      "description": "A water type Pokemon with a turtle-like appearance.",
      "type": "Water"
    },
    {
      "hp": 80,
      "name": "Bulbasaur",
      "description": "A grass/poison type Pokemon with a bulb on its back.",
      "type": "Grass/Poison"
    },
    {
      "hp": 110,
      "name": "Charmander",
      "description": "A fire type Pokemon with a fiery tail.",
      "type": "Fire"
    }
  ]
}