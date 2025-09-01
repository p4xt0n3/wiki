const LS_KEY = "tale_settings_v1";

function getSettings(){
  try{ 
    return JSON.parse(localStorage.getItem(LS_KEY))||{theme:"light",lang:"en"};
  }catch{
    return {theme:"light",lang:"en"};
  }
}

const pageTitle = document.getElementById("pageTitle");
const caption = document.getElementById("imgCaption");
const enBlock = document.querySelector(".lang.en");
const zhBlock = document.querySelector(".lang.zh");

function apply(lang){
  const zh = lang === "zh";
  document.documentElement.setAttribute("lang", zh ? "zh" : "en");
  pageTitle.textContent = zh ? "内森 · 雷德谢德" : "Nathan Redshed";
  caption.textContent = zh ? "内森·雷德谢德，by Olatoks" : "Nathan Redshed, by Steventrials200";
  enBlock.hidden = zh; zhBlock.hidden = !zh;
  document.title = zh ? "内森 · 雷德谢德 - 宇宙物语：百科" : "Nathan Redshed - The Tale of Universe Wiki";
}

const s = getSettings();
document.documentElement.setAttribute("data-theme", s.theme);
apply(s.lang);

window.addEventListener("settings:change", e => {
  const { theme, lang } = e.detail || {};
  if (theme) document.documentElement.setAttribute("data-theme", theme);
  if (lang) apply(lang);
});

