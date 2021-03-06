// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      if (data.note.length > 0) {

        
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<h3 id='noter'>Comments</h3>")
            for (let i = 0; i < data.note.length; i++) {
              $("#notes").append("<div class='notediv' <h5>" + data.note[i].title + "</h5><p>" + data.note[i].body + "p>")
              data.note[i].new ? $("#notes").append("<button class='btn removeNote' data-id=" + data.note[i]._id + " data-article="+ data._id + ">Remove Comment</button></div>") : console.log("no new")
            }
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

          

        console.log("yes")
        $("#notes").append("<h5>")
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      } else {
        console.log(data.note);
        // An input to enter a new title
        
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      }
      // If there's a note in the article

    });
});

$(document).on("click", ".btn.save", function () {
  var thisId = $(this).attr("data-id")
  console.log("saved!")
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  })
})

$(document).on("click", ".btn#home", function () {
  console.log('homebutton working')
  window.location = "/home"
})
$(document).on("click", ".btn#saved", function () {
  window.location = "/saved"
});

$(document).on("click", ".btn.unsave", function () {
  thisID = $(this).attr("data-id")
  console.log('unsaved')
  $.ajax({
    method: "POST",
    url: "/saved/delete/" + thisID
  }).then(location.reload())
})
$(document).on("click", ".btn.removeNote", function(){
  var thisId = $(this).attr("data-id");
  var thisArt = $(this).attr("data-article")

  $.ajax({
    method: "POST",
    url: "/notes/delete/" + thisId + "/" + thisArt
  }).then(window.location="/home", alert("comment deleted"))
})
// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/notes/save/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});