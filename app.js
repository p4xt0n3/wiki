import debounce from "debounce";
import { KEYWORDS } from "./keywords.js";

let currentLang = "en";
window.addEventListener("settings:change", e => {
  const s = e.detail;
  if (s?.lang) { currentLang = s.lang; translatePage(currentLang); }
  if (s?.theme) document.documentElement.setAttribute("data-theme", s.theme);
});

function translatePage(lang){
  const titleEl = document.querySelector(".title");
  const subEl = document.querySelector(".subtitle");
  const hintEl = document.querySelector(".hint");
  const footerEl = document.querySelector(".foot small");
  if (lang === "zh") {
    titleEl.textContent = "宇宙物语：百科";
    subEl.textContent = "你可以在这里找到所有关于宇宙物语的东西...";
    hintEl.textContent = "按回车转到首个结果";
    footerEl.textContent = "社区驱动的百科";
  } else {
    titleEl.textContent = "The Tale of Universe : Wiki";
    subEl.textContent = "You can find anything in here within The Tale of Universe Series...";
    hintEl.textContent = "Press Enter to go to the top result";
    footerEl.textContent = "Community-driven compendium";
  }
  // refresh suggestions if any
  search(input.value);
}

const input = document.getElementById("searchInput");
const list = document.getElementById("suggestions");

function render(results, query) {
  if (!results.length || !query) { list.classList.remove("show"); list.innerHTML = ""; return; }
  const q = query.toLowerCase();
  list.innerHTML = results.map(item => {
    const name = currentLang === "zh" && item.zh ? item.zh : item.name;
    const i = name.toLowerCase().indexOf(q);
    const html = i >= 0
      ? `${name.slice(0,i)}<span class="match">${name.slice(i,i+q.length)}</span>${name.slice(i+q.length)}`
      : name;
    return `<li role="option" data-url="${item.url}" tabindex="0">${html}</li>`;
  }).join("");
  list.classList.add("show");
}

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) { render([], ""); return; }
  const results = KEYWORDS.filter(k => {
    const a = k.name.toLowerCase();
    const b = (k.zh || "").toLowerCase();
    return a.includes(q) || b.includes(q);
  });
  render(results, q);
}

const onType = debounce(e => search(e.target.value), 120);
input.addEventListener("input", onType);

list.addEventListener("click", e => {
  const li = e.target.closest("li[data-url]");
  if (li) window.location.href = li.dataset.url;
});

list.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const li = e.target.closest("li[data-url]");
    if (li) window.location.href = li.dataset.url;
  }
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const q = input.value.trim().toLowerCase();
    const top = KEYWORDS.find(k => {
      const a = k.name.toLowerCase();
      const b = (k.zh || "").toLowerCase();
      return a.includes(q) || b.includes(q);
    });
    if (top) { window.location.href = top.url; }
  }
});