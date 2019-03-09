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

// Time Calculations

function getMinutesLeft(frequency, firstTime) {
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var timeRemainder = diffTime % frequency;

  // Minute Until Train
  var minutesTillNext = frequency - timeRemainder;
  return minutesTillNext;
}

function getNextArrival(frequency, firstTime) {
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var timeRemainder = diffTime % frequency;

  // Minute Until Train
  var minutesTillNext = frequency - timeRemainder;

  // Next Train
  var nextTrain = moment()
    .add(minutesTillNext, "minutes")
    .format("HH:mm");
  return nextTrain;
}
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

  // Clear fields
  $("form :input").val("");
});

database.ref().on("child_added", function(childSnapshot) {
  // Assign values to each child's data
  var childName = childSnapshot.val().name;
  var childDestination = childSnapshot.val().destination;
  var childFrequency = childSnapshot.val().frequency;
  var childFirstTrain = childSnapshot.val().firstTrain;

  var minutesLeft = getMinutesLeft(childFrequency, childFirstTrain);
  var nextTrain = getNextArrival(childFrequency, childFirstTrain);

  // Create new table row
  var newRow = $("<tr>");
  // Add each child item to row (IN ORDER)
  newRow.append("<td>" + childName + "</td>");
  newRow.append("<td>" + childDestination + "</td>");
  newRow.append("<td>" + childFrequency + "</td>");
  newRow.append("<td>" + nextTrain + "</td>"); // This will calculate to be the next arrival
  newRow.append("<td>" + minutesLeft + "</td>"); // This will calculate to be the minutes away

  $("#train-list").append(newRow);
});
