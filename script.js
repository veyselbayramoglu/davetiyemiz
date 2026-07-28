
document.documentElement.classList.add("js");
const scroller = document.querySelector("main");
if("scrollRestoration" in history) history.scrollRestoration = "manual";
const resetInitialPosition = () => scroller.scrollTo({top:0,left:0,behavior:"auto"});
const scrollToPage = (page, behavior = "smooth") => {
  scroller.scrollTo({top:page.offsetTop,left:0,behavior});
};
resetInitialPosition();
window.addEventListener("pageshow", () => window.requestAnimationFrame(resetInitialPosition));

const body = document.body;
body.classList.add("locked");
const opening = document.getElementById("opening");
const seal = document.getElementById("seal");
const toast = document.getElementById("toast");
const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicPreferenceKey = "davetiyemiz-music-muted";
let musicMutedByUser = readMusicPreference();

music.volume = .08;

function readMusicPreference(){
  try{
    return window.localStorage.getItem(musicPreferenceKey) === "true";
  }catch{
    return false;
  }
}

function saveMusicPreference(isMuted){
  musicMutedByUser = isMuted;
  try{
    window.localStorage.setItem(musicPreferenceKey, String(isMuted));
  }catch{
    // Depolama kapalıysa tercih yalnızca mevcut oturumda korunur.
  }
}

function pauseForBackground(){
  if(!music.paused) music.pause();
}

function updateMusicButton(){
  const isPlaying = !music.paused;
  musicToggle.classList.toggle("paused", !isPlaying);
  musicToggle.setAttribute("aria-label", isPlaying ? "Müziği durdur" : "Müziği oynat");
  musicToggle.title = isPlaying ? "Müziği durdur" : "Müziği oynat";
  musicToggle.querySelector("span").textContent = isPlaying ? "♫" : "♪";
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

seal.addEventListener("click", () => {
  resetInitialPosition();
  scrollToPage(document.querySelector(".hero"), "auto");
  musicToggle.hidden = false;
  if(musicMutedByUser){
    updateMusicButton();
  }else{
    music.play().then(updateMusicButton).catch(updateMusicButton);
  }
  opening.classList.add("opened");
  window.setTimeout(() => {
    body.classList.add("invitation-open");
    showFirstVisitHint(document.querySelector(".hero"));
  }, 1350);
  window.setTimeout(() => {
    opening.classList.add("finished");
    body.classList.remove("locked");
    scrollToPage(document.querySelector(".hero"));
  }, 2750);
});

musicToggle.addEventListener("click", () => {
  if(music.paused){
    saveMusicPreference(false);
    music.play().then(updateMusicButton).catch(() => {
      showToast("Müzik tarayıcı tarafından başlatılamadı");
      updateMusicButton();
    });
  }else{
    saveMusicPreference(true);
    music.pause();
    updateMusicButton();
  }
});

music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);
document.addEventListener("visibilitychange", () => {
  if(document.hidden) pauseForBackground();
});
window.addEventListener("pagehide", pauseForBackground);
window.addEventListener("blur", pauseForBackground);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle("visible", entry.intersectionRatio >= .22);
  });
},{threshold:.22});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

function updateEventCountdown(eventDate, parts){
  const remaining = Math.max(0, eventDate.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  parts.days.textContent = Math.floor(totalSeconds / 86400);
  parts.hours.textContent = String(Math.floor(totalSeconds / 3600) % 24).padStart(2, "0");
  parts.minutes.textContent = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");
  parts.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
}

const countdowns = [
  {
    date:new Date("2026-08-21T19:00:00+03:00"),
    parts:{
      days:document.getElementById("hennaCountdownDays"),
      hours:document.getElementById("hennaCountdownHours"),
      minutes:document.getElementById("hennaCountdownMinutes"),
      seconds:document.getElementById("hennaCountdownSeconds")
    }
  },
  {
    date:new Date("2026-08-23T15:30:00+03:00"),
    parts:{
      days:document.getElementById("countdownDays"),
      hours:document.getElementById("countdownHours"),
      minutes:document.getElementById("countdownMinutes"),
      seconds:document.getElementById("countdownSeconds")
    }
  }
];

const postEventDate = new Date("2026-08-23T16:00:00+03:00");
const ceremonyPage = document.getElementById("ceremony");
const locationPage = document.getElementById("location");
const postEventPage = document.getElementById("postEvent");
let postEventActive = Date.now() >= postEventDate.getTime();

function applyPostEventVisibility(){
  ceremonyPage.hidden = postEventActive;
  locationPage.hidden = postEventActive;
  postEventPage.hidden = !postEventActive;
}

applyPostEventVisibility();

function updateCountdowns(){
  countdowns.forEach(countdown => {
    updateEventCountdown(countdown.date, countdown.parts);
  });
}

updateCountdowns();
window.setInterval(updateCountdowns, 1000);

let pages = [];
const hintedPages = new WeakSet();
const pendingPageHints = new WeakMap();

function pageIsCentered(page){
  const rect = page.getBoundingClientRect();
  const viewportHeight = scroller.clientHeight;
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  return visibleHeight >= Math.min(rect.height, viewportHeight) * .7;
}

function showFirstVisitHint(page){
  if(hintedPages.has(page) || pendingPageHints.has(page) || !body.classList.contains("invitation-open")) return;

  const timer = window.setTimeout(() => {
    pendingPageHints.delete(page);
    if(hintedPages.has(page) || !pageIsCentered(page)) return;

    const content = page.querySelector(".invitation-content");
    if(!content) return;

    hintedPages.add(page);
    page.classList.add("first-visit-hinting");
    content.classList.add("first-visit-nudge");
  }, 1100);

  pendingPageHints.set(page, timer);
}

const pageHintObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.intersectionRatio >= .7){
      showFirstVisitHint(entry.target);
      return;
    }

    const timer = pendingPageHints.get(entry.target);
    if(timer){
      window.clearTimeout(timer);
      pendingPageHints.delete(entry.target);
    }
  });
}, {root:scroller, threshold:[0, .7]});

function configurePages(){
  pageHintObserver.disconnect();
  document.querySelectorAll(".page-cue").forEach(cue => cue.remove());
  pages = [...document.querySelectorAll(".page:not([hidden])")];

  pages.forEach((page, index) => {
    pageHintObserver.observe(page);

    if(index < pages.length - 1){
      const cue = document.createElement("div");
      cue.className = "page-cue page-cue-up";
      cue.setAttribute("aria-hidden", "true");

      const cueText = document.createElement("span");
      cueText.textContent = "Kaydır";
      cue.appendChild(cueText);
      page.appendChild(cue);
    }
  });
}

configurePages();

scroller.addEventListener("click", event => {
  if(event.target.closest("a,button")) return;
  const page = event.target.closest(".page");
  const nextPage = pages[pages.indexOf(page) + 1];
  if(nextPage) scrollToPage(nextPage);
});

function activatePostEventMode(){
  if(postEventActive || Date.now() < postEventDate.getTime()) return;

  const currentPageWasReplaced =
    pageIsCentered(ceremonyPage) || pageIsCentered(locationPage);

  postEventActive = true;
  applyPostEventVisibility();
  configurePages();
  observer.observe(postEventPage);

  if(currentPageWasReplaced) scrollToPage(postEventPage, "auto");
}

window.setInterval(activatePostEventMode, 1000);

const locationShortcut = document.getElementById("locationShortcut");
const photoShortcut = document.getElementById("photoShortcut");
const postEventPhotoShortcut = document.getElementById("postEventPhotoShortcut");
const photoPage = document.getElementById("photos");

locationShortcut.addEventListener("click", event => {
  event.preventDefault();
  scrollToPage(locationPage);
});

photoShortcut.addEventListener("click", event => {
  event.preventDefault();
  scrollToPage(photoPage);
});

postEventPhotoShortcut.addEventListener("click", event => {
  event.preventDefault();
  scrollToPage(photoPage);
});

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.addEventListener("click", pauseForBackground);
});

const ambient = document.querySelector(".ambient");
for(let i=0;i<18;i++){
  const p = document.createElement("i");
  p.className = "petal";
  p.style.left = `${Math.random()*100}%`;
  p.style.animationDuration = `${10+Math.random()*13}s`;
  p.style.animationDelay = `${-Math.random()*18}s`;
  p.style.setProperty("--drift", `${-70+Math.random()*140}px`);
  p.style.opacity = `${.12+Math.random()*.28}`;
  p.style.transform = `scale(${.7+Math.random()*.8})`;
  ambient.appendChild(p);
}
