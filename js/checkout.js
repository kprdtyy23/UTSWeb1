// Proses keranjang dan checkout Literasi Yuk!

const selectBuku = document.getElementById("pilihBuku");
const cart = [];
const ordersKey = "pesananLiterasiYuk";

function renderOptions() {
  if (!selectBuku) return;

  const availableBooks = daftarBuku.filter((book) => book.stok > 0);

  selectBuku.innerHTML = `
    <option value="">Pilih buku</option>
    ${availableBooks
      .map(
        (book) => `
          <option value="${book.id}">
            ${book.judul} — ${rupiah(book.harga)} (stok ${book.stok})
          </option>
        `
      )
      .join("")}
  `;
}

function renderCart() {
  const cartBox = document.getElementById("daftarKeranjang");
  if (!cartBox) return;

  const total = cart.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );

  if (cart.length) {
    cartBox.innerHTML = cart
      .map(
        (item, index) => `
          <div class="cart-item">
            <span>${item.judul} × ${item.jumlah}</span>
            <span>
              ${rupiah(item.harga * item.jumlah)}
              <button type="button" data-remove="${index}">Hapus</button>
            </span>
          </div>
        `
      )
      .join("");
  } else {
    cartBox.innerHTML = `
      <p class="muted">Belum ada buku di keranjang.</p>
    `;
  }

  cartBox.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.remove), 1);
      renderCart();
      showToast("Buku dihapus dari keranjang.", "info");
    });
  });

  const totalElement = document.getElementById("totalPembayaran");
  if (totalElement) totalElement.textContent = rupiah(total);
}

// Tambah buku ke keranjang
document.getElementById("btnTambah")?.addEventListener("click", () => {
  const id = Number(selectBuku?.value);
  const jumlah = Number(document.getElementById("jumlahBuku").value);
  const book = daftarBuku.find((item) => item.id === id);

  if (!book) {
    showToast("Pilih buku terlebih dahulu.", "warning");
    return;
  }

  if (!Number.isInteger(jumlah) || jumlah < 1) {
    showToast("Jumlah buku tidak valid.", "error");
    return;
  }

  const currentQuantity = cart
    .filter((item) => item.id === id)
    .reduce((sum, item) => sum + item.jumlah, 0);

  if (currentQuantity + jumlah > book.stok) {
    showToast("Jumlah melebihi stok yang tersedia.", "error");
    return;
  }

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.jumlah += jumlah;
  } else {
    cart.push({
      id: book.id,
      judul: book.judul,
      harga: book.harga,
      jumlah
    });
  }

  renderCart();
  showToast(`${book.judul} berhasil ditambahkan ke keranjang.`, "success");
});

// Simpan pesanan
document.getElementById("formCheckout")?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    showToast("Keranjang masih kosong.", "warning");
    return;
  }

  const name = document.getElementById("namaPembeli").value.trim();
  const email = document.getElementById("emailPembeli").value.trim();
  const address = document.getElementById("alamatPembeli").value.trim();

  for (const item of cart) {
    const book = daftarBuku.find((data) => data.id === item.id);

    if (!book || book.stok < item.jumlah) {
      showToast(`Stok ${item.judul} tidak mencukupi.`, "error");
      return;
    }
  }

  cart.forEach((item) => {
    const book = daftarBuku.find((data) => data.id === item.id);
    book.stok -= item.jumlah;
  });

  let orders = [];

  try {
    orders = JSON.parse(localStorage.getItem(ordersKey) || "[]");
    if (!Array.isArray(orders)) orders = [];
  } catch {
    orders = [];
  }

  const order = {
    kode: `LY${Date.now().toString().slice(-8)}`,
    nama: name,
    email,
    alamat: address,
    tanggal: new Date().toLocaleString("id-ID"),
    items: cart.map((item) => ({ ...item })),
    total: cart.reduce(
      (sum, item) => sum + item.harga * item.jumlah,
      0
    ),
    status: "Pesanan dibuat"
  };

  orders.unshift(order);
  localStorage.setItem(ordersKey, JSON.stringify(orders));

  cart.length = 0;
  event.target.reset();
  renderCart();
  renderOptions();

  showToast(`Pesanan berhasil dibuat! Kode: ${order.kode}`, "success");
});

renderOptions();
renderCart();
