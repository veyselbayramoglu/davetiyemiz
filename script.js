
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

music.volume = .24;

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
  music.play().then(updateMusicButton).catch(updateMusicButton);
  opening.classList.add("opened");
  window.setTimeout(() => body.classList.add("invitation-open"), 1350);
  window.setTimeout(() => {
    opening.classList.add("finished");
    body.classList.remove("locked");
    scrollToPage(document.querySelector(".hero"));
  }, 2750);
});

musicToggle.addEventListener("click", () => {
  if(music.paused){
    music.play().then(updateMusicButton).catch(() => {
      showToast("Müzik tarayıcı tarafından başlatılamadı");
      updateMusicButton();
    });
  }else{
    music.pause();
    updateMusicButton();
  }
});

music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);

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

function updateCountdowns(){
  countdowns.forEach(countdown => {
    updateEventCountdown(countdown.date, countdown.parts);
  });
}

updateCountdowns();
window.setInterval(updateCountdowns, 1000);

const pages = [...document.querySelectorAll(".page")];

pages.forEach((page, index) => {
  page.addEventListener("click", event => {
    if(event.target.closest("a,button")) return;
    const nextPage = pages[index + 1];
    if(nextPage) scrollToPage(nextPage);
  });
});

const locationShortcut = document.getElementById("locationShortcut");
const locationPage = document.getElementById("location");
const photoShortcut = document.getElementById("photoShortcut");
const photoPage = document.getElementById("photos");

locationShortcut.addEventListener("click", event => {
  event.preventDefault();
  scrollToPage(locationPage);
});

photoShortcut.addEventListener("click", event => {
  event.preventDefault();
  scrollToPage(photoPage);
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
