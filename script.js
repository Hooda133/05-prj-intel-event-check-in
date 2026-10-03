// Attendance is kept in memory for this page session.
const attendanceGoal = 50;
const attendanceStorageKey = "intel-sustainability-attendance";
const teamCounts = { water: 0, zero: 0, power: 0 };
const attendees = [];
let nextAttendeeId = 1;
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const celebration = document.getElementById("celebration");
const progressBar = document.getElementById("progressBar");
const progress = progressBar.parentElement;
const attendeeList = document.getElementById("attendeeList");
const resetButton = document.getElementById("resetButton");
let goalCelebrationShown = false;

function showMessage(message, messageClass) {
  greeting.textContent = message;
  greeting.className = messageClass;
  greeting.style.display = "block";
}

function showGoalCelebration() {
  let winningTeam = "";
  let winningCount = -1;

  Object.keys(teamCounts).forEach(function (team) {
    if (teamCounts[team] > winningCount) {
      const teamOption = teamSelect.querySelector(`option[value="${team}"]`);
      winningTeam = teamOption.textContent.replace(/^Team\s+/i, "");
      winningCount = teamCounts[team];
    }
  });

  celebration.textContent = `🎉 Goal Reached! Congratulations, Team ${winningTeam}!`;
  celebration.hidden = false;
  goalCelebrationShown = true;
}

function saveAttendance() {
  const attendanceData = {
    total: attendees.length,
    teams: teamCounts,
    attendees: attendees,
    goalCelebrationShown: goalCelebrationShown,
  };

  localStorage.setItem(attendanceStorageKey, JSON.stringify(attendanceData));
}

function loadAttendance() {
  const savedAttendance = localStorage.getItem(attendanceStorageKey);

  if (!savedAttendance) {
    return;
  }

  try {
    const attendanceData = JSON.parse(savedAttendance);

    if (!Array.isArray(attendanceData.attendees)) {
      return;
    }

    attendanceData.attendees.forEach(function (attendee) {
      attendees.push(attendee);
    });

    nextAttendeeId =
      attendees.reduce(function (highestId, attendee) {
        return Math.max(highestId, attendee.id);
      }, 0) + 1;
    goalCelebrationShown = attendanceData.goalCelebrationShown === true;
    renderAttendance();

    if (attendees.length >= attendanceGoal && !goalCelebrationShown) {
      showGoalCelebration();
      saveAttendance();
    }
  } catch (error) {
    return;
  }
}

function renderAttendance() {
  const total = attendees.length;

  teamCounts.water = 0;
  teamCounts.zero = 0;
  teamCounts.power = 0;

  attendees.forEach(function (attendee) {
    teamCounts[attendee.team] += 1;
  });

  document.getElementById("attendeeCount").textContent = total;
  progressBar.style.width = `${Math.min((total / attendanceGoal) * 100, 100)}%`;
  progress.setAttribute("aria-valuenow", Math.min(total, attendanceGoal));
  progress.setAttribute(
    "aria-valuetext",
    `${total} attendees checked in; goal ${attendanceGoal}`,
  );

  Object.keys(teamCounts).forEach(function (team) {
    const percentage =
      total === 0 ? 0 : Math.round((teamCounts[team] / total) * 100);
    document.getElementById(`${team}Count`).textContent = teamCounts[team];
    document.getElementById(`${team}Percentage`).textContent =
      `${percentage}% of attendance`;
  });

  attendeeList.textContent = "";

  if (attendees.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-list";
    emptyMessage.textContent = "No attendees have checked in yet.";
    attendeeList.appendChild(emptyMessage);
    return;
  }

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    const attendeeInfo = document.createElement("div");
    const attendeeName = document.createElement("strong");
    const attendeeTeam = document.createElement("span");
    const removeButton = document.createElement("button");

    listItem.className = "attendee-item";
    attendeeInfo.className = "attendee-info";
    attendeeName.textContent = attendee.name;
    attendeeTeam.textContent = attendee.teamLabel;
    attendeeTeam.className = "attendee-team";
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove attendee";
    removeButton.addEventListener("click", function () {
      const attendeeIndex = attendees.findIndex(function (currentAttendee) {
        return currentAttendee.id === attendee.id;
      });

      attendees.splice(attendeeIndex, 1);
      renderAttendance();
      saveAttendance();
      showMessage(`${attendee.name} was removed.`, "success-message");
    });

    attendeeInfo.appendChild(attendeeName);
    attendeeInfo.appendChild(attendeeTeam);
    listItem.appendChild(attendeeInfo);
    listItem.appendChild(removeButton);
    attendeeList.appendChild(listItem);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !Object.hasOwn(teamCounts, team)) {
    showMessage(
      "Enter an attendee name and choose a team to check in.",
      "error-message",
    );
    (!name ? nameInput : teamSelect).focus();
    return;
  }

  const duplicateName = attendees.some(function (attendee) {
    return attendee.name.toLowerCase() === name.toLowerCase();
  });

  if (duplicateName) {
    showMessage("That attendee has already checked in.", "error-message");
    nameInput.focus();
    return;
  }

  const teamLabel = teamSelect.selectedOptions[0].textContent;
  attendees.push({
    id: nextAttendeeId,
    name: name,
    team: team,
    teamLabel: teamLabel,
  });
  nextAttendeeId += 1;

  renderAttendance();
  showMessage(
    `Welcome, ${name}! You have checked in with ${teamLabel}.`,
    "success-message",
  );

  if (!goalCelebrationShown && attendees.length >= attendanceGoal) {
    showGoalCelebration();
  }

  saveAttendance();
  form.reset();
  nameInput.focus();
});

resetButton.addEventListener("click", function () {
  if (attendees.length > 0 && !window.confirm("Reset all attendance data?")) {
    return;
  }

  attendees.length = 0;
  nextAttendeeId = 1;
  localStorage.removeItem(attendanceStorageKey);
  renderAttendance();
  form.reset();
  greeting.style.display = "none";
  celebration.hidden = true;
  celebration.textContent = "";
  goalCelebrationShown = false;
  nameInput.focus();
});

loadAttendance();
