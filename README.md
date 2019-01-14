# Stack Scraper

## About
Stack Scraper is a full stack Node app that scrapes [stack overflow](https://stackoverflow.com/) for JavaScript related questions. Then loads them on the app and the user can save questions they like and add comments.

### How it Works
* The server is handled using Express
* The sever.js file handles deploying the Express server it also handles API routes:
     * GET routes display the scraped articles as well as comments on articles
     * POST routes delete comments created by the user, save articles, and create comments
* The database is a Mongo noSQL database, NPM Mongoose was used to create and update the database
* Axio and CHerrio are used to scrape the website and return the relevant articles
* On Heroku it uses mLab to run the Mongo database
* The modules folder contains schema files for the Articles and Notes 
* The front end JavaScript is handled in the public/app.js. It uses jQuery for the DOM
* Handlebars is used for UX, as well as handling some front end JavaScript, like looping to display the articles

### How to Use
* The app is hosted on Heroku and it can be used [here](https://lit-lake-33844.herokuapp.com/)
* Clicking the scrape button will update the page with the latest JavaScript problems
* Clicking on any of bodies of the articles will show all of the comments that have been made it will also give an option to add a comment
* Comments can be deleted but only ones created by the user by clicking the remove article button underneath comments the user has posted
* Comments can only be deleted during the session they were posted. If the page is closed and re opened they will not be able to be deleted
* Articles can be saved by clicking the save article button underneath the article, this lets the user keep track of stack problems they are interested in or think they can solve
* Saved articles are only saved for the session, so if the app is closed, saved articles will be lost

### Technologies Used
* Node
* Express
* Handlebars
* jQuery
* MongoDB
* Mongoose
* Cheerio
* Axio
