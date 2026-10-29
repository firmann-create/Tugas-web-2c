// @ts-check
"use strict";

/** @typedef {{ id: number, kata: string, tema: string, terbuka: boolean }} Kartu */
/** @typedef {{ wajib?: boolean, minPanjang?: number, maxPanjang?: number, pola?: RegExp }} AturanField */

/**
 * Format angka ke gaya Indonesia (1.000.000).
 * @param {number} angka
 * @returns {string}
 */
function formatAngka(angka) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

/**
 * Simpan nilai ke localStorage.
 * @param {string} kunci
 * @param {unknown} nilai
 * @returns {void}
 */
function simpan(kunci, nilai) {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch (error) {
    tanganiError(error);
  }
}

/**
 * Ambil nilai dari localStorage.
 * @param {string} kunci
 * @returns {any}
 */
function ambil(kunci) {
  try {
    const mentah = localStorage.getItem(kunci);
    return mentah === null ? null : JSON.parse(mentah);
  } catch (error) {
    tanganiError(error);
    return null;
  }
}

/**
 * Terapkan tema (light / dark) ke halaman.
 * @param {string} tema
 * @returns {void}
 */
function terapkanTema(tema) {
  document.documentElement.setAttribute("data-tema", tema);
  simpan("tema", tema);
}

/**
 * Ubah kata ke huruf kecil tanpa spasi berlebih.
 * @param {string} kata
 * @returns {string}
 */
function normalisasi(kata) {
  return kata.trim().toLowerCase();
}

/**
 * Cari kartu berdasarkan kata kunci.
 * @param {Kartu[]} kartu
 * @param {string} kataKunci
 * @returns {Kartu[]}
 */
function cariKartu(kartu, kataKunci) {
  const q = normalisasi(kataKunci);
  return kartu.filter((/** @type {Kartu} */ k) => normalisasi(k.kata).includes(q));
}

/**
 * Buat teks label + jumlah, contoh: "Kartu (12)".
 * @param {string} label
 * @param {number} jumlah
 * @returns {string}
 */
function buatLabel(label, jumlah) {
  return `${label} (${formatAngka(jumlah)})`;
}

/**
 * Ambil nilai dari event input.
 * @param {Event} v
 * @returns {string}
 */
function nilaiInput(v) {
  return /** @type {HTMLInputElement} */ (v.target).value;
}

/**
 * Handler klik kartu: balik status terbuka.
 * @param {MouseEvent} v
 * @returns {void}
 */
function klikKartu(v) {
  const el = /** @type {HTMLElement} */ (v.currentTarget);
  el.classList.toggle("terbuka");
}

/**
 * Handler pencarian.
 * @param {Event} v
 * @returns {string}
 */
function ketikCari(v) {
  return normalisasi(nilaiInput(v));
}

/**
 * Tampilkan pesan error di bawah field.
 * @param {HTMLElement} el
 * @param {string} pesanError
 * @returns {void}
 */
function tampilkanPesan(el, pesanError) {
  el.textContent = pesanError;
  el.hidden = pesanError === "";
}

/**
 * Validasi satu field. Mengembalikan pesan error, atau "" kalau valid.
 * @param {string} nilai
 * @param {AturanField} aturanField
 * @returns {string}
 */
function validasiField(nilai, aturanField) {
  const teks = nilai.trim();
  if (aturanField.wajib && teks === "") return "Wajib diisi.";
  if (aturanField.minPanjang && teks.length < aturanField.minPanjang)
    return `Minimal ${aturanField.minPanjang} karakter.`;
  if (aturanField.maxPanjang && teks.length > aturanField.maxPanjang)
    return `Maksimal ${aturanField.maxPanjang} karakter.`;
  if (aturanField.pola && !aturanField.pola.test(teks)) return "Format tidak valid.";
  return "";
}

/**
 * Tampilkan teks ke elemen dengan id tertentu.
 * @param {string} id
 * @param {string} teks
 * @returns {void}
 */
function tampilkanTeks(id, teks) {
  const el = document.getElementById(id);
  if (el) el.textContent = teks;
}

/**
 * Tangani error apa pun dengan aman.
 * @param {unknown} error
 * @returns {void}
 */
function tanganiError(error) {
  const pesan = error instanceof Error ? error.message : String(error);
  console.error("[script.js]", pesan);
}

// Daftarkan fungsi agar bisa dipanggil dari HTML (onclick, oninput, dll.)
Object.assign(window, {
  cariKartu,
  buatLabel,
  klikKartu,
  ketikCari,
  tampilkanPesan,
  validasiField,
  tampilkanTeks,
});

// Tema tersimpan dipakai saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  terapkanTema(ambil("tema") || "light");
});