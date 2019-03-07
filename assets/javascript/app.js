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

  // Get user input data
});
