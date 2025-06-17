function getNextSessionDate() {
  const now = new Date();

  // Convert current time to EST/EDT (America/New_York handles DST)
  const nowInNY = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));

  const dayOfWeek = nowInNY.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu
  const hour = nowInNY.getHours();
  const minute = nowInNY.getMinutes();

  // Calculate days until next Thursday
  let daysUntilThursday = (4 - dayOfWeek + 7) % 7;
  // If today is Thursday and before 6:30 PM, use today
  if (daysUntilThursday === 0 && (hour < 18 || (hour === 18 && minute < 30))) {
    daysUntilThursday = 0;
  } else if (daysUntilThursday === 0) {
    daysUntilThursday = 7;
  }

  // Next session date in NY time
  const nextSessionNY = new Date(nowInNY);
  nextSessionNY.setDate(nowInNY.getDate() + daysUntilThursday);
  nextSessionNY.setHours(18, 30, 0, 0); // 6:30 PM

  // Convert back to UTC for countdown calculation
  const nextSessionUTC = new Date(nextSessionNY.toLocaleString("en-US", { timeZone: "UTC" }));
  return nextSessionUTC;
}

function updateCountdown() {
  const now = new Date();
  const nextSession = getNextSessionDate();
  const difference = nextSession - now;

  if (difference <= 0) {
    const countdownElem = document.getElementById('countdown');
    if (countdownElem) countdownElem.innerText = 'Session is live!';
    return;
  }

  const hours = Math.floor(difference / 1000 / 60 / 60);
  const minutes = Math.floor(difference / 1000 / 60) % 60;
  const seconds = Math.floor(difference / 1000) % 60;

  const countdownElem = document.getElementById('countdown');
  if (countdownElem) countdownElem.innerText = `${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
document.addEventListener('DOMContentLoaded', updateCountdown);



// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Get the username from the token
function getUsername() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.username;
}

// Update the UI based on login status
function updateUI() {
  if (isLoggedIn()) {
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('signup-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'block';
    document.getElementById('welcome-message').innerText = `Welcome, ${getUsername()}`;
  } else {
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('signup-button').style.display = 'block';
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('welcome-message').innerText = '';
  }
}

// Logout functionality
document.getElementById('logout-button').addEventListener('click', () => {
  localStorage.removeItem('token');
  updateUI();
});

// Notes form submission
document.getElementById('notes-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const note = document.getElementById('note').value;
  const token = localStorage.getItem('token');

  const response = await fetch('/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ note })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Note added');
    fetchNotes();
  } else {
    alert('Failed to add note: ' + data.error);
  }
});

// Fetch and display user notes
async function fetchNotes() {
  const token = localStorage.getItem('token');

  const response = await fetch('/notes', {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  });

  const data = await response.json();
  if (response.ok) {
    // Display notes
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    data.forEach(note => {
      const noteElement = document.createElement('p');
      noteElement.innerText = note;
      notesContainer.appendChild(noteElement);
    });
  } else {
    alert('Failed to fetch notes: ' + data.error);
  }
}

// Update UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  if (isLoggedIn()) {
    fetchNotes();
  }
  else{
    console.log("You are not logged in");
  }
});
