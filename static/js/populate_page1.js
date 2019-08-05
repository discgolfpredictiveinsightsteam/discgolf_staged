function populate_datetime_list();

var selectPanel = d3.select("#selDataset option:checked").text();


    d3.json(req_url).then( function (dataByYear) {



    // Get list of available names

// Something quite similar to this will be used to get the list of names
let  yearsList = dataByYear.map( dataObj => dataObj.year);
d3.select("#selYear").selectAll("option").remove();
yearsList.forEach((yr) => {
    d3.select("#selYear")
      .append("option")
      .text(yr)
      .property("value", yr);
});

// For each of the items in the json object, add that item to the array.

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }





// Similarly, we want to do the same thing for the list of courses
// AND the list of tournament dates






function handle_submit() {
    d3.event.preventDefault();
    console.log("Your button is reacting");
    var userSelectedPlayer1 = d3.select("#")
};


// if course 1, then return course 1 Image.
// if course 2, then return course 2 Image.
// if course 3, then return course 3 Image.


var weather_route = //URL for the app route to /weather.


// Select Course, display jumbotron of selected course images.
// Select Date, get windspeed, direction, and precipitation estimate.
    // Following a call to that app route /weather...
    d3.json(weather_route).then(function(weatherfetch) {
        var windBearing = unpack(weatherfetch, 0);
        var windGust = unpack(weatherfetch, 1);
        var precipIntensity = unpack(weatherfetch, 2);
    
    console.log(windBearing);
    console.log(windGust);
    console.log(precipIntensity);

    // append text to class = PredictedWindBro, PredictedWindBro2, and PredictedRainBro
    
    });


    



    d3.json(approute function)

// Select players, display badges, display career stats for each player.
// Present visauzlized odds for one player to beat another on a given day.





