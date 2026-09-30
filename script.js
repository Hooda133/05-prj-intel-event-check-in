// Variables to track attendance and team counts
let totalAttendees = 0;
const maxGoal = 50;

let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;

// Get references to HTML elements
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountElement = document.getElementById("attendeeCount");
const progressBarElement = document.getElementById("progressBar");
const greetingElement = document.getElementById("greeting");
const waterCountElement = document.getElementById("waterCount");
const zeroCountElement = document.getElementById("zeroCount");
const powerCountElement = document.getElementById("powerCount");

// Listen for form submission
checkInForm.addEventListener("submit", function (event) {
  // Prevent the page from reloading
  event.preventDefault();

  // Get the attendee name and selected team
  const name = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const teamLabel = teamSelect.options[teamSelect.selectedIndex].text;

  // Make sure both fields have a value
  if (!name || !selectedTeam) {
    return;
  }

  // Increase total attendance
  totalAttendees = totalAttendees + 1;

  // Increase the selected team's count
  if (selectedTeam === "water") {
    waterCount = waterCount + 1;
    waterCountElement.textContent = waterCount;
  } else if (selectedTeam === "zero") {
    zeroCount = zeroCount + 1;
    zeroCountElement.textContent = zeroCount;
  } else if (selectedTeam === "power") {
    powerCount = powerCount + 1;
    powerCountElement.textContent = powerCount;
  }

  // Show the updated total attendance
  attendeeCountElement.textContent = totalAttendees;

  // Calculate the percentage of the attendance goal completed
  const progressPercentage = Math.min(
    (totalAttendees / maxGoal) * 100,
    100
  );

  // Update the progress bar
  progressBarElement.style.width = `${progressPercentage}%`;

  // Show a personalized success message
  greetingElement.textContent = `Welcome, ${name}! You have checked in with ${teamLabel}.`;
  greetingElement.className = "success-message";
  greetingElement.style.display = "block";

  // Reset the form for the next attendee
  checkInForm.reset();
  attendeeNameInput.focus();
});
