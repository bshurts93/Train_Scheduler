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

$("#add-train").on("click", function () {
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

// Load from Firebase
database.ref().on("child_added", function (childSnapshot) {
  // Assign values to each child's data
  var childName = childSnapshot.val().name;
  var childDestination = childSnapshot.val().destination;
  var childFrequency = childSnapshot.val().frequency;
  var childFirstTrain = childSnapshot.val().firstTrain;
  var childKey = childSnapshot.key;

  var minutesLeft = getMinutesLeft(childFrequency, childFirstTrain);
  var nextTrain = getNextArrival(childFrequency, childFirstTrain);

  // Delete td and button prepared
  var deleteBtn = $("<button>");
  deleteBtn.addClass("btn btn-primary btn-delete")
  deleteBtn.attr("id", childKey);
  deleteBtn.append("<i class='icon ion-md-close'></i>");
  var deleteTd = $("<td>");
  deleteTd.append(deleteBtn);

  // Create new table row
  var newRow = $("<tr>");
  newRow.attr("class", childKey);

  // Assign IDs to each item
  var newName = $("<td>");
  newName.addClass(childName).text(childName);
  var newDestination = $("<td>");
  newDestination.addClass(childDestination).text(childDestination);
  var newFrequency = $("<td>");
  newFrequency.addClass(childFrequency).text(childFrequency);
  var newNextTrain = $("<td>");
  newNextTrain.addClass(nextTrain).text(nextTrain);
  var newMinutesLeft = $("<td>");
  newMinutesLeft.addClass(minutesLeft).text(minutesLeft);


  // Add each child item to row (IN ORDER)
  newRow.append(newName);
  newRow.append(newDestination);
  newRow.append(newFrequency);
  newRow.append(newNextTrain); // This will calculate to be the next arrival
  newRow.append(newMinutesLeft); // This will calculate to be the minutes away
  newRow.append(deleteTd);



  $("#train-list").append(newRow);
});

// Display current time on DOM
$("#current-time").text(now);

// Delete Click Event
$(document).on("click", ".btn-delete", function () {
  var btnID = $(this).attr("id");
  database.ref(btnID).remove();
  $("." + btnID).remove();
});
