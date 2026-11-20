/* ==========================================================================
   Burger & Grill Hub — Menu Data, Filtering & Cart Logic
   ========================================================================== */

const MENU_ITEMS = [
  {
    id: 1,
    name: "كلاسيك سماش برجر",
    category: "burgers",
    price: 2500,
    badge: "الأكثر طلباً",
    desc: "شريحتان لحم بقري طازج مشوي على الصاج مع جبن شيدر وصوص هاب الخاص.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "دبل تشيز بيكون برجر",
    category: "burgers",
    price: 3200,
    badge: "مميز",
    desc: "لحم بقري فاخر مع شرائح اللحم المدخن، بصل مكرمل، وجبن مذاب.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "كرسبي تشيكن برجر",
    category: "burgers",
    price: 2200,
    badge: "",
    desc: "صدر دجاج مقرمش متبل بالخلطة السرية مع خس طازج ومايونيز بالثوم.",
    image: "https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "طبق مشويات مشكلة ملكي",
    category: "grills",
    price: 5500,
    badge: "عائلي",
    desc: "تشكيلة أوصال لحم، شيش طاووق، وكباب مشوي على الفحم مع خبز محمص.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "ستيك ريب آي مشوي",
    category: "grills",
    price: 6800,
    badge: "شيف سبيشال",
    desc: "قطعة ستيك طرية مشوية بإتقان تقدم مع خضار سوتيه وصوص الفلفل الأسود.",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "بطاطس بالجبن والهالبينو",
    category: "sides",
    price: 1200,
    badge: "",
    desc: "بطاطس مقرمشة مغطاة بصوص الجبن الساخن وشرائح الهالبينو.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "أجنحة دجاج بافلو حارة",
    category: "sides",
    price: 1800,
    badge: "حار 🔥",
    desc: "8 قطع أجنحة دجاج بصوص البافلو الحار تقدم مع صوص الرانش البارد.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "موهيتو ليمون ونعناع",
    category: "drinks",
    price: 900,
    badge: "منعش",
    desc: "مشروب بارد ومنعش بالليمون الطازج وأوراق النعناع مع الثلج المجروش.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80"
  }
];

const CATEGORY_NAMES = {
  all: "جميع الوجبات",
  burgers: "قسم البرجر",
  grills: "قسم المشويات",
  sides: "قسم المقبلات",
  drinks: "قسم المشروبات"
};

let currentCategory = "all";
let searchQuery = "";
window.menuCart = [];

const menuGrid = document.getElementById("menuGrid");
const categoryTitle = document.getElementById("currentCategoryTitle");
const itemsCount = document.getElementById("itemsCount");
const searchInput = document.getElementById("searchInput");

function renderMenu() {
  const filtered = MENU_ITEMS.filter(item => {
    const matchesCat = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch = item.name.includes(searchQuery) || item.desc.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  categoryTitle.textContent = CATEGORY_NAMES[currentCategory] || "جميع الوجبات";
  itemsCount.textContent = `${filtered.length} صنف`;

  if (filtered.length === 0) {
    menuGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--muted); padding:30px;">لا توجد وجبات مطابقة لبحثك حالياً.</p>`;
    return;
  }

  menuGrid.innerHTML = filtered.map(item => `
    <article class="meal-card">
      <div class="meal-img-wrap">
        ${item.badge ? `<span class="meal-badge">${item.badge}</span>` : ""}
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="meal-body">
        <h3>${item.name}</h3>
        <p class="meal-desc">${item.desc}</p>
        <div class="meal-footer">
          <span class="meal-price">${item.price.toLocaleString()} ريال</span>
          <button class="add-meal-btn" onclick="addToCart(${item.id})">+ أضف للطلب</button>
        </div>
      </div>
    </article>
  `).join("");
}

window.addToCart = function (id) {
  const meal = MENU_ITEMS.find(m => m.id === id);
  if (!meal) return;

  const existing = window.menuCart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    window.menuCart.push({ ...meal, qty: 1 });
  }
  updateCartUI();
};

window.changeQty = function (id, delta) {
  const index = window.menuCart.findIndex(c => c.id === id);
  if (index === -1) return;

  window.menuCart[index].qty += delta;
  if (window.menuCart[index].qty <= 0) {
    window.menuCart.splice(index, 1);
  }
  updateCartUI();
};

window.updateCartUI = function () {
  const floatingBtn = document.getElementById("openCartBtn");
  const totalQtyEl = document.getElementById("cartTotalQty");
  const totalAmountEl = document.getElementById("cartTotalAmount");
  const drawerTotalEl = document.getElementById("drawerTotalPrice");
  const cartListEl = document.getElementById("cartItemsList");

  const totalQty = window.menuCart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = window.menuCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (totalQty > 0) {
    floatingBtn.style.display = "flex";
    totalQtyEl.textContent = totalQty;
    totalAmountEl.textContent = `${totalPrice.toLocaleString()} ريال`;
  } else {
    floatingBtn.style.display = "none";
  }

  drawerTotalEl.textContent = `${totalPrice.toLocaleString()} ريال`;

  if (window.menuCart.length === 0) {
    cartListEl.innerHTML = `<p style="text-align:center; color:var(--muted); padding:35px 0;">سلة طلباتك فارغة حالياً.</p>`;
    return;
  }

  cartListEl.innerHTML = window.menuCart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>${(item.price * item.qty).toLocaleString()} ريال</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <strong>${item.qty}</strong>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");
};

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderMenu();
  });
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderMenu();
});

renderMenu();
updateCartUI();