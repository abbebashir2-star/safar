const KEY = "safar_drivers";
let drivers = JSON.parse(localStorage.getItem(KEY) || "[]");

const form = document.getElementById("regForm");
const owns = document.getElementById("owns");
const ownerFields = document.getElementById("ownerFields");

owns.addEventListener("change", () => {
  ownerFields.style.display = owns.value === "maya" ? "block" : "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const photoInput = document.getElementById("photo");
  const reader = new FileReader();
  reader.onload = () => {
    const driver = {
      id: Date.now(),
      name: document.getElementById("name").value,
      evc: document.getElementById("evc").value,
      bajo: document.getElementById("bajo").value.toUpperCase(),
      photo: reader.result || "",
      owns: owns.value,
      ownerName: document.getElementById("ownerName").value,
      ownerEvc: document.getElementById("ownerEvc").value,
      start: Date.now()
    };
    drivers.push(driver);
    save();
    form.reset();
    ownerFields.style.display = "none";
    render();
    alert("Waad ku mahadsan tahay! 7 maalmood oo bilaash ah ayaa bilaabmay.");
  };
  if (photoInput.files[0]) reader.readAsDataURL(photoInput.files[0]);
  else { reader.onload(); }
});

function daysLeft(start) {
  const days = 7 - Math.floor((Date.now() - start) / 86400000);
  return days > 0 ? days : 0;
}

function save() { localStorage.setItem(KEY, JSON.stringify(drivers)); }

function render() {
  const list = document.getElementById("driverList");
  list.innerHTML = drivers.map(d => `
    <div class="driver">
      ${d.photo ? `<img src="${d.photo}">` : `<div class="driver img" style="background:#0B6E4F"></div>`}
      <div class="info">
        <div class="name">${d.name}</div>
        <div class="meta">Bajo: ${d.bajo} • EVC: ${d.evc}</div>
        <div class="meta">${d.owns === "haa" ? "Milkiile" : "Darawal (milkiile: " + d.ownerName + ")"}</div>
      </div>
      <span class="badge">${daysLeft(d.start)} maalmood</span>
    </div>
  `).join("") || "<p style='color:#888'>Weli ma jiraan darawalo.</p>";
}

document.getElementById("search").addEventListener("input", (e) => {
  const q = e.target.value.toUpperCase();
  const res = document.getElementById("results");
  if (!q) { res.innerHTML = ""; return; }
  const found = drivers.filter(d => d.bajo.includes(q));
  res.innerHTML = found.map(d => `
    <div class="driver">
      ${d.photo ? `<img src="${d.photo}">` : ""}
      <div class="info">
        <div class="name">${d.name}</div>
        <div class="meta">Milkiile: ${d.owns === "haa" ? d.name : d.ownerName}</div>
        <div class="meta">EVC: ${d.evc} • Milkiile EVC: ${d.owns === "haa" ? d.evc : d.ownerEvc}</div>
      </div>
    </div>
  `).join("") || "<p style='color:#888'>Lama helin.</p>";
});

render();
