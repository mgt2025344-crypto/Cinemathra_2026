// CINEMATHRA 2026 invitation settings.
// Change the event time below when it is confirmed.
// Time examples:  "6:00 PM"  (shown as a big clock-style time)
//                 "TIME TO BE ANNOUNCED"  (shown as text)
const EVENT_DETAILS = {
  date: "05 November 2026",
  time: "TIME TO BE ANNOUNCED",
  venue: "Andara Wawa Theatre"
};

/* ---------- helpers ---------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function safeText(value, fallback) {
  const cleaned = (value || "").trim();
  return cleaned ? cleaned.slice(0, 100) : fallback;
}

// Wrap every character in a span so CSS can animate letter by letter.
function splitLetters(el, baseDelay = 0, step = 60) {
  if (!el || el.dataset.split === "1") return;
  const text = el.textContent;
  el.textContent = "";
  el.dataset.split = "1";
  let index = 0;
  for (const char of text) {
    if (char === " ") { el.appendChild(document.createTextNode(" ")); continue; }
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = char;
    span.style.setProperty("--i", index);
    span.style.setProperty("--d", baseDelay + index * step);
    el.appendChild(span);
    index++;
  }
}

function parseDate(str) {
  const m = (str || "").trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return null;
  const monthIndex = MONTHS.findIndex(name => name.toLowerCase().startsWith(m[2].toLowerCase().slice(0, 3)));
  if (monthIndex < 0) return null;
  const day = parseInt(m[1], 10);
  const year = parseInt(m[3], 10);
  const weekday = WEEKDAYS[new Date(year, monthIndex, day).getDay()];
  return { day, year, month: MONTHS[monthIndex], weekday };
}

/* ---------- fill in content ---------- */
const lecturerName = document.getElementById("lecturerName");
const params = new URLSearchParams(window.location.search);
lecturerName.textContent = safeText(params.get("name"), "Distinguished Guest");
document.getElementById("lecturerTitle").textContent = safeText(params.get("title"), "Invited Guest");

// date
const calDay = document.getElementById("calDay");
const dateInfo = parseDate(EVENT_DETAILS.date);
if (dateInfo) {
  document.getElementById("calMonth").textContent = dateInfo.month.slice(0, 3).toUpperCase();
  calDay.textContent = String(dateInfo.day).padStart(2, "0");
  document.getElementById("eventMonth").textContent = dateInfo.month.toUpperCase();
  document.getElementById("eventDate").textContent = `${dateInfo.year} · ${dateInfo.weekday.toUpperCase()}`;
} else {
  calDay.textContent = "★";
  document.getElementById("calMonth").textContent = "DATE";
  document.getElementById("eventMonth").textContent = EVENT_DETAILS.date.toUpperCase();
  document.getElementById("eventDate").textContent = "";
}

// time (real time → big numerals, otherwise plain text)
const timeEl = document.getElementById("eventTime");
const timeMatch = EVENT_DETAILS.time.trim().match(/^(\d{1,2})[:.](\d{2})\s*(AM|PM)?$/i);
if (timeMatch) {
  timeEl.textContent = "";
  timeEl.classList.add("is-clock-time");
  const num = document.createElement("span");
  num.className = "time-num";
  num.textContent = `${timeMatch[1]}:${timeMatch[2]}`;
  timeEl.appendChild(num);
  if (timeMatch[3]) {
    const ampm = document.createElement("span");
    ampm.className = "time-ampm";
    ampm.textContent = timeMatch[3].toUpperCase();
    timeEl.appendChild(ampm);
  }
} else {
  timeEl.textContent = EVENT_DETAILS.time.toUpperCase();
}

document.getElementById("eventVenue").textContent = EVENT_DETAILS.venue;

/* ---------- letter-by-letter animation setup ---------- */
function prepareLetters() {
  splitLetters(document.querySelector(".word-the"), 250, 70);
  splitLetters(document.querySelector(".word-big"), 560, 110);
  splitLetters(document.querySelector(".word-screen"), 950, 70);
  splitLetters(document.querySelector(".word-awaits"), 1450, 65);
  splitLetters(document.getElementById("eventMonth"), 1100, 55);
}
prepareLetters();
splitLetters(document.querySelector(".welcome-screen h1 span"), 350, 85);

/* ---------- screens ---------- */
const stage = document.querySelector("main");
const welcomeScreen = document.getElementById("welcomeScreen");
const invitationScreen = document.getElementById("invitationScreen");
const openButton = document.getElementById("openInvitation");
const backButton = document.getElementById("backToCover");
const pages = [document.getElementById("leftPage"), document.getElementById("rightPage")];

let observer = null;
let countTimer = null;
let pageTimer = null;
let rightTimer = null;
let unfoldReadyAt = 0;
let isBusy = false;

// The cover swings open on its left edge, like the front of a real invitation.
const COVER_MS = prefersReducedMotion ? 1 : 1050;
const COVER_EASE = "cubic-bezier(.65, 0, .35, 1)";
const COVER_FRAMES = [
  { transform: "rotateY(0deg)",   filter: "brightness(1)" },
  { transform: "rotateY(-40deg)",  filter: "brightness(.9)", offset: .38 },
  { transform: "rotateY(-92deg)",  filter: "brightness(.5)" }
];

function isStacked() { return window.matchMedia("(max-width: 860px)").matches; }

// Count the calendar day up (00 → 05) with a little drama.
function runDayCounter() {
  if (!dateInfo || prefersReducedMotion) return;
  const target = dateInfo.day;
  const startDelay = 900;
  const duration = 1100;
  const start = performance.now() + startDelay;
  calDay.textContent = "00";
  cancelAnimationFrame(countTimer);
  const tick = now => {
    const t = Math.min(Math.max((now - start) / duration, 0), 1);
    const eased = 1 - Math.pow(1 - t, 3);
    calDay.textContent = String(Math.round(eased * target)).padStart(2, "0");
    if (t < 1) countTimer = requestAnimationFrame(tick);
  };
  countTimer = requestAnimationFrame(tick);
}

function doActivate(page) {
  if (page.classList.contains("in-view")) return;
  page.classList.add("in-view");
  if (page.id === "rightPage") runDayCounter();
}

function activatePage(page) {
  if (page.classList.contains("in-view")) return;
  // On a two-page spread, wait until the right page has finished unfolding.
  if (page.id === "rightPage" && !isStacked() && !prefersReducedMotion) {
    const wait = unfoldReadyAt - performance.now();
    if (wait > 0) {
      clearTimeout(rightTimer);
      rightTimer = setTimeout(() => doActivate(page), wait);
      return;
    }
  }
  doActivate(page);
}

function watchPages() {
  if (!("IntersectionObserver" in window)) { pages.forEach(activatePage); return; }
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { activatePage(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.18 });
  pages.forEach(page => observer.observe(page));
}

function stopWatching() {
  clearTimeout(pageTimer);
  clearTimeout(rightTimer);
  if (observer) { observer.disconnect(); observer = null; }
  cancelAnimationFrame(countTimer);
  pages.forEach(page => page.classList.remove("in-view"));
  if (dateInfo) calDay.textContent = String(dateInfo.day).padStart(2, "0");
}

function openInvitation() {
  if (isBusy) return;
  isBusy = true;
  window.scrollTo(0, 0);
  stage.classList.add("is-transitioning");

  // The invitation sits underneath the cover while the cover swings open.
  invitationScreen.hidden = false;
  invitationScreen.classList.remove("is-opening");
  void invitationScreen.offsetWidth;
  invitationScreen.classList.add("is-opening");

  unfoldReadyAt = performance.now() + 1900;
  pageTimer = setTimeout(watchPages, prefersReducedMotion ? 0 : 1000);

  const cover = welcomeScreen.animate(COVER_FRAMES, { duration: COVER_MS, easing: COVER_EASE, fill: "forwards" });
  cover.onfinish = () => {
    welcomeScreen.hidden = true;
    cover.cancel();
    stage.classList.remove("is-transitioning");
    isBusy = false;
  };
}

function returnToCover() {
  if (isBusy) return;
  isBusy = true;
  window.scrollTo(0, 0);
  stage.classList.add("is-transitioning");
  welcomeScreen.hidden = false;

  // The cover swings shut over the invitation.
  const cover = welcomeScreen.animate(COVER_FRAMES, { duration: COVER_MS, easing: COVER_EASE, fill: "forwards", direction: "reverse" });
  cover.onfinish = () => {
    stopWatching();
    invitationScreen.hidden = true;
    invitationScreen.classList.remove("is-opening");
    cover.cancel();
    stage.classList.remove("is-transitioning");
    window.scrollTo(0, 0);
    isBusy = false;
  };
}

openButton.addEventListener("click", openInvitation);
backButton.addEventListener("click", returnToCover);
