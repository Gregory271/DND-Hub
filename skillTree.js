window.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // SKILL NODE SELECTION SYSTEM
  // ===============================
  const skillNodes = document.querySelectorAll(".skill-node");
  let choiceOne = localStorage.getItem("choiceOne");

  // Helper: apply visual state to all nodes
  function updateVisuals(selectedId) {
    skillNodes.forEach(node => {
      if (node.id === selectedId) {
        node.classList.add("active-skill");
      } else {
        node.classList.remove("active-skill");
      }
    });
  }

  // Apply saved choice on load
  if (choiceOne) updateVisuals(choiceOne);

  // Handle clicks for all skill nodes
  skillNodes.forEach(node => {
    node.addEventListener("click", () => {
      const selectedId = node.id;
      localStorage.setItem("choiceOne", selectedId);
      updateVisuals(selectedId);
      console.log(`Skill chosen: ${selectedId}`);
    });
  });

  // ===============================
  // FIRE NODE ANIMATION (Canvas)
  // ===============================
  const container = document.querySelector("#f0 > div");

  // Create and size canvas to parent
  const canvas = document.createElement("canvas");
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.borderRadius = "50%";
  canvas.style.display = "block";
  canvas.style.background = "radial-gradient(circle at 50% 70%, #200000 0%, #000000 100%)";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  const maxParticles = 180;

  // Handle resize dynamically
  window.addEventListener("resize", () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  });

  function createParticle() {
    const x = canvas.width / 2 + (Math.random() - 0.5) * 40;
    const y = canvas.height * 0.7;
    const size = 2 + Math.random() * 4;
    const speedY = -1.2 - Math.random() * 1.5;
    const hue = 25 + Math.random() * 20; // orange/yellow tones
    particles.push({
      x, y, size, speedY,
      life: 60 + Math.random() * 40,
      hue,
    });
  }

  function draw() {
    // Fade previous frame (motion blur)
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Spawn new particles
    if (particles.length < maxParticles) createParticle();

    ctx.globalCompositeOperation = "lighter";

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const alpha = Math.max(p.life / 100, 0);

      // Gradient color from yellow → red → black
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      gradient.addColorStop(0, `hsla(${p.hue},100%,60%,${alpha})`);
      gradient.addColorStop(0.4, `hsla(${p.hue + 10},100%,40%,${alpha * 0.8})`);
      gradient.addColorStop(1, `rgba(0,0,0,0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Update position
      p.y += p.speedY;
      p.x += (Math.random() - 0.5) * 0.5;
      p.life--;

      if (p.life <= 0) particles.splice(i, 1);
    }

    // Add glowing core
    const g = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height * 0.8,
      10,
      canvas.width / 2,
      canvas.height * 0.8,
      80
    );
    g.addColorStop(0, "rgba(255,180,70,0.9)");
    g.addColorStop(1, "rgba(255,80,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height * 0.8, 80, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();

// ===============================
// TOOLTIP SYSTEM FOR SKILL NODES
// ===============================
const tooltip = document.getElementById("skill-tooltip");

skillNodes.forEach(node => {
  node.addEventListener("mouseenter", e => {
    const desc = node.getAttribute("data-description");
    tooltip.textContent = desc;
    tooltip.style.display = "block";
    tooltip.style.opacity = "1";
  });

  node.addEventListener("mousemove", e => {
    tooltip.style.left = e.pageX + 15 + "px";
    tooltip.style.top = e.pageY + 15 + "px";
  });

  // 👇 Replace your old mouseleave handler with this version
  node.addEventListener("mouseleave", e => {
    const toEl = e.relatedTarget;
    // If moving into another skill-node, don't hide tooltip
    if (toEl && toEl.classList.contains("skill-node")) return;

    tooltip.style.opacity = "0";
    setTimeout(() => {
      tooltip.style.display = "none";
    }, 200);
  });
});



});
