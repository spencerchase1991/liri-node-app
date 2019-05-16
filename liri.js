require("dotenv").config();

import { spotify as _spotify } from "./keys.js";

var spotify = new Spotify(_spotify);

