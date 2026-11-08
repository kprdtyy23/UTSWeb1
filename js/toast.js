// Sistem notifikasi custom Literasi Yuk!
(function () {
  const STYLE_ID = "literasi-toast-style";

  function loadToastStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const link = document.createElement("link");
    link.id = STYLE_ID;
    link.rel = "stylesheet";
    link.href = "toast.css";
    document.head.appendChild(link);
  }

  function showToast(message, type = "success", duration = 3000) {
    loadToastStyle();

    let container = document.getElementById("toastContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-atomic", "true");
      document.body.appendChild(container);
    }

    const icons = {
      success: "✓",
      error: "×",
      warning: "!",
      info: "i"
    };

    const titles = {
      success: "Berhasil!",
      error: "Gagal!",
      warning: "Perhatian!",
      info: "Informasi"
    };

    const toast = document.createElement("div");
    toast.className = `custom-toast toast-${type}`;

    const icon = document.createElement("div");
    icon.className = "toast-icon";
    icon.textContent = icons[type] || icons.info;

    const content = document.createElement("div");
    content.className = "toast-content";

    const title = document.createElement("strong");
    title.textContent = titles[type] || titles.info;

    const description = document.createElement("span");
    description.textContent = message;

    content.append(title, description);
    toast.append(icon, content);
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("toast-show");
    });

    window.setTimeout(() => {
      toast.classList.remove("toast-show");
      toast.classList.add("toast-hide");

      window.setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  // Menampilkan notifikasi yang disimpan sebelum pindah halaman.
  function showPendingToast() {
    const pending = sessionStorage.getItem("literasiPendingToast");

    if (!pending) return;

    sessionStorage.removeItem("literasiPendingToast");

    try {
      const data = JSON.parse(pending);
      showToast(data.message, data.type || "success");
    } catch (error) {
      console.error("Notifikasi tidak dapat ditampilkan:", error);
    }
  }

  window.showToast = showToast;
  window.setPendingToast = function (message, type = "success") {
    sessionStorage.setItem(
      "literasiPendingToast",
      JSON.stringify({ message, type })
    );
  };

  loadToastStyle();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showPendingToast);
  } else {
    showPendingToast();
  }
})();
