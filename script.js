// Tharushi Vishmika - Romantic Birthday Interactive Experience

document.addEventListener('DOMContentLoaded', () => {
  // Audio Controller
  const bgAudio = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const vinylDisc = document.getElementById('vinyl-disc');
  const musicLabel = document.getElementById('music-label');
  let isPlaying = false;

  // Web Audio Context for Sound Effects
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play Sound Effect Synth
  function playSound(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'bike') {
        // Motorcycle engine rumble synth
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 1.2);
        osc.frequency.exponentialRampToValueAtTime(50, now + 3.2);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 3.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 3.5);
      } else if (type === 'chime') {
        // Sparkle magical chime
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.08);

          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 1.3);
        });
      } else if (type === 'slice') {
        // Knife slice swoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.35);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'blow') {
        // Candle blow whoosh
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.linearRampToValueAtTime(100, now + 0.5);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'fanfare') {
        // Celebratory harmonic chord
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 2.5);
        });
      }
    } catch (e) {
      console.log('Audio synth notice:', e);
    }
  }

  // Toggle Music Play/Pause
  function toggleMusic(forcePlay = null) {
    getAudioContext();
    if (forcePlay === true) {
      bgAudio.play().then(() => {
        isPlaying = true;
        vinylDisc.classList.add('playing');
        musicLabel.textContent = 'Music: Playing 🎵';
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    } else if (forcePlay === false) {
      bgAudio.pause();
      isPlaying = false;
      vinylDisc.classList.remove('playing');
      musicLabel.textContent = 'Music: Paused ⏸️';
    } else {
      if (bgAudio.paused) {
        bgAudio.play();
        isPlaying = true;
        vinylDisc.classList.add('playing');
        musicLabel.textContent = 'Music: Playing 🎵';
      } else {
        bgAudio.pause();
        isPlaying = false;
        vinylDisc.classList.remove('playing');
        musicLabel.textContent = 'Music: Paused ⏸️';
      }
    }
  }

  musicToggle.addEventListener('click', () => toggleMusic());

  // Scene Navigation
  const scenes = {
    0: document.getElementById('scene-welcome'),
    1: document.getElementById('scene-bike'),
    2: document.getElementById('scene-letter'),
    3: document.getElementById('scene-cake'),
    4: document.getElementById('scene-gallery'),
    5: document.getElementById('scene-reply')
  };

  let currentScene = 0;

  function goToScene(index) {
    Object.values(scenes).forEach(scene => {
      if (scene) {
        scene.classList.remove('active');
      }
    });

    currentScene = index;
    if (scenes[currentScene]) {
      scenes[currentScene].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Trigger scene-specific animations
    if (index === 1) {
      startBikeScene();
    } else if (index === 3) {
      initCakeScene();
    } else if (index === 4) {
      initSittingBoyScene();
    }
  }

  // 1. Welcome Screen Trigger
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    toggleMusic(true);
    goToScene(1);
  });

  // 2. Bike Scene Animation Logic
  const bikeActor = document.getElementById('bike-actor');
  const standingBoy = document.getElementById('standing-boy');
  const bikeNextBtn = document.getElementById('bike-next-btn');
  const roadDashes = document.getElementById('road-dashes');

  function startBikeScene() {
    playSound('bike');
    bikeActor.classList.remove('ride-in');
    standingBoy.classList.remove('show');
    bikeNextBtn.style.display = 'none';
    roadDashes.classList.remove('stopped');

    // Trigger bike driving animation
    void bikeActor.offsetWidth;
    bikeActor.classList.add('ride-in');

    // After bike stops (~3.6s), road stops and boy stands with bouquet & letter
    setTimeout(() => {
      roadDashes.classList.add('stopped');
      standingBoy.classList.add('show');
      bikeNextBtn.style.display = 'inline-flex';
      playSound('chime');
    }, 3600);
  }

  bikeNextBtn.addEventListener('click', () => {
    goToScene(2);
  });

  // 3. Letter Opening Logic
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const letterPaper = document.getElementById('letter-paper');
  const letterNextBtn = document.getElementById('letter-next-btn');

  envelope.addEventListener('click', openLetter);
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openLetter();
  });

  function openLetter() {
    if (envelope.classList.contains('open')) return;
    playSound('chime');
    envelope.classList.add('open');
    createHeartSparks(window.innerWidth / 2, window.innerHeight / 2);

    setTimeout(() => {
      envelope.style.display = 'none';
      letterPaper.style.display = 'block';
    }, 800);
  }

  letterNextBtn.addEventListener('click', () => {
    goToScene(3);
  });

  // 4. Cake Cutting Logic
  const knifeTool = document.getElementById('knife-tool');
  const cakeWrapper = document.getElementById('cake-wrapper');
  const cakeSlice = document.getElementById('cake-slice');
  const cakeCutBtn = document.getElementById('cake-cut-btn');
  const cakeNextBtn = document.getElementById('cake-next-btn');
  const cakeStatusMsg = document.getElementById('cake-status-msg');
  const flames = document.querySelectorAll('.flame');
  const candles = document.querySelectorAll('.candle');
  let cakeCutDone = false;

  function initCakeScene() {
    cakeCutDone = false;
    cakeSlice.style.display = 'none';
    cakeWrapper.classList.remove('cake-cut');
    flames.forEach(f => f.classList.remove('blown-out'));
    candles.forEach(c => c.classList.remove('blown'));
    cakeNextBtn.style.display = 'none';
    cakeStatusMsg.textContent = 'Swipe across the cake or tap the knife to cut your birthday slice! 🎂';
  }

  function cutTheCake() {
    if (cakeCutDone) return;
    cakeCutDone = true;

    playSound('slice');

    // Slicing animation
    cakeWrapper.classList.add('cake-cut');

    setTimeout(() => {
      // Blow candles
      playSound('blow');
      flames.forEach(f => f.classList.add('blown-out'));
      candles.forEach(c => c.classList.add('blown'));

      // Confetti & Fireworks
      playSound('fanfare');
      fireConfettiCelebration();

      cakeStatusMsg.innerHTML = '🎉 Happy Birthday Tharushi Vishmika! May all your wishes come true! ✨';
      cakeNextBtn.style.display = 'inline-flex';
      cakeCutBtn.style.display = 'none';
    }, 500);
  }

  knifeTool.addEventListener('click', cutTheCake);
  cakeCutBtn.addEventListener('click', cutTheCake);
  cakeWrapper.addEventListener('click', cutTheCake);

  cakeNextBtn.addEventListener('click', () => {
    goToScene(4);
  });

  // 5. Boy Sitting Scene & Photo Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightbox = document.getElementById('close-lightbox');
  const galleryNextBtn = document.getElementById('gallery-next-btn');

  function initSittingBoyScene() {
    // Scroll memory reel slightly
    const reel = document.getElementById('memories-reel');
    if (reel) {
      reel.scrollLeft = 0;
    }
  }

  // Polaroid Card Click -> Lightbox
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-caption');
      if (img && caption) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption.textContent;
        lightboxModal.classList.add('active');
        playSound('chime');
      }
    });
  });

  closeLightbox.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });

  galleryNextBtn.addEventListener('click', () => {
    goToScene(5);
  });

  // 6. Reply & WhatsApp Integration
  const replyPills = document.querySelectorAll('.reply-pill');
  const replyTextarea = document.getElementById('reply-text');
  const sendWhatsappBtn = document.getElementById('send-whatsapp');
  let selectedPillText = 'YES! With all my heart! 💍💖';

  replyPills.forEach(pill => {
    pill.addEventListener('click', () => {
      replyPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedPillText = pill.textContent.trim();
      playSound('chime');
      createHeartSparks(window.innerWidth / 2, window.innerHeight * 0.7);
    });
  });

  sendWhatsappBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const customMessage = replyTextarea.value.trim();
    let finalMessage = `Hey! ❤️\n\nI just explored the birthday surprise you made for me, and I loved every second! ✨\n\nMy answer: "${selectedPillText}"`;
    if (customMessage) {
      finalMessage += `\n\nSpecial message from Tharushi:\n"${customMessage}"`;
    }
    finalMessage += `\n\nForever yours, Tharushi Vishmika 🌸`;

    const encoded = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank');

    fireConfettiCelebration();
  });

  // Canvas Starfield
  initStarfield();

  // Canvas Falling Rose Petals
  initPetals();

  // Canvas Confetti
  initConfetti();
});

// Canvas 1: Starfield with Shooting Stars
function initStarfield() {
  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  const stars = [];
  const numStars = 120;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005
    });
  }

  // Shooting star
  let shootingStar = null;
  function maybeTriggerShootingStar() {
    if (!shootingStar && Math.random() < 0.015) {
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1
      };
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Stars
    stars.forEach(s => {
      s.alpha += s.speed;
      const glow = (Math.sin(s.alpha) + 1) / 2 * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${glow})`;
      ctx.shadowBlur = s.radius * 3;
      ctx.shadowColor = '#ffd166';
      ctx.fill();
    });

    // Shooting star
    maybeTriggerShootingStar();
    if (shootingStar) {
      ctx.save();
      ctx.beginPath();
      const endX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
      const endY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
      const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();

      shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
      shootingStar.alpha -= 0.02;
      if (shootingStar.alpha <= 0) shootingStar = null;
    }

    requestAnimationFrame(draw);
  }
  draw();
}

// Canvas 2: Falling Rose Petals
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  const petals = [];
  const numPetals = 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < numPetals; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 10,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      oscillation: Math.random() * Math.PI * 2,
      oscillationSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.4 ? 'rgba(255, 94, 130, 0.65)' : 'rgba(255, 175, 195, 0.7)'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.y += p.speedY;
      p.oscillation += p.oscillationSpeed;
      p.x += Math.sin(p.oscillation) * 1.1 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      // Draw smooth romantic petal curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(255, 64, 113, 0.4)';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// Canvas 3: Confetti & Heart Fireworks
let confettiParticles = [];
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // Gravity
      p.vx *= 0.98; // Air resistance
      p.rotation += p.vRot;
      p.alpha -= 0.008;

      if (p.alpha <= 0 || p.y > height) {
        confettiParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.isHeart) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const topCurveHeight = p.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, p.size, 0, p.size * 1.2);
        ctx.bezierCurveTo(0, p.size, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }
  draw();
}

function fireConfettiCelebration() {
  const colors = ['#ff4071', '#ffd166', '#ff7597', '#ffffff', '#06d6a0', '#118ab2', '#b5179e'];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.45;

  for (let i = 0; i < 160; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 16 + 5;
    confettiParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: Math.random() * 12 + 6,
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      isHeart: Math.random() > 0.5
    });
  }
}

function createHeartSparks(x, y) {
  const colors = ['#ff4071', '#ff7597', '#ffd166'];
  for (let i = 0; i < 25; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    confettiParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 10 + 6,
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      isHeart: true
    });
  }
}
