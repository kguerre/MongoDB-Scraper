var cheerio = require("cheerio");
var request = require("request");

// Make a request call to grab the HTML body from nba.com
request("http://www.nba.com/", function(error, response, html) {
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands
  var $ = cheerio.load(html);

  // An empty array to save the data
  var results = [];

  // Select each element in the HTML body from which you want information.
  $("div.paragraph").each(function(i, element) {
    var link = $(element).children().attr("href");
    var title = $(element).children().text();
    var image = $(element).find("a").find("img").attr("src");

    // Save these results in an object and push into the results array
    results.push({
      title: title,
      link: link,
      image: image
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
