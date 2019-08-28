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

function round(value, decimals)
    // published by Jack Moore at https://www.jacklmoore.com/notes/rounding-in-javascript/
    {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }


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
    predictweather(userSelectedCourse, userSelectedDateTime);
    careerstats(name1ForRoute, name2ForRoute);
    coursedisplay(userSelectedCourse);
};

    
    // coursedisplay(userSelectedCourse);
    // predictweather(userSelectedCourse, userSelectedDateTime);
    // player1stats(userSelectedPlayer1, userSelectedCourse);
    // player2stats(userSelectedPlayer2, userSelectedCourse);<img src=../static/src/chabot_cropped.jpg>

function coursedisplay(choice) {
    console.log("Course Display is in play");
    console.log(choice);
    if (choice == 0) {
        document.getElementById('JumboTronBro').innerHTML="<img src='../static/src/san_francisco_cropped.jpg'>";
    }
    else if (choice == 1) {
        document.getElementById('JumboTronBro').innerHTML="<img src='../static/src/chabot_cropped.jpg'>";
    }
    else {
        document.getElementById('JumboTronBro').innerHTML="<img src='../static/src/aquatic.jpg'>";
    }
}

function predictweather(course, date) {
    // console.log("Weather Predictor is in play");
    var weather_fetch_url = `/weather/${course}/${date}`;
    d3.json(weather_fetch_url).then(function(weatheroutput) {
      // console.log(weatheroutput);
      var winddirection = weatheroutput[0];
      var maxgust = weatheroutput[1];
      var precip = weatheroutput[2];
    
      // Need to create bins that will convert the degrees into a bearing.
      if (winddirection < 30) {
        bearing = "North " + "(" + winddirection + "º" + ")";
      }
      else if (winddirection < 60) {
        bearing = "North-East " + "(" + winddirection + "º" + ")";
      }
      else if (winddirection < 120) {
        bearing = "East " + "(" + winddirection + "º" + ")";
      }
      else if (winddirection < 150) {
        bearing = "South-East " + "(" + winddirection + "º" + ")";
      }
      else if (winddirection < 210) {
        bearing = "South  " + "(" + winddirection + "º" + ")";
      }
      else if (winddirection < 240) {
        bearing = "South-West  " + "(" + winddirection + "º" + ")";
      }
      else if (winddirection < 300) {
        bearing = "West " + "(" + winddirection + "º" + ")";
      }
      else if (winddirection < 330) {
        bearing = "North-West " + "(" + winddirection + "º" + ")";
      }
      else {
        bearing = "North " + "(" + winddirection + "º" + ")";
      }
    
      // console.log(bearing);
    
        var windspeedselected = d3.select("#PredictedWeather");
        var row = windspeedselected.append("tr");
        var cell = windspeedselected.append("td");
        
        windspeedselected.html("");
        
        var row = windspeedselected.append("tr");
        var cell = windspeedselected.append("td");
        cell.text(bearing);
        var cell = windspeedselected.append("td");
        cell.text(maxgust + " mph");
        var cell = windspeedselected.append("td");
        cell.text(precip + " inches of rain");
        row.text("");
        
        console.log("PredictWeather() fully operational");
        })
    };

function careerstats(guy1, guy2) {

    array1 = []
    array2 = []
    array3 = []
    array4 = []
    array5 = []
    array1b = []
    array2b = []
    array3b = []
    array4b = []
    array5b = []


    array1.length = 0
    array2.length = 0
    array3.length = 0
    array4.length = 0
    array5.length = 0
    array1b.length = 0
    array2b.length = 0
    array3b.length = 0
    array4b.length = 0
    array5b.length = 0


    console.log("Player 1 & 2 stats is in play");
    var career_fetch_url = `/stats/${guy1}/${guy2}`;
    d3.json(career_fetch_url).then(function(careerscores) {
    //  console.log(careerscores);
    
    var p1Ngames = careerscores[0].length;
    var p2Ngames = careerscores[1].length;
    var sum1 = 0;
    var sum2 = 0;
    var firstZero = "0";


    if (p1Ngames < 8 || p2Ngames < 8) {
        modelWeak();
    }


// Once we isolate the 5th value of each array...
// The task is to add zeroes to each array of length 12,
// Then add zeroes to each array of length 13,
// Then replace the slashes with dashes at preordained indices 



// 4 passes. Pass 1: add a 0 to the beginning of arrays with length 12.

    for (var i = 0; i < careerscores[0].length; i++){
        var entry1 = careerscores[0][i];

        subarray1 = [];
        subarray2 = [];
        subarray3 = [];
        subarray4 = [];


        
        for (var j = 0; j < entry1.length; j++) {
        if (j % 6 == 4) {
        var itema = entry1[j];
        // console.log(itema.length)
        // console.log(itema);
        if (itema.length === 12) {
            itemb = itema.slice(0, 2) + "0" + itema.slice(2);
            subarray1.push(itemb);
        }
        else {
            subarray1.push(itema);
        }
        // console.log(subarray1);
        array1.push(subarray1);
        }
    };
    
    };
    // console.log(array1);

    for (var j = 0; j < array1.length; j++) {
        var itemc = array1[j][0];
        // console.log(itemc.length);
        // console.log(itemc);
        if (itemc.length === 13) {
            if (itemc[1] == "/"){
            itemd = firstZero + itemc;
            // console.log(itemd);
            subarray2.push(itemd);
            }
            else {
            iteme = itemc.slice(0, 3) + "0" + itemc.slice(3);
            // console.log(iteme);
            subarray2.push(iteme);
            }
        }
        else {
            // console.log(itemc);
            subarray2.push(itemc);
        }
        array2.push(subarray2);
        }
    // console.log(array2[0]);


    for (var j = 0; j<array2[0].length; j++) {
        itemf = array2[0][j];
        itemg = itemf.replace(/\//g, "-");
        itemh = itemg + ":00";
        array3.push(itemh);
    }
    //  console.log(array3);
    
    for (var j = 0; j<array3.length; j++) {
        itemi = array3[j];
        itemj = itemi.slice(6, 8) + "-" + itemi.slice(0, 5) + " " + itemi.slice(9);
        // console.log(itemi);
        // console.log(itemj);
        itemk = "20" + itemj;
    //  console.log(itemk);
        array4.push(itemk);
    };

    for (var i = 0; i < careerscores[0].length; i++){
        var scorea = careerscores[0][i];
        for (var j = 0; j < scorea.length; j++)
            if (j % 6 == 1) {
            var itemi = scorea[j];
            subarray3.push(itemi);
        }
        array5.push(subarray3);
        };

        console.log(array5);

        // REPEAT

        for (var i = 0; i < careerscores[1].length; i++){
        var entry2 = careerscores[1][i];

        subarray1b = [];
        subarray2b = [];
        subarray3b = [];
        subarray4b = [];


        
        for (var j = 0; j < entry2.length; j++) {
            if (j % 6 == 4) {
            var itemab = entry2[j];
            // console.log(itema.length)
            // console.log(itema);
            if (itemab.length === 12) {
            itembb = itemab.slice(0, 2) + "0" + itemab.slice(2);
            subarray1b.push(itembb);
            }
            else {
            subarray1b.push(itemab);
            }
            // console.log(subarray1);
            array1b.push(subarray1b);
        }
        };
        
    };
    // console.log(array1);

        for (var j = 0; j < array1b.length; j++) {
            var itemcb = array1b[j][0];
            // console.log(itemc.length);
            // console.log(itemc);
            if (itemcb.length === 13) {
            if (itemcb[1] == "/"){
                itemdb = firstZero + itemcb;
                // console.log(itemd);
                subarray2b.push(itemdb);
            }
            else {
                itemeb = itemcb.slice(0, 3) + "0" + itemcb.slice(3);
                // console.log(iteme);
                subarray2b.push(itemeb);
            }
            }
            else {
            // console.log(itemc);
            subarray2b.push(itemcb);
            }
            array2b.push(subarray2b);
        }
        // console.log(array2[0]);


        for (var j = 0; j<array2b[0].length; j++) {
        itemfb = array2b[0][j];
        itemgb = itemfb.replace(/\//g, "-");
        itemhb = itemgb + ":00";
        array3b.push(itemhb);
        }
    //  console.log(array3b);
        
        for (var j = 0; j<array3b.length; j++) {
        itemib = array3b[j];
        itemjb = itemib.slice(6, 8) + "-" + itemib.slice(0, 5) + " " + itemib.slice(9);
        // console.log(itemi);
        // console.log(itemj);
        itemkb = "20" + itemjb;
        //  console.log(itemkb);
        array4b.push(itemkb);
        };

        for (var i = 0; i < careerscores[1].length; i++){
            var scoreab = careerscores[1][i];
            for (var j = 0; j < scoreab.length; j++)
            if (j % 6 == 1) {
            var itemib = scoreab[j];
            subarray3b.push(itemib);
            }
        array5b.push(subarray3b);
        };
        
        //  console.log(array5b);
        
    var data1 = [
        {
        type: "scatter",
        mode: "markers",
        x: array4,
        y: array5[0],
        marker: {
            color: 'green'
        }
        }
    ];

    var layout1 = {
        title: guy1.replace(/_/g, " ") + " Recorded Scores",
        yaxis: {
        title: 'Points',
        },
        xaxis: {
        title: 'Date',
        }
    }

    var data2 = [
        {
        type: "scatter",
        mode: "markers",
        x: array4b,
        y: array5b[0],
        marker: {
            color: 'red'
        }
        }
    ];

    var layout2 = {
        title: guy2.replace(/_/g, " ") + " Recorded Scores",
        yaxis: {
        title: 'Points',
        },
        xaxis: {
        title: 'Date',
        }
    }

    var trace3 =
        {
        y: array5[0],
        boxpoints: 'all',
        jitter: 0.3,
        poitpos: -1.8,
        type: 'box',
        name: guy1.replace(/_/g, " "),
        marker: {
            color: 'green'
        }
        }
    ;

    var layout3 = {
        title: 'Relative Distributions',
        yaxis: {
        title: 'Points'
        },
        showlegend: false 
    }

    var trace4 =
        {
        y: array5b[0],
        boxpoints: 'all',
        jitter: 0.3,
        poitpos: -1.8,
        type: 'box',
        name: guy2.replace(/_/g, " "),
        marker: {
            color: 'red'
        }
        }
    ;

    var layout4 = {
        title: 'Score Dist',
        yaxis: {
        title: 'Points'
        }
    }

    var data3 = [trace3,trace4]





    Plotly.newPlot("lineplot1", data1, layout1);
    Plotly.newPlot("lineplot2", data2, layout2);
    Plotly.newPlot("boxplot1", data3, layout3);
    // Plotly.newPlot("boxplot2", data4, layout4);
    
    

    d3.select("Counta").append("h6").text(p1Ngames);
    
    array6 = array5[0];
    array7 = array6.map(Number);

    array6b = array5b[0];
    array7b = array6b.map(Number);

    console.log(array7);


    var P1N = array5[0].length;
    var P2N = array5b[0].length;
    



    var P1Mean = mean(array7);
    console.log(P1Mean);
    var P2Mean = mean(array7b);
    console.log(P2Mean);      

    console.log(P1N);
    console.log(P2N);





    var P1StDev = Math.sqrt(variance(array7));
    var P2StDev = Math.sqrt(variance(array7b));
    console.log(P1StDev);
    console.log(P2StDev);

    var tbodysummary1 = d3.select("#ASummary");
    
    tbodysummary1.html("");
    
    var row1 = tbodysummary1.append("tr");
    var cell1 = tbodysummary1.append("td");
    cell1.text(P1N);
    var cell1 = tbodysummary1.append("td");
    cell1.text(round(P1Mean,2));
    var cell1 = tbodysummary1.append("td");
    cell1.text(round(P1StDev,2));

    var tbodysummary2 = d3.select("#BSummary");

    tbodysummary2.html("");

    var row2 = tbodysummary2.append("tr");
    var cell2 = tbodysummary2.append("td");
    cell2.text(round(P2StDev,2));
    var cell2 = tbodysummary2.append("td");
    cell2.text(round(P2Mean,2));
    var cell2 = tbodysummary2.append("td");
    cell2.text(P2N);
    
    row1.text("");
    row2.text("");
    })};

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

  var tbodyodds = d3.select("#Odds");
    tbodyodds.html("");

  var row = tbodyodds.append("tr");
  var cell = tbodyodds.append("td");

  var row = tbodyodds.append("tr");
  var cell = tbodyodds.append("td");
  cell.text(player1.replace(/_/g, " "));
  var cell = tbodyodds.append("td");
  cell.text(round(score1,2));
  var cell = tbodyodds.append("td");
  cell.text(round(oddsscore,2));
  var cell = tbodyodds.append("td");
  cell.text(round(score2,2));
  var cell = tbodyodds.append("td");
  cell.text(player2.replace(/_/g, " "));
  row.text("");

  createOddsBar(oddsscore)
    });
};

function isNum(args) {
    args = args.toString();
    if (args.length == 0) return false;
    for (var i = 0; i<args.length; i++) {
    if ((args.substring(i,i+1) < "0" || args.substring(i, i+1) > "9") && args.substring(i, i+1) != "."&& args.substring(i, i+1) != "-") {
    return false;
    }
    }
    return true;
    }


function mean(numbers) {
    // mean of [3, 5, 4, 4, 1, 1, 2, 3] is 2.875
    var total = 0,
        i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}


function variance(arr) {
    var len = 0;
    var sum=0;
    for(var i=0;i<arr.length;i++) {
    if (arr[i] == ""){}
    else if (!isNum(arr[i])) {
    alert(arr[i] + " is not number, Variance Calculation failed!");
    return 0;
    }
    else {
    len = len + 1;
    sum = sum + parseFloat(arr[i]);
    }
    }
    var v = 0;
    if (len > 1) {
    var mean = sum / len;
    for(var i=0;i<arr.length;i++) {
    if (arr[i] == "") {}
    else {
    v = v + (arr[i] - mean) * (arr[i] - mean);
        }
    }
    return v / len;
    }
    else {
    return 0;
        }
};

function modelWeak() {
    alert("One or more of the players you have selected has fewer than 8 games! Thus, the model may be less robust.");
  }
  

// set svg width (Depends)
// set svg height (constant)


function createOddsBar(value) {

    document.getElementById('TheOddsBar').innerHTML="";

    var dataArray1 = [value];

    rectwidthstring = value * 100 + "%";
    console.log(rectwidthstring);


    console.log(dataArray1);
    var svg = d3.select("#TheOddsBar")
        .append("svg")
        .attr("height", "110")
        .attr("width", "100%")
        .attr("class", "rect barbacked");

        
    var rect = svg.append("rect")
        .attr("width", rectwidthstring)
        .attr("height", "110")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "green")
        .attr("id", "blockbro");
        
}