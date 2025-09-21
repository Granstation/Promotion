// main script for index.html
// now translations embedded directly, no need for translations.json

const totalEl = document.getElementById("total");
const checks = document.querySelectorAll(".service-check");
const selectedList = document.getElementById("selectedList");
const listToggle = document.getElementById("listToggle");
const langToggle = document.getElementById("langToggle");
const titleEl = document.getElementById("title");
const totalLabel = document.getElementById("totalLabel");
const listLabel = document.getElementById("listLabel");
const clearAllBtn = document.getElementById("clearAllBtn");
const toggles = document.querySelectorAll(".service-header");

let lang = "th";

// ✅ ฝัง translations โดยตรง
const translations = {
  "th": {
    "title": "บริการ",
    "total": "รวมทั้งหมด:",
    "list": "รายการที่เลือก",
    "none": "ยังไม่ได้เลือกบริการ",
    "toggleBtn": "EN",
    "listShow": "แสดง",
    "listHide": "ซ่อน",
    "clear": "ยกเลิกทั้งหมด",
    "washCat": "✨ Basic Cleaning (ล้าง/ดูดฝุ่น/อัดฉีด/ห้องเครื่อง)",
    "seatCat": "🛋️ Interior Care (ฟอกเบาะ / ฟอกพรม)",
    "glossCat": "💎 Premium (เคลือบเงาสี / เคลือบแก้วเซรามิก / ขัดเคลือบสี)",
    "washVacuum": "ล้างรถ ดูดฝุ่น",
    "washVacuumM": "ล้างรถ ดูดฝุ่น M",
    "washVacuumL": "ล้างรถ ดูดฝุ่น L",
    "washVacuumXL": "ล้างรถ ดูดฝุ่น XL",
    "washPressure": "ล้างอัดฉีด",
    "washPressureM": "ล้างอัดฉีด M",
    "washPressureL": "ล้างอัดฉีด L",
    "washPressureXL": "ล้างอัดฉีด XL",
    "washEngine": "ล้างห้องเครื่อง",
    "washEngineM": "ล้างห้องเครื่อง M",
    "washEngineL": "ล้างห้องเครื่อง L",
    "washEngineXL": "ล้างห้องเครื่อง XL",
    "washAsphalt": "ล้างยางมะตอย",
    "washAsphaltM": "ล้างยางมะตอย M",
    "washAsphaltL": "ล้างยางมะตอย L",
    "washAsphaltXL": "ล้างยางมะตอย XL",
    "seatClean": "ฟอกเบาะ",
    "seatCleanM": "ฟอกเบาะ M",
    "seatCleanL": "ฟอกเบาะ L",
    "seatCleanXL": "ฟอกเบาะ XL",
    "carpetClean": "ฟอกพรม",
    "carpetCleanM": "ฟอกพรม M",
    "carpetCleanL": "ฟอกพรม L",
    "carpetCleanXL": "ฟอกพรม XL",
    "gloss": "เคลือบเงาสี",
    "glossM": "เคลือบเงาสี M",
    "glossL": "เคลือบเงาสี L",
    "glossXL": "เคลือบเงาสี XL",
    "ceramic": "เคลือบแก้วเซรามิก",
    "ceramicM": "เคลือบแก้วเซรามิก M",
    "ceramicL": "เคลือบแก้วเซรามิก L",
    "ceramicXL": "เคลือบแก้วเซรามิก XL",
    "polish": "ขัดเคลือบสี",
    "polishM": "ขัดเคลือบสี M",
    "polishL": "ขัดเคลือบสี L",
    "polishXL": "ขัดเคลือบสี XL"
  },
  "en": {
    "title": "Services",
    "total": "Total:",
    "list": "Selected Items",
    "none": "No service selected",
    "toggleBtn": "TH",
    "listShow": "Show",
    "listHide": "Hide",
    "clear": "Clear All",
    "washCat": "✨ Basic Cleaning (Wash/Vacuum/Pressure/Engine Room)",
    "seatCat": "🛋️ Interior Care (Seat Cleaning / Carpet Cleaning)",
    "glossCat": "💎 Premium (Gloss / Ceramic Coating / Polish)",
    "washVacuum": "Wash & Vacuum",
    "washVacuumM": "Wash & Vacuum M",
    "washVacuumL": "Wash & Vacuum L",
    "washVacuumXL": "Wash & Vacuum XL",
    "washPressure": "Pressure Wash",
    "washPressureM": "Pressure Wash M",
    "washPressureL": "Pressure Wash L",
    "washPressureXL": "Pressure Wash XL",
    "washEngine": "Engine Bay Cleaning",
    "washEngineM": "Engine Bay Cleaning M",
    "washEngineL": "Engine Bay Cleaning L",
    "washEngineXL": "Engine Bay Cleaning XL",
    "washAsphalt": "Tar Removal",
    "washAsphaltM": "Tar Removal M",
    "washAsphaltL": "Tar Removal L",
    "washAsphaltXL": "Tar Removal XL",
    "seatClean": "Seat Cleaning",
    "seatCleanM": "Seat Cleaning M",
    "seatCleanL": "Seat Cleaning L",
    "seatCleanXL": "Seat Cleaning XL",
    "carpetClean": "Carpet Cleaning",
    "carpetCleanM": "Carpet Cleaning M",
    "carpetCleanL": "Carpet Cleaning L",
    "carpetCleanXL": "Carpet Cleaning XL",
    "gloss": "Gloss Coating",
    "glossM": "Gloss Coating M",
    "glossL": "Gloss Coating L",
    "glossXL": "Gloss Coating XL",
    "ceramic": "Ceramic Coating",
    "ceramicM": "Ceramic Coating M",
    "ceramicL": "Ceramic Coating L",
    "ceramicXL": "Ceramic Coating XL",
    "polish": "Polish & Wax",
    "polishM": "Polish & Wax M",
    "polishL": "Polish & Wax L",
    "polishXL": "Polish & Wax XL"
  }
};

function updateTotal() {
  let sum = 0;
  let items = [];
  checks.forEach(c => {
    if (c.checked) {
      sum += parseInt(c.value, 10);
      const label = (lang === "th") ? c.dataset.labelTh : c.dataset.labelEn;
      items.push((label || c.name) + " - " + c.value + " THB");
    }
  });

  totalEl.textContent = sum + " THB";

  selectedList.innerHTML = "";
  if (items.length) {
    items.forEach(i => {
      const div = document.createElement("div");
      div.className = "selected-item";
      div.textContent = i;
      selectedList.appendChild(div);
    });
  } else {
    selectedList.textContent = translations[lang].none;
  }
}

function applyTranslations() {
  const t = translations[lang];

  // Header + total bar
  titleEl.textContent = t.title;
  totalLabel.textContent = t.total;
  listLabel.textContent = t.list;
  langToggle.textContent = t.toggleBtn;
  if (document.querySelector("[data-key='washCat']")) document.querySelector("[data-key='washCat']").textContent = t.washCat;
  if (document.querySelector("[data-key='seatCat']")) document.querySelector("[data-key='seatCat']").textContent = t.seatCat;
  if (document.querySelector("[data-key='glossCat']")) document.querySelector("[data-key='glossCat']").textContent = t.glossCat;

  if (listToggle.options.length >= 2) {
    listToggle.options[0].text = t.listShow;
    listToggle.options[1].text = t.listHide;
  }
  clearAllBtn.textContent = t.clear;

  // update service headers
  document.querySelectorAll(".service-header").forEach(h => {
    const key = h.dataset.key;
    if (key && t[key]) {
      const firstSpan = h.querySelector("span");
      if (firstSpan) firstSpan.textContent = t[key];
    }
  });

  updateTotal();
}

function switchLang() {
  lang = (lang === "th") ? "en" : "th";
  applyTranslations();
}

function initUI() {
  toggles.forEach(h => {
    h.addEventListener("click", () => {
      const id = h.dataset.toggle;
      const d = document.getElementById(id);
      const caret = h.querySelector(".caret");
      if (d) d.classList.toggle("open");
      if (caret) caret.classList.toggle("open");
    });
  });

  checks.forEach(c => {
    c.addEventListener("change", () => {
      if (c.checked) {
        document.querySelectorAll(`input[name="${c.name}"]`).forEach(other => {
          if (other !== c) other.checked = false;
        });
      }
      updateTotal();
    });
  });

  listToggle.addEventListener("change", () => {
    selectedList.style.display = (listToggle.value === "show") ? "flex" : "none";
  });

  clearAllBtn.addEventListener("click", () => {
    checks.forEach(c => c.checked = false);
    updateTotal();
  });

  langToggle.addEventListener("click", switchLang);

  updateTotal();
}

// bootstrap
initUI();
applyTranslations();