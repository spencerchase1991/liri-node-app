# liri-node-app

## About
LIRI is a Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

### Motivation
This is a project where we are learning to implement node.js.

### What it does

#### Spotify

node liri.js spotify-this-song <insert song title>
This will show the following information about the song in your terminal/bash window
  
  - Artist(s)
  - The song's name
  - A preview link of the song from Spotify
  - The album that the song is from
  
If no song is provided, then your program will default to "The Sign" by Ace of Base

#### Movies

node liri.js movie-this <insert movie title>
This will output the following information to your terminal/bash window:
  
  - Title of the movie.
  - Year the movie came out.
  
  ![move-this](https://user-images.githubusercontent.com/47365435/57953266-d6810b00-78ac-11e9-8c5f-b44bd89723a9.PNG)
  

#### Do What It Says

node liri.js do-what-it-says
Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
Right now it will run spotify-this-song for "I Want It That Way".
