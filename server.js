// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "newsScraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route
app.get("/", function(req, res) {
  res.send("Hello world");
});

//Retrieve all of the data from scrapedData as JSON
app.get("/all", function(req, res) {

    request("http://www.npr.org/sections/music-news/", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        var $ = cheerio.load(html);

        // An empty array to save the data
        var results = [];

        // Select each element in the HTML body from which you want information.
        $("article.item.has-image").each(function(i, element) {
        var link = $(element).find("h2").find("a").attr("href");
        var title = $(element).children().text().trim();
        var image = $(element).find("a").find("img").attr("src");
        var summary = $(element).find("p.teaser").text().trim();

        // Save these results in an object and push into the results array
        results.push({
        title: title,
        link: link,
        image: image,
        summary: summary
        });
    });
  // Log the results once you've looped through each of the elements found with cheerio
  res.json(results);
 });
});


//The server will scrape data from the site and save it to MongoDB
app.get("/scrape", function(req, res) {

    request("http://www.npr.org/sections/music-news/", function(error, response, html) {

        var $ = cheerio.load(html);

        var results = [];

        $("article.item.has-image").each(function(i, element) {
            var link = $(element).find("h2").find("a").attr("href").trim();
            var title = $(element).children().text();
            var image = $(element).find("a").find("img").attr("src");
            var summary = $(element).find("p.teaser").text().trim();

            if (title && link && image && summary) {
            db.scrapedData.insert({ 
                title: title, 
                link: link, 
                image: image, 
                summary: summary });
            }
    // Log the results once you've looped through each of the elements found with cheerio
    console.log("Scraped");
  });
});
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

