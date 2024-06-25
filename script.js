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
});
