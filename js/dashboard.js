// Pengaturan dashboard, profil pengguna, dan logout Literasi Yuk!

(function () {
  let session;

  try {
    session = JSON.parse(localStorage.getItem("penggunaLogin") || "null");
  } catch {
    session = null;
  }

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const name = session.nama || "Pengguna";
  const email = session.email || "";

  const namaElement = document.getElementById("namaPengguna");
  const emailElement = document.getElementById("emailPengguna");
  const greetingName = document.getElementById("sapaanNama");
  const avatar = document.getElementById("avatarInitial");

  if (namaElement) namaElement.textContent = name;
  if (emailElement) emailElement.textContent = email;
  if (greetingName) greetingName.textContent = `Halo, ${name}!`;
  if (avatar) avatar.textContent = name.charAt(0).toUpperCase();

  const greeting = document.getElementById("greeting");

  if (greeting) {
    const hour = new Date().getHours();

    if (hour < 11) {
      greeting.textContent = "Selamat pagi! Semoga harimu produktif.";
    } else if (hour < 15) {
      greeting.textContent = "Selamat siang! Yuk, lanjut kelola toko bukumu.";
    } else if (hour < 18) {
      greeting.textContent = "Selamat sore! Cek koleksi dan pesanan hari ini.";
    } else {
      greeting.textContent = "Selamat malam! Terima kasih sudah mampir.";
    }
  }

  // Logout
  document.getElementById("logoutLink")?.addEventListener("click", () => {
    localStorage.removeItem("penggunaLogin");
    setPendingToast("Kamu berhasil keluar dari akun.", "success");
    window.location.href = "index.html";
  });

  // Statistik dashboard
  if (typeof daftarBuku !== "undefined") {
    const totalStock = daftarBuku.reduce((sum, book) => sum + book.stok, 0);
    const stockValue = daftarBuku.reduce(
      (sum, book) => sum + book.stok * book.harga,
      0
    );
    const outOfStock = daftarBuku.filter((book) => book.stok === 0).length;

    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    setText("totalJudul", daftarBuku.length);
    setText("totalStok", totalStock);

    if (typeof rupiah === "function") {
      setText("nilaiStok", rupiah(stockValue));
    }

    setText("stokHabis", outOfStock);

    const featuredBooks = document.getElementById("featuredBooks");

    if (featuredBooks) {
      featuredBooks.innerHTML = daftarBuku
        .slice(0, 5)
        .map(
          (book) => `
            <div class="featured-book">
              <img
                src="${book.gambar}"
                alt="Cover ${book.judul}"
                onerror="this.style.opacity='.15'"
              >
              <strong>${book.judul}</strong>
              <small>${book.penulis}</small>
            </div>
          `
        )
        .join("");
    }
  }
})();
