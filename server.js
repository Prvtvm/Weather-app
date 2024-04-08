const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser"); // Import body-parser middleware
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the public folder as static files
app.use(express.static("public"));

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// GeoNames API username
const geoNamesUsername = "pkjres";

// Render the index template with default values for weather and error
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

// Handle the /weather route with POST method
app.post("/weather", async (req, res) => {
  // Get the city name from the request body
  let city = req.body.city;

  // Check if city is undefined or empty
  if (!city) {
    res.render("index", { weather: null, error: "City name is required" });
    return;
  }

  const apiKey = "b0c8b682cb39fa57bbd2b45354df6d73"; // Replace with your OpenWeatherMap API key

  try {
    // Fetch city details from GeoNames API
    const geoNamesUrl = `http://api.geonames.org/searchJSON?name_equals=${city}&maxRows=1&username=${geoNamesUsername}`;
    const geoNamesResponse = await axios.get(geoNamesUrl);

    // Extract city name from GeoNames response
    const cityName = geoNamesResponse.data.geonames[0].name;

    // Get weather data from OpenWeatherMap API
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    const weatherResponse = await axios.get(openWeatherUrl);

    // Extract weather data from OpenWeatherMap response
    const weather = weatherResponse.data;

    // Render the index template with the weather data and error message
    res.render("index", { weather, error: null });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.render("index", { weather: null, error: "Error fetching weather data. Please try again later." });
  }
});

// Start the server and listen on port 3000 or the value of the PORT environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
