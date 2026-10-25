// CINEMATHRA 2026 invitation settings.
// Change the event time below when it is confirmed.
const EVENT_DETAILS = {
  date: "05 November 2026",
  time: "TIME TO BE ANNOUNCED",
  venue: "Andara Wawa Theatre"
};

const params = new URLSearchParams(window.location.search);
const nameParam = params.get("name");
const titleParam = params.get("title");

function safeText(value, fallback) {
  const cleaned = (value || "").trim();
  return cleaned ? cleaned.slice(0, 100) : fallback;
}

document.getElementById("lecturerName").textContent =
  safeText(nameParam, "Distinguished Guest");
document.getElementById("lecturerTitle").textContent =
  safeText(titleParam, "Invited Guest");
document.getElementById("eventDate").textContent = EVENT_DETAILS.date.toUpperCase();
document.getElementById("eventTime").textContent = EVENT_DETAILS.time.toUpperCase();
document.getElementById("eventVenue").textContent = EVENT_DETAILS.venue;

const welcomeScreen = document.getElementById("welcomeScreen");
const invitationScreen = document.getElementById("invitationScreen");
const openButton = document.getElementById("openInvitation");
const backButton = document.getElementById("backToCover");

function openInvitation() {
  welcomeScreen.classList.add("is-leaving");
  welcomeScreen.animate(
    [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.97)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  ).onfinish = () => {
    welcomeScreen.hidden = true;
    invitationScreen.hidden = false;
    invitationScreen.classList.remove("is-opening");
    void invitationScreen.offsetWidth;
    invitationScreen.classList.add("is-opening");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

function returnToCover() {
  invitationScreen.hidden = true;
  welcomeScreen.hidden = false;
  welcomeScreen.classList.remove("is-leaving");
  welcomeScreen.animate(
    [{ opacity: 0, transform: "scale(.98)" }, { opacity: 1, transform: "scale(1)" }],
    { duration: 350, easing: "ease-out", fill: "forwards" }
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
}

openButton.addEventListener("click", openInvitation);
backButton.addEventListener("click", returnToCover);
