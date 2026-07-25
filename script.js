
document.documentElement.classList.add("js");
if("scrollRestoration" in history) history.scrollRestoration = "manual";
const resetInitialPosition = () => window.scrollTo({top:0,left:0,behavior:"auto"});
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
  document.querySelector(".hero").scrollIntoView({behavior:"auto",block:"start"});
  musicToggle.hidden = false;
  music.play().then(updateMusicButton).catch(updateMusicButton);
  opening.classList.add("opened");
  window.setTimeout(() => body.classList.add("invitation-open"), 1350);
  window.setTimeout(() => {
    opening.classList.add("finished");
    body.classList.remove("locked");
    document.querySelector(".hero").scrollIntoView({behavior:"smooth",block:"start"});
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
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.22});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const pages = [...document.querySelectorAll(".page")];
let settleTimer;
let settleTarget;

const settleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting || !body.classList.contains("invitation-open")) return;
    settleTarget = entry.target;
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if(settleTarget === entry.target){
        entry.target.scrollIntoView({behavior:"smooth",block:"start"});
      }
    }, 1850);
  });
},{threshold:.58});

pages.forEach((page, index) => {
  settleObserver.observe(page);
  page.addEventListener("click", event => {
    if(event.target.closest("a,button")) return;
    const nextPage = pages[index + 1];
    if(nextPage) nextPage.scrollIntoView({behavior:"smooth"});
  });
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

document.getElementById("calendarButton").addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zeyneb ve Veysel//Nikah Davetiyesi//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Zeyneb & Veysel Nikâh Töreni",
    "BEGIN:VEVENT",
    "UID:zeyneb-veysel-20260823@example.com",
    "DTSTAMP:20260724T090000Z",
    "DTSTART:20260823T123000Z",
    "DTEND:20260823T143000Z",
    "SUMMARY:Zeyneb & Veysel Nikâh Töreni",
    "LOCATION:Üsküdar Nikah Sarayı\\, Mimar Sinan\\, Çavuşdere Cd. No:35\\, Üsküdar/İstanbul",
    "DESCRIPTION:Gülümsememize şahit olun.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zeyneb-ve-veysel-nikah.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Takvim dosyası hazırlandı");
});
