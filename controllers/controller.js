// Node Dependencies
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

// Import the Comment and Article models
var Comment = require('../models/comment.js');
var Article = require('../models/article.js');

// Routes
// ======

// Index Page Render 
router.get('/', function (req, res){

  // Scrape data
  res.redirect('/scrape');

});

// A GET request to scrape the NPR website
router.get('/scrape', function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.npr.org/sections/music-news/", function(error, response, html) {

    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);

    // Now, we grab every h2 within an article tag, and do the following:
    $("div.item-info").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("h2").text();
      result.link = $(this).find("h2").find("a").attr("href");
      result.summary = $(this).children("p.teaser").text();

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
  });
  res.redirect("/articles");
});

// //Get articles scraped from mongoDB
router.get("/articles", function(req, res) {
  //Grab every doc in the Articles array
  Article.find({}, function(err, doc) {
    //Log any errors
    if (err) {
      console.log(err);
    }
    //or store doc in hbsObject and render to index
    else {
      var hbsObject = {article: doc};
      return res.render('index', hbsObject);
    }
  });
});

// // This will get the articles we scraped from the mongoDB
// router.get("/articles", function(req, res) {
//   // Grab every doc in the Articles array
//   Article.find({}, function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Or send the doc to the browser as a json object
//     else {
//       res.json(doc);
//     }
//   });
// });

// Create a new note or replace an existing note
router.post("/add/comment/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newComment = new Comment(req.body);

  // And save the new note the db
  newComment.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          console.log("Check the comments");
          console.log(doc);
          res.send(doc);
        }
      });
    }
  });
});

// Delete a Comment Route
router.post("/delete/comment/:id", function (req, res){
  // Collect comment id
  var commentId = req.params.id;
  // Find and Delete the Comment using the Id
  Comment.findByIdAndRemove(commentId, function (err, todo) {  
    if (err) {
      console.log(err);
    } 
    else {
      // Send Success Header
      res.sendStatus(200);
      // res.render("index");
    }
  });
});

module.exports = router;