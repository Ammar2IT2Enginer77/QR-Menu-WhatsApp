/* ==========================================================================
   Burger & Grill Hub — Cart Drawer & WhatsApp Order Formatter
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // رقم واتساب المطعم (مربوط برقمك للتجربة الحية للعملاء)
  const RESTAURANT_WHATSAPP = "967772457941";

  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const sendWhatsappBtn = document.getElementById("sendWhatsappBtn");

  // فتح درج السلة
  openCartBtn.addEventListener("click", () => {
    cartOverlay.classList.add("open");
  });

  // إغلاق درج السلة
  closeCartBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("open");
  });

  // الإغلاق عند الضغط خارج الدرج
  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove("open");
    }
  });

  // تجهيز وإرسال الطلب عبر واتساب
  sendWhatsappBtn.addEventListener("click", () => {
    if (!window.menuCart || window.menuCart.length === 0) {
      alert("سلة الطلبات فارغة! أضف وجبة واحدة على الأقل.");
      return;
    }

    const orderType = document.getElementById("orderType").value;
    const customerName = document.getElementById("customerName").value.trim() || "عميل";
    const customerLocation = document.getElementById("customerLocation").value.trim();
    const orderNotes = document.getElementById("orderNotes").value.trim();

    if (!customerLocation) {
      alert("يرجى إدخال العنوان أو رقم الطاولة لإتمام الطلب.");
      document.getElementById("customerLocation").focus();
      return;
    }

    const totalPrice = window.menuCart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // بناء نص الرسالة بشكل مرتب وواضح
    let message = `*🍔 طلب جديد — Burger & Grill Hub*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*👤 الاسم:* ${customerName}\n`;
    message += `*📦 نوع الطلب:* ${orderType}\n`;
    message += `*📍 العنوان / الطاولة:* ${customerLocation}\n`;
    if (orderNotes) {
      message += `*📝 ملاحظات:* ${orderNotes}\n`;
    }
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*🛒 تفاصيل الطلب:*\n`;

    window.menuCart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (×${item.qty}) — ${(item.price * item.qty).toLocaleString()} ريال\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*💰 الإجمالي النهائي: ${totalPrice.toLocaleString()} ريال*`;

    const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  });
});
