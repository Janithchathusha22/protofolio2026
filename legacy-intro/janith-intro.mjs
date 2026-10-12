/** Janith Chathusha — dependency-free, five-second loading intro.
 * Mounts a temporary modal overlay. Your existing home page stays underneath.
 */
const SESSION_KEY = 'janith-loading-intro-v2';
let active = null;
const clamp = n => Math.max(0, Math.min(1, n));
const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };

export function mountJanithIntro(options = {}) {
  if (typeof document === 'undefined') throw new Error('Mount the intro in the browser.');
  if (active) return active;
  const {
    imageUrl = '/intro/valley.jpg',
    oncePerSession = true,
    name = 'Janith Chathusha',
    firstLine = 'Driven by curiosity.',
    secondLine = 'Learning. Building. Becoming.',
    finalLine = 'Turning ideas into possibilities.',
    onComplete,
  } = options;
  let resolveFinished;
  const finished = new Promise(resolve => { resolveFinished = resolve; });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let seen = false;
  try { seen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch {}
  const noopHandle = reason => {
    resolveFinished(reason);
    // Deferred so React's effect can install its cleanup first.
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) onComplete?.(reason); });
    return { finished, skip() {}, destroy() { cancelled = true; } };
  };
  if (oncePerSession && seen) return noopHandle('already-seen');
  if (reduced.matches) return noopHandle('reduced-motion');
  if (!document.body) throw new Error('Mount after the document body is available.');

  const host = document.createElement('div');
  const shadow = host.attachShadow({ mode: 'open' });
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-label', name + ' — portfolio introduction');
  const style = document.createElement('style');
  style.textContent = `
    dialog{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;overflow:hidden;background:#040d15;color:#e1e9e8;box-sizing:border-box;color-scheme:dark;}
    dialog::backdrop{background:transparent}
    *{box-sizing:border-box}
    .frame{position:absolute;inset:0;font-family:Arial,Helvetica,sans-serif;background:#040d15}
    canvas{width:100%;height:100%;display:block}
    .top{position:absolute;inset:26px 34px auto;display:flex;align-items:center;justify-content:space-between;gap:20px}
    .name{margin:0;font:400 15px Georgia,'Times New Roman',serif;letter-spacing:1.3px;color:#e1e9e8;text-shadow:0 2px 16px #040d15}
    .skip{flex-shrink:0;background:#040d1570;color:#c4d0d6;border:1px solid #71838b55;padding:12px 15px;font:400 11px Arial,Helvetica,sans-serif;letter-spacing:.7px;cursor:pointer}
    .skip:hover{background:#233c4b70;border-color:#a4b3ba}
    .skip:focus-visible{outline:2px solid #e1e9e8;outline-offset:5px}
    .copy{position:absolute;left:24px;right:24px;bottom:8%;text-align:center;pointer-events:none;text-shadow:0 2px 24px #040d15}
    .kicker{font-size:10px;line-height:1.6;letter-spacing:3px;color:#abbfc8;margin:0 0 14px;text-transform:uppercase}
    .line{font:400 italic clamp(23px,3.6vw,38px)/1.25 Georgia,'Times New Roman',serif;letter-spacing:-.4px;margin:0;color:#e1e9e8;min-height:2.5em}
    .a11y{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
    @media(max-width:520px){.top{inset:20px 20px auto;gap:12px}.name{font-size:13px;letter-spacing:.3px}.skip{padding:12px;font-size:10px}.copy{bottom:10%}.kicker{font-size:9px;letter-spacing:2px}}
  `;
  const frame = document.createElement('div'); frame.className = 'frame';
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const top = document.createElement('div'); top.className = 'top';
  const title = document.createElement('p'); title.className = 'name'; title.textContent = name;
  const skipButton = document.createElement('button');
  skipButton.type = 'button'; skipButton.className = 'skip'; skipButton.textContent = 'Skip intro ↗';
  const copy = document.createElement('div'); copy.className = 'copy';
  const kicker = document.createElement('p'); kicker.className = 'kicker'; kicker.textContent = 'A journey of curiosity & creation';
  const line = document.createElement('p'); line.className = 'line'; line.textContent = firstLine;
  const accessible = document.createElement('span'); accessible.className = 'a11y';
  accessible.textContent = 'A silver star descends into a distant figure. Your home page will appear after five seconds. You can skip this introduction.';
  top.append(title, skipButton); copy.append(kicker, line); frame.append(canvas, top, copy, accessible);
  dialog.append(frame); shadow.append(style, dialog);
  const ctx = canvas.getContext('2d');
  const plate = document.createElement('canvas'); const pc = plate.getContext('2d');
  if (!ctx || !pc) return noopHandle('canvas-unavailable');

  let stopped = false, ready = false, running = false, animation = 0, startedAt = 0;
  let width = 1, height = 1, dpr = 1, elapsed = 0, captionIndex = -1;
  const previousFocus = document.activeElement;
  const oldOverflow = document.body.style.overflow;
  let resizeObserver;
  let watchdog;
  const image = new Image(); image.decoding = 'async';
  function finish(reason = 'completed') {
    if (stopped) return;
    stopped = true; running = false;
    cancelAnimationFrame(animation); clearTimeout(watchdog);
    resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', visibilityChanged);
    reduced.removeEventListener('change', motionChanged);
    image.onload = null; image.onerror = null;
    if (dialog.open) dialog.close();
    host.remove();
    document.body.style.overflow = oldOverflow;
    active = null;
    // React Strict Mode cleanup must not mark an unfinished intro as seen.
    if (reason === 'completed' || reason === 'skipped') {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
    }
    if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
    resolveFinished(reason);
    if (reason !== 'cancelled') onComplete?.(reason);
  }
  const handle = { finished, skip: () => finish('skipped'), destroy: () => finish('cancelled') };
  active = handle;

  // Original artwork is 736 × 1104. Chest point: (368, 654).
  // This one transform drives BOTH artwork and every light effect.
  function placement(t) {
    const zoom = 1 + .02 * ease(t / 3.5) + .035 * ease((t - 3.5) / .8);
    const scale = Math.min(height * 1.1 / 1104, width / 736) * zoom;
    return { scale, x: width / 2 - 368 * scale, y: height * .55 - 654 * scale };
  }
  function glow(x, y, radius, opacity) {
    if (radius <= 0 || opacity <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `rgba(255,249,233,${opacity})`);
    g.addColorStop(.18, `rgba(225,233,232,${opacity * .68})`);
    g.addColorStop(.55, `rgba(164,189,201,${opacity * .18})`);
    g.addColorStop(1, 'rgba(113,131,139,0)');
    ctx.fillStyle = g; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function render(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#040d15'; ctx.fillRect(0, 0, width, height);
    const m = placement(t), s = m.scale, x = width / 2, chest = m.y + 654 * s, feet = m.y + 670 * s;
    const atmosphere = ctx.createRadialGradient(x, chest, 1, x, chest, Math.max(width, height) * .7);
    atmosphere.addColorStop(0, '#1a303e'); atmosphere.addColorStop(.48, '#091925'); atmosphere.addColorStop(1, '#040d15');
    ctx.fillStyle = atmosphere; ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = .7 + .3 * ease(t / .7);
    ctx.drawImage(plate, m.x, m.y, 736 * s, 1104 * s); ctx.globalAlpha = 1;
    const vignette = ctx.createLinearGradient(0, 0, 0, height);
    vignette.addColorStop(0, '#040d1526'); vignette.addColorStop(.65, '#040d1500'); vignette.addColorStop(1, '#040d15dc');
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, width, height);
    const progress = clamp((t - .7) / 2.8);
    const travel = 1 - Math.pow(1 - progress, 1.7);
    const y = m.y + (85 + (654 - 85) * travel) * s;
    const absorb = 1 - ease((t - 3.12) / .38), strength = ease(t / .55) * absorb;
    if (t < 3.5) {
      const length = (40 + 100 * Math.sin(progress * Math.PI)) * s * strength;
      const trail = ctx.createLinearGradient(x, y - length, x, y);
      trail.addColorStop(0, '#e1e9e800'); trail.addColorStop(1, `rgba(225,233,232,${.84 * strength})`);
      ctx.fillStyle = trail; ctx.fillRect(x - .65, y - length, 1.3, length);
      glow(x, y, Math.max(18, 43 * s) * (.4 + .6 * absorb), .97 * strength);
      ctx.fillStyle = `rgba(255,249,233,${strength})`; ctx.beginPath();
      ctx.arc(x, y, Math.max(1.2, 3.1 * s) * (.3 + .7 * absorb), 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(225,233,232,${.65 * strength})`; ctx.lineWidth = .7;
      ctx.beginPath(); ctx.moveTo(x - 8 * absorb, y); ctx.lineTo(x + 8 * absorb, y);
      ctx.moveTo(x, y - 14 * absorb); ctx.lineTo(x, y + 14 * absorb); ctx.stroke();
      for (let i = 0; i < 9; i++) {
        const f = (t * .26 + i * .117) % 1;
        ctx.fillStyle = `rgba(225,233,232,${.25 * (1 - f) * strength})`;
        ctx.beginPath(); ctx.arc(x + Math.sin(i * 2.4 + t) * 8 * s, y - f * 80 * s, .65, 0, Math.PI * 2); ctx.fill();
      }
    }
    const entered = ease((t - 3.06) / .44);
    if (entered) {
      glow(x, chest, 23 * s, .58 * entered);
      ctx.save(); ctx.translate(x, feet + 70 * s); ctx.scale(.12, 1);
      glow(0, 0, 100 * s, .55 * entered); ctx.restore();
      ctx.strokeStyle = `rgba(225,233,232,${.72 * entered})`; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.ellipse(x, chest + 2 * s, 3 * s, 8 * s, 0, -Math.PI, 0); ctx.stroke();
    }
    if (t >= 3.5) {
      const q = ease((t - 3.5) / .95), radius = 12 + q * Math.hypot(width, height) * 1.15;
      // A stronger, gradual heaven-light bloom — no sudden white flash.
      glow(x, chest, radius, .78 * q);
      ctx.strokeStyle = `rgba(225,233,232,${.24 * (1 - q)})`; ctx.lineWidth = .7;
      ctx.beginPath(); ctx.arc(x, chest, 8 + q * 240 * s, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, feet + 35 * s + q * 45 * s, (15 + q * 190) * s, (3 + q * 24) * s, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(225,233,232,${.22 * ease((t - 3.9) / .55)})`; ctx.fillRect(0, 0, width, height);
    }
    const index = t < 1.55 ? 0 : t < 3.3 ? 1 : 2;
    if (captionIndex !== index) { line.textContent = [firstLine, secondLine, finalLine][index]; captionIndex = index; }
    const localStart = index === 0 ? 0 : index === 1 ? 1.55 : 3.3;
    const localEnd = index === 0 ? 1.55 : index === 1 ? 3.3 : 4.5;
    line.style.opacity = String(ease((t - localStart) / .22) * (1 - ease((t - (localEnd - .2)) / .2)));
    copy.style.opacity = String(1 - ease((t - 4.02) / .38));
    top.style.opacity = String(1 - ease((t - 4.12) / .35));
    // Fade the OVERLAY, revealing the existing page. No homepage is generated.
    dialog.style.opacity = String(1 - ease((t - 4.4) / .6));
  }
  function tick(now) {
    if (stopped || !running) return;
    elapsed = Math.min((now - startedAt) / 1000, 5);
    if (elapsed >= 5) { finish('completed'); return; }
    render(elapsed); animation = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = dialog.getBoundingClientRect(); width = rect.width; height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    if (ready && !stopped) render(elapsed);
  }
  function visibilityChanged() {
    if (running && !document.hidden) {
      cancelAnimationFrame(animation); tick(performance.now());
    }
  }
  function motionChanged() { if (reduced.matches) finish('reduced-motion'); }
  skipButton.addEventListener('click', handle.skip);
  dialog.addEventListener('cancel', event => { event.preventDefault(); handle.skip(); });
  document.addEventListener('visibilitychange', visibilityChanged);
  reduced.addEventListener('change', motionChanged);
  document.body.append(host);
  try { dialog.showModal(); } catch { finish('dialog-unavailable'); return handle; }
  document.body.style.overflow = 'hidden';
  skipButton.focus({ preventScroll: true });
  resizeObserver = new ResizeObserver(resize); resizeObserver.observe(dialog); resize();
  // Asset loading is separate from the 5 s sequence and can never block indefinitely.
  watchdog = setTimeout(() => finish('asset-timeout'), 8000);
  image.onload = () => {
    if (stopped) return;
    clearTimeout(watchdog);
    plate.width = 736; plate.height = 1104; pc.drawImage(image, 0, 0, 736, 1104);
    pc.globalCompositeOperation = 'destination-in';
    const mask = pc.createLinearGradient(0, 0, 736, 0);
    mask.addColorStop(0, '#0000'); mask.addColorStop(.1, '#0009'); mask.addColorStop(.22, '#000');
    mask.addColorStop(.78, '#000'); mask.addColorStop(.9, '#0009'); mask.addColorStop(1, '#0000');
    pc.fillStyle = mask; pc.fillRect(0, 0, 736, 1104); pc.globalCompositeOperation = 'source-over';
    ready = true; running = true; startedAt = performance.now(); render(0);
    animation = requestAnimationFrame(tick);
  };
  image.onerror = () => finish('asset-error');
  image.src = imageUrl;
  return handle;
}
