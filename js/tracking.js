// Menampilkan riwayat pesanan Literasi Yuk!

const detail = document.getElementById("detailPesanan");
const empty = document.getElementById("pesananKosong");

function getOrders() {
  try {
    const orders = JSON.parse(
      localStorage.getItem("pesananLiterasiYuk") || "[]"
    );

    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function renderOrders() {
  if (!detail || !empty) return;

  const orders = getOrders();

  if (!orders.length) {
    empty.style.display = "block";
    detail.innerHTML = "";
    return;
  }

  empty.style.display = "none";

  detail.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card">
          <div class="order-card-head">
            <div>
              <h4>Pesanan ${order.kode}</h4>
              <div class="order-meta">
                ${order.tanggal} · ${order.nama} (${order.email})
              </div>
            </div>
            <span class="order-status">${order.status}</span>
          </div>

          <div class="order-books">
            ${order.items
              .map(
                (item) => `
                  ${item.judul} × ${item.jumlah} —
                  ${rupiah(item.harga * item.jumlah)}
                `
              )
              .join("<br>")}

            <br>
            <strong>Alamat:</strong> ${order.alamat}
          </div>

          <div class="order-total">
            Total: ${rupiah(order.total)}
          </div>
        </article>
      `
    )
    .join("");
}

renderOrders();
