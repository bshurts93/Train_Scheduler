// Initialize Firebase
var config = {
  apiKey: "AIzaSyA3515fseoqJsiML7oSlXr3CMgKQCLB5NI",
  authDomain: "train-schedule-c6d7d.firebaseapp.com",
  databaseURL: "https://train-schedule-c6d7d.firebaseio.com",
  projectId: "train-schedule-c6d7d",
  storageBucket: "train-schedule-c6d7d.appspot.com",
  messagingSenderId: "384143917959"
};
firebase.initializeApp(config);

var database = firebase.database();

// Time Variables
var now = moment().format("HH:mm");

// Add train data to firebase on submit

$("#add-train").on("click", function() {
  // Prevent submit from reloading page
  event.preventDefault();

  var name = $("#train-name-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var firstTrain = $("#first-train-input")
    .val()
    .trim();
  var frequency = $("#frequency-input")
    .val()
    .trim();

  var newTrain = {
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  database.ref().push(newTrain);
  console.log("clicked");
});

database.ref().on("child_added", function(childSnapshot) {
  // Assign values to each child's data
  var childName = childSnapshot.val().name;
  var childDestination = childSnapshot.val().destination;
  var childFrequency = childSnapshot.val().frequency;
  var childFirstTrain = childSnapshot.val().firstTrain;
  var nextArrival = moment(childFirstTrain, "HH:mm")
    .add(childFrequency, "minutes")
    .format("HH:mm");
  //   console.log(childName);
  //   console.log(childDestination);
  //   console.log(childFirstTrain);
  //   console.log(childFrequency);
  console.log(childFirstTrain);
  console.log(childFrequency);
  console.log("Next arrival is " + nextArrival); // STILL NOT CORRECT, NEEDS TO UPDATE ON CONCURRENT TRAINS

  // Create new table row
  var newRow = $("<tr>");
  // Add each child item to row (IN ORDER)
  newRow.append("<td>" + childName + "</td>");
  newRow.append("<td>" + childDestination + "</td>");
  newRow.append("<td>" + childFrequency + "</td>");
  newRow.append("<td>" + "next-arrival" + "</td>"); // This will calculate to be the next arrival
  newRow.append("<td>" + "minutes-away" + "</td>"); // This will calculate to be the minutes away

  $("#train-list").append(newRow);
});
