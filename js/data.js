// Data contoh buku untuk project Literasi Yuk!
const daftarBuku = [
    {
        id: 1,
        judul: "Laskar Pelangi",
        penulis: "Andrea Hirata",
        kategori: "Novel",
        harga: 85000,
        stok: 15,
        gambar: "images/laskar.jpg"
    },
    {
        id: 2,
        judul: "Bumi",
        penulis: "Tere Liye",
        kategori: "Fantasi",
        harga: 95000,
        stok: 8,
        gambar: "images/bumi.jpg"
    },
    {
        id: 3,
        judul: "Atomic Habits",
        penulis: "James Clear",
        kategori: "Pengembangan Diri",
        harga: 110000,
        stok: 3,
        gambar: "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg"
    },
    {
        id: 4,
        judul: "Filosofi Teras",
        penulis: "Henry Manampiring",
        kategori: "Pengembangan Diri",
        harga: 89000,
        stok: 0,
        gambar: "images/filosofi.jpg"
    },
    {
        id: 5,
        judul: "Negeri 5 Menara",
        penulis: "Ahmad Fuadi",
        kategori: "Novel",
        harga: 78000,
        stok: 12,
        gambar: "images/negeri.jpg"
    }
];

// Fungsi untuk mengubah angka menjadi format Rupiah
function rupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}