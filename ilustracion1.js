const canvas = document.getElementById('loveRain');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];
const fireworks = [];
const colors = ['#ff66cc', '#ff3399', '#ff99cc', '#ff66aa'];

class Heart {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = Math.random() * 14 + 8;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) this.y = -20;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px sans-serif`;
    ctx.fillText("Te Amo Gabriela", this.x, this.y);
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 60;
    this.size = 30;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.life--;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px sans-serif`;
    ctx.fillText("Te Amo", this.x, this.y);
  }
}

function createFirework(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  fireworks.push(new Firework(x, y));
}

for (let i = 0; i < 200; i++) {
  hearts.push(new Heart(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 1));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let h of hearts) {
    h.update();
    h.draw();
  }
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    fw.update();
    fw.draw();
    if (fw.life <= 0) fireworks.splice(i, 1);
  }
  requestAnimationFrame(animate);
}

animate();
