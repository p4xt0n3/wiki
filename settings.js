// New file: settings.js
const LS_KEY = "tale_settings_v1";
const defaults = { theme: "light", lang: "en" };
function load() { try { return {...defaults, ...JSON.parse(localStorage.getItem(LS_KEY) || "{}")}; } catch { return defaults; } }
function save(s) { localStorage.setItem(LS_KEY, JSON.stringify(s)); window.dispatchEvent(new CustomEvent("settings:change", { detail: s })); }

const btn = document.getElementById("settingsBtn");
const modal = document.getElementById("settingsModal");
const close = document.getElementById("settingsClose");
const themeBtns = document.querySelectorAll(".theme-btn");
const langBtns = document.querySelectorAll(".lang-btn");
const settingsTitle = document.getElementById("settingsTitle");

let state = load();
function applyState() {
  document.documentElement.setAttribute("data-theme", state.theme);
  themeBtns.forEach(b => b.classList.toggle("active", b.dataset.theme === state.theme));
  langBtns.forEach(b => b.classList.toggle("active", b.dataset.lang === state.lang));
  // translate modal labels
  if (state.lang === "zh") {
    settingsTitle.textContent = "设置";
    document.querySelectorAll(".setting-row > label")[0].textContent = "主题";
    document.querySelectorAll(".setting-row > label")[1].textContent = "语言";
    themeBtns.forEach(b => b.textContent = b.dataset.theme === "light" ? "浅色" : "深色");
    langBtns.forEach(b => b.textContent = b.dataset.lang === "en" ? "English" : "中文");
  } else {
    settingsTitle.textContent = "Settings";
    document.querySelectorAll(".setting-row > label")[0].textContent = "Theme";
    document.querySelectorAll(".setting-row > label")[1].textContent = "Language";
    themeBtns.forEach(b => b.textContent = b.dataset.theme === "light" ? "Light" : "Dark");
    langBtns.forEach(b => b.textContent = b.dataset.lang === "en" ? "English" : "中文");
  }
}
applyState();
window.addEventListener("settings:change", (e)=> { state = e.detail; applyState(); });

// UI interactions
btn.addEventListener("click", ()=> { modal.classList.add("show"); modal.setAttribute("aria-hidden","false"); });
close.addEventListener("click", ()=> { modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); });
modal.addEventListener("click", (e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); } });
themeBtns.forEach(b => b.addEventListener("click", ()=> { state.theme = b.dataset.theme; save(state); applyState(); }));
langBtns.forEach(b => b.addEventListener("click", ()=> { state.lang = b.dataset.lang; save(state); applyState(); }));
// emit initial to let app.js sync
window.dispatchEvent(new CustomEvent("settings:change", { detail: state }));