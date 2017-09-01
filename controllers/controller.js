var cheerio = require("cheerio");
var request = require("request");

// Make a request call to grab the HTML body from nba.com
request("http://www.npr.org/sections/music-news/", function(
  error,
  response,
  html
) {
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands
  var $ = cheerio.load(html);

  // An empty array to save the data
  var results = [];

  // Select each element in the HTML body from which you want information.
  $("article.item.has-image").each(function(i, element) {
    var link = $(element)
      .find("h2")
      .find("a")
      .attr("href");
    var title = $(element)
      .children()
      .text();
    var image = $(element)
      .find("a")
      .find("img")
      .attr("src");
    var summary = $(element)
      .find("p.teaser")
      .text();

    // Save these results in an object and push into the results array
    results.push({
      title: title,
      link: link,
      image: image,
      summary: summary
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
