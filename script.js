(() => {
  const MESSAGE =
    "Hallo Manel, wie geht es dir, deine Gesundheit, deine Stimmung, dein Leben, wie verbringst du deine Tage? Hoffe, alles läuft gut.";
  const OUTRO = "Hoffe, diese Nachricht lässt dich gut fühlen.";
  const SECRET =
    "hhh i expected that u gona try until find it";
  // vault key — obfuscated (not shown on screen)
  const VAULT_KEY = atob("Njk4");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stageLock = document.getElementById("stage-lock");
  const stageHack = document.getElementById("stage-hack");
  const stageMsg = document.getElementById("stage-msg");
  const breachBtn = document.getElementById("breach-btn");
  const ring = document.getElementById("ring");
  const bar = document.getElementById("bar");
  const pct = document.getElementById("pct");
  const phase = document.getElementById("phase");
  const sysLog = document.getElementById("sys-log");
  const messageEl = document.getElementById("message");
  const outroEl = document.getElementById("outro");
  const secondaryWrap = document.getElementById("secondary-wrap");
  const cursor = document.getElementById("cursor");
  const cursor2 = document.getElementById("cursor2");
  const cipher = document.getElementById("cipher");
  const msgShell = document.getElementById("msg-shell");
  const flash = document.getElementById("flash");
  const clockEl = document.getElementById("clock");
  const hashEl = document.getElementById("hash");
  const vault = document.getElementById("vault");
  const vaultForm = document.getElementById("vault-form");
  const keyInput = document.getElementById("key-input");
  const keyBtn = document.getElementById("key-btn");
  const vaultStatus = document.getElementById("vault-status");
  const secretWrap = document.getElementById("secret-wrap");
  const secretMsg = document.getElementById("secret-msg");
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");

  const CIRC = 2 * Math.PI * 88;

  /* ——— Background: network + rain ——— */
  let w = 0, h = 0, nodes = [], drops = [], raf = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(55, Math.floor((w * h) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
    }));
    const cols = Math.ceil(w / 16);
    drops = Array.from({ length: cols }, () => Math.random() * h);
  }

  function drawBg() {
    ctx.fillStyle = "rgba(2, 4, 6, 0.22)";
    ctx.fillRect(0, 0, w, h);

    // soft rain
    ctx.font = "11px JetBrains Mono, monospace";
    for (let i = 0; i < drops.length; i++) {
      const ch = Math.random() > 0.5 ? "1" : "0";
      ctx.fillStyle = Math.random() > 0.92 ? "rgba(0,229,255,0.55)" : "rgba(0,255,157,0.22)";
      ctx.fillText(ch, i * 16, drops[i]);
      drops[i] += 6 + Math.random() * 8;
      if (drops[i] > h) drops[i] = -20;
    }

    // nodes
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(0,255,157,${(1 - d / 130) * 0.28})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "#00ff9d";
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(drawBg);
  }

  resize();
  window.addEventListener("resize", resize);
  if (!reduceMotion) drawBg();
  else {
    ctx.fillStyle = "#020406";
    ctx.fillRect(0, 0, w, h);
  }

  /* ——— Idle ring pulse ——— */
  let idle = 0;
  function idleRing() {
    idle = (idle + 0.8) % 100;
    const offset = CIRC - (idle / 100) * CIRC * 0.22;
    ring.style.strokeDasharray = String(CIRC);
    ring.style.strokeDashoffset = String(offset);
    if (!breachBtn.disabled) requestAnimationFrame(idleRing);
  }
  if (!reduceMotion) idleRing();

  /* ——— Utils ——— */
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? Math.min(ms, 40) : ms));

  function doFlash() {
    flash.classList.add("on");
    setTimeout(() => flash.classList.remove("on"), 120);
  }

  function setRing(p) {
    ring.style.strokeDasharray = String(CIRC);
    ring.style.strokeDashoffset = String(CIRC - (p / 100) * CIRC);
  }

  function randHex(n) {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += Math.floor(Math.random() * 16).toString(16);
      if ((i + 1) % 2 === 0) s += " ";
    }
    return s.trim();
  }

  setInterval(() => {
    clockEl.textContent = new Date().toTimeString().slice(0, 8);
    hashEl.textContent = "0x" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase();
    if (!cipher.hidden) cipher.textContent = randHex(72);
  }, 160);

  /* ——— Breach flow ——— */
  const logs = [
    "[*] probing perimeter firewall…",
    "[+] port 443 open · TLS handshake OK",
    "[*] injecting polymorphic shellcode…",
    "[!] IDS signature bypassed",
    "[*] escalating privileges → root",
    "[+] vault unlocked · reading buffer",
    "[*] decoding UTF-8 / de payload…",
    "[+] integrity: SHA-256 MATCH",
    "[+] streaming stdout → display",
  ];

  const phases = [
    [12, "SCANNING"],
    [28, "INJECTING"],
    [46, "BYPASSING"],
    [63, "ESCALATING"],
    [78, "DECRYPTING"],
    [92, "VERIFYING"],
    [100, "COMPLETE"],
  ];

  async function runHack() {
    stageLock.hidden = true;
    stageHack.hidden = false;
    sysLog.textContent = "";
    let logI = 0;

    for (const [p, name] of phases) {
      phase.textContent = name;
      const start = parseInt(pct.textContent, 10) || 0;
      const steps = 8;
      for (let s = 1; s <= steps; s++) {
        const cur = start + ((p - start) * s) / steps;
        bar.style.width = cur + "%";
        pct.textContent = Math.round(cur) + "%";
        if (logI < logs.length && Math.random() > 0.35) {
          sysLog.textContent += logs[logI++] + "\n";
          sysLog.scrollTop = sysLog.scrollHeight;
        }
        await sleep(70 + Math.random() * 50);
      }
      await sleep(90);
    }

    while (logI < logs.length) {
      sysLog.textContent += logs[logI++] + "\n";
      await sleep(80);
    }

    doFlash();
    await sleep(280);
    stageHack.hidden = true;
    stageMsg.hidden = false;
    await revealMessages();
  }

  async function scrambleThenType(el, text, speed = 32) {
    const glyphs = "█▓▒░<>/\\|#@$%&*01アカサタナハマヤラワ";
    el.textContent = "";

    // scramble pass
    for (let pass = 0; pass < (reduceMotion ? 1 : 3); pass++) {
      let junk = "";
      for (let i = 0; i < Math.min(text.length, 48); i++) {
        junk += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = junk;
      msgShell.classList.add("shake");
      await sleep(70);
      msgShell.classList.remove("shake");
    }

    el.textContent = "";
    for (let i = 0; i < text.length; i++) {
      if (!reduceMotion && Math.random() < 0.08 && text[i] !== " ") {
        el.textContent += glyphs[Math.floor(Math.random() * glyphs.length)];
        await sleep(18);
        el.textContent = text.slice(0, i);
      }
      el.textContent = text.slice(0, i + 1);
      await sleep(speed + Math.random() * 28);
    }
  }

  async function revealMessages() {
    cipher.textContent = randHex(72);
    await scrambleThenType(messageEl, MESSAGE, 30);
    cursor.style.display = "none";
    await sleep(550);
    doFlash();
    secondaryWrap.hidden = false;
    await scrambleThenType(outroEl, OUTRO, 36);
    cursor2.style.display = "none";
    await sleep(600);
    showVault();
  }

  function showVault() {
    vault.hidden = false;
    vault.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    setTimeout(() => keyInput.focus(), 350);
  }

  let attempts = 0;
  let unlocked = false;

  vaultForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (unlocked) return;

    const guess = keyInput.value.trim();
    keyInput.classList.remove("wrong", "ok");

    if (!/^\d{3}$/.test(guess)) {
      vaultStatus.textContent = "need exactly 3 digits…";
      vaultStatus.className = "vault-status err";
      keyInput.classList.add("wrong");
      return;
    }

    attempts += 1;

    if (guess !== VAULT_KEY) {
      vaultStatus.textContent =
        attempts === 1
          ? "access denied · try again"
          : attempts < 5
            ? `access denied · attempt ${attempts}`
            : `still wrong · attempt ${attempts} · keep going…`;
      vaultStatus.className = "vault-status err";
      keyInput.classList.add("wrong");
      keyInput.select();
      msgShell.classList.add("shake");
      setTimeout(() => msgShell.classList.remove("shake"), 400);
      return;
    }

    unlocked = true;
    keyInput.classList.add("ok");
    keyInput.disabled = true;
    keyBtn.disabled = true;
    vaultStatus.textContent = "vault unlocked ✓";
    vaultStatus.className = "vault-status ok";
    doFlash();
    await sleep(280);
    secretWrap.hidden = false;
    secretWrap.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    await scrambleThenType(secretMsg, SECRET, 28);
  });

  keyInput.addEventListener("input", () => {
    keyInput.value = keyInput.value.replace(/\D/g, "").slice(0, 3);
    keyInput.classList.remove("wrong");
    if (!unlocked) {
      vaultStatus.textContent = "";
      vaultStatus.className = "vault-status";
    }
  });

  breachBtn.addEventListener("click", async () => {
    if (breachBtn.disabled) return;
    breachBtn.disabled = true;
    breachBtn.querySelector(".btn-text").textContent = "BREACHING…";

    for (let p = 0; p <= 100; p += 4) {
      setRing(p);
      await sleep(18);
    }
    doFlash();
    await sleep(200);
    await runHack();
  });
})();
