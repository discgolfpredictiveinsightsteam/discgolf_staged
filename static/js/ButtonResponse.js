document.getElementById("button").addEventListener("click", function(event){
    event.preventDefault()
    console.log("Button is reacting");
    respond_to_button();
  });

// $(document).ready(function() {
//     $('#button').on('click', function(event) {
//         event.preventDefault();
//         console.log("Button is reacting");
//         respond_to_button();
//     });
// });


function respond_to_button() {
    console.log("Your button is reacting");
    var userSelectedPlayer1 = d3.select("#Player1Input").node().value;
    var userSelectedPlayer2 = d3.select("#Player2Input").node().value;
    var userSelectedCourse = d3.select("#CourseInput").property("value");
    var userSelectedDateTime = d3.select("#DateTimeInput").node().value;
    console.log(userSelectedPlayer1);
    console.log(userSelectedPlayer2);
    console.log(userSelectedCourse);
    console.log(userSelectedDateTime);
    var names1 = userSelectedPlayer1.split(', ');
    var name1ForRoute = names1[1] + '_' + names1[0];
    var names2 = userSelectedPlayer2.split(', ');
    var name2ForRoute = names2[1] + '_' + names2[0]
    console.log(name1ForRoute);
    console.log(name2ForRoute);
    giveodds(name1ForRoute, name2ForRoute, userSelectedCourse, userSelectedDateTime);
};

    
    // coursedisplay(userSelectedCourse);
    // predictweather(userSelectedCourse, userSelectedDateTime);
    // player1stats(userSelectedPlayer1, userSelectedCourse);
    // player2stats(userSelectedPlayer2, userSelectedCourse);

// function coursedisplay() {

// }


// function predictweather() {

// }

// function player1stats() {

// }

// function player2stats() {

// }

function giveodds(player1, player2, course, date) {
    console.log("giveodds is in play");
    var data_fetch_url = `/score_model/${player1}/${player2}/${course}/${date}`;
    console.log(data_fetch_url)
    d3.json(data_fetch_url).then( function (data) {
        // Grab values from the response json object to build the plots
        var score1 = data[0];
        var score2 = data[1];
        var oddsscore = data[2];

        console.log(score1);
        console.log(score2);
        console.log(oddsscore);

  var tbodyodds = d3.select("tbody");
  var row = tbodyodds.append("tr");
  var cell = tbodyodds.append("td");

  var row = tbodyodds.append("tr");
  var cell = tbodyodds.append("td");
  cell.text(player1);
  var cell = tbodyodds.append("td");
  cell.text(score1);
  var cell = tbodyodds.append("td");
  cell.text(player2);
  var cell = tbodyodds.append("td");
  cell.text(score2);
  var cell = tbodyodds.append("td");
  cell.text(oddsscore);
  row.text("");
    });
};

// function giveodds(player1, player2, course, date)

//     var data_fetch_url = `/score_model/${player1}/${player2}/${course}/${date}`;

//     d3.json(data_fetch_url).then(function(data) {

//         // Grab values from the response json object to build the plots
//         var player = unpack(data.name, 0);
//         var score = unpack(data.score, 1);
//         var whatever = unpack(data.whatever, 2);

//         console.log(player);
//         console.log(score);
//         console.log(whatever);