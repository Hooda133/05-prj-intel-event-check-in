// Attendance is kept in memory for this page session.
const attendanceGoal = 50;
const teamCounts = { water: 0, zero: 0, power: 0 };
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const progressBar = document.getElementById("progressBar");
const progress = progressBar.parentElement;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !Object.hasOwn(teamCounts, team)) {
    greeting.textContent = "Enter an attendee name and choose a team to check in.";
    greeting.className = "error-message";
    greeting.style.display = "block";
    (!name ? nameInput : teamSelect).focus();
    return;
  }

  const teamLabel = teamSelect.selectedOptions[0].textContent;
  console.log("Name:", name);
  console.log("Team:", teamLabel);

  teamCounts[team] += 1;
  const total = teamCounts.water + teamCounts.zero + teamCounts.power;
  document.getElementById(`${team}Count`).textContent = teamCounts[team];
  document.getElementById("attendeeCount").textContent = total;
  progressBar.style.width = `${Math.min(total / attendanceGoal * 100, 100)}%`;
  progress.setAttribute("aria-valuenow", Math.min(total, attendanceGoal));
  progress.setAttribute("aria-valuetext", `${total} attendees checked in; goal ${attendanceGoal}`);
  const hour = new Date().getHours();
  let timeGreeting = "Good evening";

  if (hour < 12) {
    timeGreeting = "Good morning";
  } else if (hour < 17) {
    timeGreeting = "Good afternoon";
  }

  greeting.textContent = `${timeGreeting}, ${name}! Welcome to the Intel Sustainability Summit. You have checked in with ${teamLabel}.`;
  greeting.className = "success-message";
  greeting.style.display = "block";
  form.reset();
  nameInput.focus();
});
