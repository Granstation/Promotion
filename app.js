// ===== Initial i18n =====
const I18N = {
  th:{
    nav:{ sizes:"เลือกขนาดรถ", pages:"หน้าอื่นๆ", promo:"โปรโมชั่น", home:"หน้าหลัก" },
    cart:{ title:"ตะกร้ารายการ", total:"ราคารวม", items:"จำนวน", clear:"ลบรายการทั้งหมด",
           confirmTitle:"ลบรายการทั้งหมด?", confirmYes:"ยืนยัน", confirmNo:"ยกเลิก" },
    size:{ ALL:"ทุกขนาด", S:"ไซส์ S", M:"ไซส์ M", L:"ไซส์ L", XL:"ไซส์ XL" },
    add:"ใส่ตะกร้า", remove:"เอาออก", empty:"ยังไม่มีสินค้าในตะกร้า", currency:"฿",
    promo:{ add:"ใส่ตะกร้า" }
  },
  en:{
    nav:{ sizes:"Choose Size", pages:"Pages", promo:"Promotion", home:"Home" },
    cart:{ title:"Cart", total:"Total", items:"Items", clear:"Clear all",
           confirmTitle:"Clear all items?", confirmYes:"Confirm", confirmNo:"Cancel" },
    size:{ ALL:"All Sizes", S:"Size S", M:"Size M", L:"Size L", XL:"Size XL" },
    add:"Add to cart", remove:"Remove", empty:"Cart is empty", currency:"$",
    promo:{ add:"Add to cart" }
  }
};

const PROMO = {
  id: "promo_wash_wax",
  name: { th: "ล้างรถ + เคลือบสี", en: "Wash + Wax" },
  desc: { th: "โปรใช้กับลูกค้าประจำ วันนี้ – 30 มกราคม 2568", en: "Member promo" },
  image: "assets/promo/test.jpg",   // <<<< ใส่รูปโปรฯ ที่นี่
  size: "M",
  unit: 500
};

// ===== State =====
const state = { lang:"th", filter:"ALL", services:[], cart:{} };

// ===== Helpers =====
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const fmt = n => new Intl.NumberFormat(state.lang==='th'?'th-TH':'en-US',{maximumFractionDigits:0}).format(n);
const priceTag = n => `${I18N[state.lang].currency}${fmt(n)}`;
const keyOf = (id,size) => `${id}@${size}`;

// ===== Drawer & Pages =====
const drawer=$("#drawer"), scrim=$("#scrim");
const openDrawer=()=>{ drawer.classList.add("open"); scrim.classList.add("show"); };
const closeDrawer=()=>{ drawer.classList.remove("open"); scrim.classList.remove("show"); };
$("#menuBtn").onclick=openDrawer;
$("#closeDrawer").onclick=closeDrawer;
scrim.onclick=closeDrawer;

// ===== Build size UI (drawer + tabs) =====
const SIZES = ["ALL","S","M","L","XL"];
const sizeList = $("#sizeList");
const tabs = $("#tabs");
SIZES.forEach(sz=>{
  const b=document.createElement("button");
  b.className="size-btn"; b.dataset.size=sz; b.onclick=()=>{ setFilter(sz); closeDrawer(); };
  sizeList.appendChild(b);

  const t=document.createElement("button");
  t.className="tab"; t.dataset.size=sz; t.onclick=()=>setFilter(sz);
  tabs.appendChild(t);
});
function setActiveSizes(){
  const label = I18N[state.lang].size;
  $$(".size-btn").forEach(btn=>{ btn.classList.toggle("active", btn.dataset.size===state.filter); btn.textContent = label[btn.dataset.size]; });
  $$(".tab").forEach(btn=>{ btn.classList.toggle("active", btn.dataset.size===state.filter); btn.textContent = label[btn.dataset.size]; });
}
function setFilter(sz){ state.filter=sz; renderGrid(); setActiveSizes(); }

// ===== Catalog render =====
const grid = $("#grid");
function renderGrid(){
  grid.innerHTML = "";
  const list = state.services.filter(s => state.filter === "ALL" || s.sizes[state.filter] != null);

  list.forEach(s => {
    const showSize = state.filter === "ALL" ? "ALL" : state.filter;
    const price = showSize === "ALL"
      ? (s.sizes.S ?? s.sizes.M ?? s.sizes.L ?? s.sizes.XL)
      : s.sizes[showSize];

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-media">${s.image ? `<img alt="" src="${s.image}">` : "🧽"}</div>
      <div class="pill">${showSize === "ALL" ? I18N[state.lang].size.ALL : I18N[state.lang].size[showSize]}</div>
      <div class="card-body">
        <div class="title">${s.name[state.lang]}</div>
        <div class="desc">${s.desc[state.lang]}</div>
        <div class="price">${priceTag(price)}+</div>
      </div>
      <button class="add-btn" title="${I18N[state.lang].add}">＋</button>
    `;

    // 1) กดทั้งการ์ด = ใส่ไซส์ตามแท็บปัจจุบัน (ALL = S)
    card.addEventListener("click", (ev) => {
      if (ev.target.closest(".add-btn")) return; // กันซ้ำกับปุ่ม +
      const chosen = state.filter === "ALL" ? "S" : state.filter;
      addToCart(s.id, chosen, 1);
      openCartPanel();
    });

    // 2) ปุ่ม + = ทำงานเหมือนเดิม
    card.querySelector(".add-btn").onclick = (ev) => {
      ev.stopPropagation();
      const chosen = state.filter === "ALL" ? "S" : state.filter;
      addToCart(s.id, chosen, 1);
      openCartPanel();
    };

    grid.appendChild(card);
  });
}

// ===== Cart =====
function addToCart(id,size,qty){
  const svc = state.services.find(x=>x.id===id);
  const unit = svc.sizes[size];
  const k = keyOf(id,size);
  state.cart[k] ??= { id, size, qty:0, unit, name:svc.name, desc:svc.desc };
  state.cart[k].qty += qty;
  renderCart();
}
function removeOne(k){ if(!state.cart[k]) return; state.cart[k].qty--; if(state.cart[k].qty<=0) delete state.cart[k]; renderCart(); }
function addOne(k){ if(!state.cart[k]) return; state.cart[k].qty++; renderCart(); }
function deleteItem(k){ delete state.cart[k]; renderCart(); }
function clearAllNow(){ state.cart={}; renderCart(); }

const cartPanel=$("#cartPanel");
function openCartPanel(){ cartPanel.classList.add("open"); }
$("#cartToggle").onclick=()=>cartPanel.classList.toggle("open");

// ===== Confirm-in-cart (ใหม่) =====
const confirmBar = $("#confirmBar");
$("#clearAll").onclick = () => { confirmBar.classList.remove("hide"); openCartPanel(); };
$("#confirmYes").onclick = () => { clearAllNow(); confirmBar.classList.add("hide"); };
$("#confirmNo").onclick  = () => { confirmBar.classList.add("hide"); };

function renderCart(){
  const items = Object.values(state.cart);
  const list=$("#cartItems"); list.innerHTML="";
  if(items.length===0){ list.innerHTML = `<div class="muted">${I18N[state.lang].empty}</div>`; }
  let total=0, count=0;
  items.forEach(it=>{
    total += it.unit*it.qty; count += it.qty;
    const row=document.createElement("div");
    row.className='cart-row';
    row.innerHTML=`
      <div>
        <div class="row-title">${it.name[state.lang]} • ${I18N[state.lang].size[it.size]}</div>
        <div class="row-sub">${priceTag(it.unit)} × ${it.qty} = <b>${priceTag(it.unit*it.qty)}</b></div>
        <div class="row-sub">${it.desc[state.lang]}</div>
      </div>
      <div class="qty">
        <button title="-">−</button>
        <b>${it.qty}</b>
        <button title="+">＋</button>
        <button class="danger" title="${I18N[state.lang].remove}">🗑</button>
      </div>
    `;
    const k = keyOf(it.id,it.size);
    const [minus, plus, del] = row.querySelectorAll("button");
    minus.onclick = () => removeOne(k);
    plus.onclick  = () => addOne(k);
    del.onclick   = () => deleteItem(k);
    list.appendChild(row);
  });
  $("#total").textContent = priceTag(total);
  $("#itemCount").textContent = count;
}

// ===== Language =====
function applyLang(){
  $$("[data-i18n]").forEach(el=>{
    const path = el.dataset.i18n.split(".");
    const text = path.reduce((o,k)=>o?.[k], I18N[state.lang]);
    if(typeof text === "string") el.textContent = text;
  });
  const abbr = state.lang==='th'?'TH':'EN';
  const full = state.lang==='th'?'ไทย':'English';
  $("#langAbbr").textContent=abbr; $("#langFull").textContent=full;
  $("#langAbbr2").textContent=abbr; $("#langFull2").textContent=full;
  setActiveSizes(); renderGrid(); renderCart();
}
function toggleLang(){ state.lang = state.lang==='th'?'en':'th'; applyLang(); }
$("#langBtn").onclick=toggleLang; $("#langBtn2").onclick=toggleLang;

// ===== Promo (demo) =====
let promoQty = 1;
function switchPage(id){ $$(".page").forEach(p=>p.classList.remove("active")); document.getElementById(id).classList.add("active"); }

$("#openPromo").onclick = () => { 
  // bind UI ด้วยข้อมูลโปร
  $("#promoTitle").textContent = PROMO.name[state.lang];
  $("#promoDesc").textContent  = PROMO.desc[state.lang];
  $("#pQty").textContent = promoQty = 1;
  $("#promoPrice").textContent = priceTag(PROMO.unit);
  const hero = document.querySelector(".promo-hero .img");
  hero.innerHTML = PROMO.image ? `<img alt="" src="${PROMO.image}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;">` : "🚗";
  switchPage("promo"); 
  closeDrawer(); 
};

$("#closePromo").onclick = () => switchPage("home");
$("#pMinus").onclick = () => { promoQty = Math.max(1, promoQty-1); $("#pQty").textContent=promoQty; $("#promoPrice").textContent=priceTag(PROMO.unit*promoQty); };
$("#pPlus").onclick  = () => { promoQty++; $("#pQty").textContent=promoQty; $("#promoPrice").textContent=priceTag(PROMO.unit*promoQty); };

$("#promoAdd").onclick = () => {
  // ใส่ตะกร้าจากโปรฯ
  const k = state.services.find(s=>s.id===PROMO.id)
    ? PROMO.id                             // ถ้ามีใน services.json ให้ใช้ตัวเดียวกัน
    : "promo_"+Date.now();                 // ถ้ายังไม่มี จะสร้างแถวใหม่ชั่วคราว
  // สร้าง service ชั่วคราวกรณีไม่อยู่ใน services.json
  if (!state.services.find(s=>s.id===k)){
    state.services.push({
      id: k,
      name: PROMO.name,
      desc: PROMO.desc,
      image: PROMO.image,
      sizes: { [PROMO.size]: PROMO.unit }
    });
  }
  addToCart(k, PROMO.size, promoQty);
  switchPage("home");
  openCartPanel();
};

// ===== Load services.json =====
async function loadServices(){
  try{
    const res = await fetch("services.json");
    state.services = await res.json();
  }catch(e){
    state.services = [
      {id:"wash_basic", name:{th:"ล้างรถ (ภายนอก)",en:"Exterior Wash"}, desc:{th:"ล้างภายนอกอย่างเดียว",en:"Exterior only quick wash"}, image:"", sizes:{S:120,M:150,L:180,XL:220}},
      {id:"wash_wax", name:{th:"ล้างรถ + เคลือบสี",en:"Wash + Wax"}, desc:{th:"เงาวับ ปกป้องสีรถ",en:"Glossy look with protection"}, image:"", sizes:{S:300,M:350,L:420,XL:480}},
      {id:"engine_clean", name:{th:"ล้างห้องเครื่อง",en:"Engine Bay Clean"}, desc:{th:"ทำความสะอาดละเอียด",en:"Detailed cleaning"}, image:"", sizes:{S:250,M:280,L:320,XL:380}},
      {id:"interior_detail", name:{th:"ดูดฝุ่น + อบโอโซน",en:"Vacuum + Ozone"}, desc:{th:"ลดกลิ่นอับ ฆ่าเชื้อ",en:"Kills odor & germs"}, image:"", sizes:{S:200,M:250,L:290,XL:340}}
    ];
  }
}

// ===== Init =====
(async ()=>{
  await loadServices();
  applyLang();
  setFilter("ALL");
})();
