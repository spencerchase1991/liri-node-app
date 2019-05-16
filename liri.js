require("dotenv").config();

var spotify = new Spotify(_spotify);

require("dotenv").config();

var keys = require("./keys.js");

var inquirer = require("inquirer");

var axios = require("axios");

var moment = require("moment");

var fs = require("fs");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

function startingPrompt() {
	inquirer.prompt([
		{
			type: "list",
			message: "Which feature would you like to use?",
			choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
			name: "command"

		}
	]).then(function (response) {

		if (response.command === "concert-this") {
			searchConcert(false, null);
		}
		else if (response.command === "spotify-this-song") {
			searchSpotify(false, null);
		}
		else if (response.command === "movie-this") {
			searchMovie(false, null);
		}
		else if (response.command === "do-what-it-says") {
			doWhat();
		}
	});
}

function confirmationPrompt() {
	inquirer.prompt([
		{
			type: "confirm",
			message: "Would you like to make another search? ",
			name: "confirm",
			default: false
		}
	]).then(function (response) {
		if (response.confirm) {
			startingPrompt();
		}
		else {
			return;
		}
	});
}

function doWhat() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		if (error) {
			return console.log(error);
		}

		var dataArr = data.split(",");

		switch (dataArr[0]) {
			case "concert-this":
				searchConcert(true, dataArr[1]);
				break;

			case "spotify-this-song":
				searchSpotify(true, dataArr[1]);
				break;

			case "movie-this":
				searchMovie(true, dataArr[1]);
				break;

			default:
				break;
		}
	});
}

function searchConcert(hasVal, value) {

	if (hasVal) {
		search("Concert", value);
	}
	else {
		inquirer.prompt([
			{
				type: "input",
				message: "What artist would you like to search for? ",
				name: "artist"
			}
		]).then(function (response) {
			search("Concert", response.artist);
		});
	};
};

function searchSpotify(hasVal, value) {

	if (hasVal) {
		search("Spotify", value);
	}
	else {
		inquirer.prompt([
			{
				type: "input",
				message: "What song would you like to search for? ",
				name: "artist"
			}
		]).then(function (response) {
			search("Spotify", response.artist)
		});
	};
}

function searchMovie(hasVal, value) {

	if (hasVal) {
		search("Movie", value);
	}
	else {
		inquirer.prompt([
			{
				type: "input",
				message: "What movie would you like to search for? ",
				name: "movie"
			}
		]).then(function (response) {
			search("Movie", response.movie)
		});
	}
}

function search(type, value) {

	var divider = "\n\r-----------------------------------------------------------\n\r";

	switch (type) {
		case "Concert":
			var url = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
			axios.get(url).then(function (axiosResponse) {

				console.log(divider);

				for (var i = 0; i < axiosResponse.data.length; i++) {

					var showData = [
						"Venue Name: " + axiosResponse.data[i].venue.name,
						"venue Location: " + axiosResponse.data[i].venue.city + ", " + axiosResponse.data[i].venue.country,
						"Date of Event: " + moment(axiosResponse.data[i].datetime).format("MM/DD/YYYY"),
					].join("\n");

					console.log(showData);
					console.log(divider);
				}

				writeLog(showData, divider);
				confirmationPrompt();
			});
			break;

		case "Spotify":
			spotify.search({ type: 'track', query: value }, function (err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}

				console.log(divider);

				for (var i = 0; i < data.tracks.items.length; i++) {

					var showData = [
						"Artist: " + data.tracks.items[i].artists[0].name,
						"Track Name: " + data.tracks.items[i].name,
						"Spotify Link: " + data.tracks.items[i].external_urls.spotify,
						"Album: " + data.tracks.items[i].album.name
					].join('\n');

					console.log(showData);
					console.log(divider);
				}

				writeLog(showData, divider);
				confirmationPrompt();
			});
			break;

		case "Movie":
			var movie = value.replace(" ", "+");

			var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&apikey=trilogy";
			axios.get(url).then(function (axiosResponse) {

				console.log(divider);

				var showData = [
					"Title: " + axiosResponse.data.Title,
					"Release Year: " + axiosResponse.data.Year,
					"IMDB Rating: " + axiosResponse.data.Ratings[0].Value,
					"Rotten Tomatoes Rating: " + axiosResponse.data.Ratings[1].Value,
					"Country Produced: " + axiosResponse.data.Country,
					"Language : " + axiosResponse.data.Language,
					"Actors: " + axiosResponse.data.Actors,
					divider,
					axiosResponse.data.Plot
				].join('\n');

				console.log(showData);
				console.log(divider);

				writeLog(showData, divider);
				confirmationPrompt();
			});
			break;
		default:
			break;
	};

}

function writeLog(data, divider) {
	fs.appendFile("log.txt", data + divider, function (err) {

		// If the code experiences any errors it will log the error to the console.
		if (err) {
			return console.log(err);
		}
	});
}

startingPrompt();