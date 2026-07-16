let q="";
let good=0;
let bad=0;
let startTime=null;
let quotes=[];

// Permanent statistics
let totalKeyPresses=0;
let wrongKeyPresses=0;

const Q=document.getElementById("quote");
const I=document.getElementById("inp");
const w=document.getElementById("w");
const a=document.getElementById("a");
const fill=document.getElementById("fill");
const car=document.getElementById("car");

async function load() {
  const response=await fetch("data.json");
  const data=await response.json();
  quotes=data.quotes;
  q=quotes[Math.floor(Math.random() * quotes.length)];

  Q.innerHTML=q
    .split("")
    .map((c, n) => `<span id="s${n}">${c}</span>`)
    .join("");

  I.value="";
  I.disabled=false;

  good=0;
  bad=0;
  totalKeyPresses=0;
  wrongKeyPresses=0;
  startTime=null;

  w.textContent="0";
  a.textContent="0%";
  fill.style.width="0%";
  car.style.left="0%";
}

// Count every typed character permanently
I.addEventListener("keydown", function (e) {
  if (e.key.length === 1 || e.key === " ") {
    totalKeyPresses++;

    if (!startTime) startTime=Date.now();

    const pos=I.value.length;

    if (e.key !== q[pos]) {
      wrongKeyPresses++;
    }
  }
});

I.oninput=() => {
  const v=I.value;

  good=0;
  bad=0;

  [...Q.children].forEach((s, n) => {
    s.className="";

    if (n < v.length) {
      if (v[n] === q[n]) {
        s.className="ok";
        good++;
      } else {
        s.className="bad";
        bad++;
      }
    } else if (n === v.length) {
      s.className="cur";
    }
  });

  // Permanent Accuracy
  const acc =
    totalKeyPresses === 0
     ?100
     :((totalKeyPresses-wrongKeyPresses) / totalKeyPresses) * 100;

  a.textContent=acc.toFixed(2)+"%";

  // WPM using elapsed typing time
  if (startTime) {
    const minutes=(Date.now()-startTime) / 60000;
    const wpm=minutes > 0?Math.round(good / 5 / minutes):0;
    w.textContent=wpm;
  }

  // Progress Bar
  const p=Math.min((good / q.length) * 100, 100);
  fill.style.width=p+"%";
  car.style.left=`calc(${p}%-18px)`;

  if (v === q) {
    alert(`Finished!\n\nWPM: ${w.textContent}\nAccuracy: ${a.textContent}`);
    I.disabled=true;
  }
};

function restart() {
  load();
}
load();