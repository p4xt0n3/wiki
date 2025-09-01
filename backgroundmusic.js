const LS_KEY = "tale_settings_v1";
const tracks = [
  { name: "G Foundation", file: "G Foundation.mp3" },
  { name: "Fusioness", file: "Fusioness.mp3" },
  { name: "AMOUNT OF SUBSTANCE!!", file: "AMOUNT OF SUBSTANCE!!.mp3" },
  { name: "THE DEATH OF 87!!", file: "THE DEATH OF 87!!.mp3" },
  { name: "SURFACE!!", file: "SURFACE!!.mp3" },
  { name: "ANALOG!!", file: "ANALOG!!.mp3" },
  { name: "WATASHIWA WONDA OB U!!", file: "WATASHIWA WONDA OB U!!.mp3" },
  { name: "Cat", file: "Cat.mp3" }
];

function load() { try { return JSON.parse(localStorage.getItem(LS_KEY))||{}; } catch { return {}; } }
let state = { music:true, ...load() };

const audio = new Audio();
audio.volume = 0.45;
audio.preload = "auto";
let current = -1;

const toast = document.createElement("div");
toast.className = "bgm-toast";
document.body.appendChild(toast);
let toastTimer;

function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove("show"), 2600);
}

function pickNext() {
  if (tracks.length === 0) return -1;
  let idx = Math.floor(Math.random() * tracks.length);
  if (tracks.length > 1 && idx === current) idx = (idx + 1) % tracks.length;
  return idx;
}

async function playIndex(idx){
  if (idx < 0) return;
  current = idx;
  const t = tracks[idx];
  audio.src = t.file;
  try {
    await audio.play();
    showToast(`Background Music Playing (${t.name})…`);
  } catch {
    // Autoplay blocked; wait for user gesture
    const kick = () => { document.removeEventListener("pointerdown", kick, true); document.removeEventListener("keydown", kick, true); playIndex(current); };
    document.addEventListener("pointerdown", kick, true);
    document.addEventListener("keydown", kick, true);
  }
}

audio.addEventListener("ended", ()=> {
  if (!state.music) return;
  const next = pickNext();
  playIndex(next);
});

function startIfNeeded(){
  if (!state.music) { audio.pause(); return; }
  if (audio.paused) {
    const next = pickNext();
    playIndex(next);
  }
}

// respond to settings changes
window.addEventListener("settings:change", e => {
  state = { ...state, ...(e.detail||{}) };
  if (state.music) startIfNeeded(); else audio.pause();
});

// initial kick
document.addEventListener("DOMContentLoaded", startIfNeeded);