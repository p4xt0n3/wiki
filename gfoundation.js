const LS_KEY = "tale_settings_v1";
function getSettings(){
  try{ return JSON.parse(localStorage.getItem(LS_KEY))||{theme:"light",lang:"en"}; }catch{ return {theme:"light",lang:"en"}; }
}

const pageTitle = document.getElementById("pageTitle");
const enBlock = document.querySelector(".lang.en");
const zhBlock = document.querySelector(".lang.zh");
const caption = document.querySelector(".caption");

function apply(lang){
  const zh = lang === "zh";
  document.documentElement.setAttribute("lang", zh ? "zh" : "en");
  pageTitle.textContent = zh ? "G基金会" : "G Foundation";
  if (caption) caption.textContent = zh ? "G基金会" : "G Foundation";
  enBlock.hidden = zh;
  zhBlock.hidden = !zh;
  document.title = zh ? "G基金会 - 宇宙物语：百科" : "G Foundation - The Tale of Universe Wiki";
}

const s = getSettings();
document.documentElement.setAttribute("data-theme", s.theme);
apply(s.lang);

window.addEventListener("settings:change", e => {
  const { theme, lang } = e.detail || {};
  if (theme) document.documentElement.setAttribute("data-theme", theme);
  if (lang) apply(lang);
});

