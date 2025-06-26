console.log("Script loaded");

function getNextSessionDate() {
  // Get current time in NY
  const now = new Date();
  const nowInNY = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));

  // Find next Thursday
  const dayOfWeek = nowInNY.getDay(); // 0=Sun, ..., 4=Thu
  const hour = nowInNY.getHours();
  const minute = nowInNY.getMinutes();

  let daysUntilThursday = (4 - dayOfWeek + 7) % 7;
  // If today is Thursday and before 6:30 PM, use today
  if (daysUntilThursday === 0 && (hour < 18 || (hour === 18 && minute < 30))) {
    daysUntilThursday = 0;
  } else if (daysUntilThursday === 0) {
    daysUntilThursday = 7;
  }

  // Build the next session date in NY time
  const nextSessionNY = new Date(nowInNY);
  nextSessionNY.setDate(nowInNY.getDate() + daysUntilThursday);
  nextSessionNY.setHours(18, 30, 0, 0); // 6:30 PM

  // Now, get the UTC time value for that NY time
  // This is the key: get the timestamp for NY time, then create a Date in UTC
  const nextSessionUTC = new Date(nextSessionNY.getTime() + (now.getTime() - nowInNY.getTime()));

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


document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll("nav .nav-link:not(.dropdown-toggle)").forEach((link) => {
    link.addEventListener("click", () => {
      console.log("Link clicked");
      const navbarResponsive = document.getElementById("navbarSupportedContent");
      if (navbarResponsive && navbarResponsive.classList.contains("show")) {
        const navbarToggler = document.querySelector(".navbar-toggler");
        if (navbarToggler) {
          console.log("Simulating hamburger button click");
          setTimeout(() => {
            navbarToggler.click();
          }, 100);
        } else {
          console.log("No navbar toggler found");
        }
      } else {
        console.log("Navbar is not open (no .show class)");
      }
    });
  });
});

