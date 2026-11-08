// Pengaturan akun dan autentikasi Literasi Yuk!

const DEMO_ACCOUNT = {
  nama: "Administrator",
  email: "admin@literasiyuk.com",
  password: "buku123"
};

const USERS_KEY = "daftarAkun";
const SESSION_KEY = "penggunaLogin";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function openModal(id) {
  document.getElementById(id)?.classList.add("show");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove("show");
}

(function initAuth() {
  const users = getUsers();
  const demoExists = users.some(
    (user) => user.email.toLowerCase() === DEMO_ACCOUNT.email
  );

  if (!demoExists) {
    users.push(DEMO_ACCOUNT);
    saveUsers(users);
  }

  document.getElementById("registerOpen")?.addEventListener("click", () => {
    openModal("registerModal");
  });

  document.getElementById("forgotOpen")?.addEventListener("click", () => {
    openModal("forgotModal");
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.dataset.close);
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("show");
      }
    });
  });

  document.getElementById("togglePassword")?.addEventListener("click", () => {
    const input = document.getElementById("password");
    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
  });

  // Login
  document.getElementById("loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document
      .getElementById("email")
      .value.trim()
      .toLowerCase();

    const password = document.getElementById("password").value;

    const user = getUsers().find(
      (item) =>
        item.email.toLowerCase() === email &&
        item.password === password
    );

    if (!user) {
      showToast("Email atau password belum sesuai.", "error");
      return;
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        nama: user.nama,
        email: user.email
      })
    );

    setPendingToast(`Selamat datang kembali, ${user.nama}!`, "success");
    window.location.href = "dashboard.html";
  });

  // Registrasi akun
  document
    .getElementById("registerForm")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const nama = document.getElementById("registerName").value.trim();
      const email = document
        .getElementById("registerEmail")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("registerPassword").value;

      const currentUsers = getUsers();
      const emailExists = currentUsers.some(
        (user) => user.email.toLowerCase() === email
      );

      if (emailExists) {
        showToast("Email sudah terdaftar.", "error");
        return;
      }

      currentUsers.push({ nama, email, password });
      saveUsers(currentUsers);

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ nama, email })
      );

      setPendingToast("Akun berhasil dibuat. Selamat datang!", "success");
      window.location.href = "dashboard.html";
    });

  // Reset password
  document
    .getElementById("forgotForm")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document
        .getElementById("forgotEmail")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("newPassword").value;

      const currentUsers = getUsers();
      const user = currentUsers.find(
        (item) => item.email.toLowerCase() === email
      );

      if (!user) {
        showToast("Email belum terdaftar.", "error");
        return;
      }

      user.password = password;
      saveUsers(currentUsers);
      closeModal("forgotModal");

      showToast("Password berhasil diperbarui.", "success");
      document.getElementById("forgotForm").reset();
    });
})();
