// Mengambil elemen HTML
const tabelBuku = document.getElementById("tabelBuku");
const formBuku = document.getElementById("formBuku");
const pencarian = document.getElementById("pencarian");

// Menentukan status stok buku
function statusStok(stok) {
    if (stok === 0) {
        return '<span class="status habis">Habis</span>';
    } else if (stok <= 5) {
        return '<span class="status menipis">Menipis</span>';
    } else {
        return '<span class="status tersedia">Tersedia</span>';
    }
}

// Menampilkan daftar buku ke dalam tabel
function tampilkanBuku(data = daftarBuku) {
    tabelBuku.innerHTML = "";

    if (!data.length) {
        tabelBuku.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    Buku tidak ditemukan.
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(b => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <img
                    class="book-cover"
                    src="${b.gambar}"
                    alt="Cover ${b.judul}"
                    onerror="this.alt='Cover tidak tersedia'; this.style.opacity='.2'"
                >
            </td>
            <td>${b.judul}</td>
            <td>${b.penulis}</td>
            <td>${b.kategori}</td>
            <td>${rupiah(b.harga)}</td>
            <td>${b.stok}</td>
            <td>${statusStok(b.stok)}</td>
            <td>
                <button class="btn-edit" data-edit="${b.id}">
                    Ubah stok
                </button>
                <button class="btn-delete" data-delete="${b.id}">
                    Hapus
                </button>
            </td>
        `;

        tabelBuku.appendChild(tr);
    });

    // Event untuk tombol ubah stok
    tabelBuku.querySelectorAll("[data-edit]").forEach(btn => {
        btn.addEventListener("click", () => {
            ubahStok(Number(btn.dataset.edit));
        });
    });

    // Event untuk tombol hapus buku
    tabelBuku.querySelectorAll("[data-delete]").forEach(btn => {
        btn.addEventListener("click", () => {
            hapusBuku(Number(btn.dataset.delete));
        });
    });
}

// Memperbarui ringkasan stok buku
function updateRingkasan() {
    const set = (id, nilai) => {
        const el = document.getElementById(id);

        if (el) {
            el.textContent = nilai;
        }
    };

    set("totalBuku", daftarBuku.length);

    set(
        "totalStok",
        daftarBuku.reduce((total, buku) => total + buku.stok, 0)
    );

    set(
        "bukuHabis",
        daftarBuku.filter(buku => buku.stok === 0).length
    );
}

// Mengubah jumlah stok buku
function ubahStok(id) {
    const buku = daftarBuku.find(b => b.id === id);

    if (!buku) return;

    const value = prompt(
        `Stok baru untuk ${buku.judul}:`,
        buku.stok
    );

    if (value === null) return;

    const stokBaru = Number(value);

    if (!Number.isInteger(stokBaru) || stokBaru < 0) {
        alert("Stok harus berupa angka 0 atau lebih.");
        return;
    }

    buku.stok = stokBaru;

    tampilkanBuku();
    updateRingkasan();
}

// Menghapus buku dari katalog
function hapusBuku(id) {
    const index = daftarBuku.findIndex(b => b.id === id);

    if (index < 0) return;

    if (confirm(`Hapus ${daftarBuku[index].judul} dari katalog?`)) {
        daftarBuku.splice(index, 1);

        tampilkanBuku();
        updateRingkasan();
    }
}

// Menambahkan buku baru
formBuku?.addEventListener("submit", e => {
    e.preventDefault();

    const buku = {
        id: Date.now(),
        judul: document.getElementById("judul").value.trim(),
        penulis: document.getElementById("penulis").value.trim(),
        kategori: document.getElementById("kategori").value,
        harga: Number(document.getElementById("harga").value),
        stok: Number(document.getElementById("stok").value),
        gambar: document.getElementById("gambar").value.trim()
    };

    if (
        !buku.judul ||
        !buku.penulis ||
        !buku.kategori ||
        buku.harga <= 0 ||
        buku.stok < 0 ||
        !buku.gambar
    ) {
        alert("Lengkapi semua data dengan benar.");
        return;
    }

    daftarBuku.push(buku);

    formBuku.reset();

    tampilkanBuku();
    updateRingkasan();

    alert("Buku berhasil ditambahkan.");
});

// Fitur pencarian buku
pencarian?.addEventListener("input", () => {
    const q = pencarian.value.toLowerCase();

    const hasilPencarian = daftarBuku.filter(buku => {
        return [
            buku.judul,
            buku.penulis,
            buku.kategori
        ].some(nilai => nilai.toLowerCase().includes(q));
    });

    tampilkanBuku(hasilPencarian);
});

// Menampilkan buku dan ringkasan saat halaman dibuka
tampilkanBuku();
updateRingkasan();