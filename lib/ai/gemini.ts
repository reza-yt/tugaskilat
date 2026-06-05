import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export type TaskType =
  | "makalah"
  | "essay"
  | "laporan"
  | "matematika"
  | "presentasi"
  | "book-report"
  | "soal-jawaban"
  | "rangkuman"
  | "proposal"
  | "karya-ilmiah";

export type WordCountOption = "singkat" | "standar" | "panjang";

export interface TaskInput {
  taskType: TaskType;
  title: string;
  subject?: string;
  educationLevel: "sma" | "kuliah";
  major?: string;
  instructions?: string;
  wordCount: WordCountOption;
}

const WORD_COUNT_MAP: Record<WordCountOption, number> = {
  singkat: 500,
  standar: 1000,
  panjang: 2000,
};

function getSystemPrompt(taskType: TaskType): string {
  const prompts: Record<TaskType, string> = {
    makalah: `Kamu adalah asisten akademik ahli. Tulis makalah lengkap dengan struktur:
Pendahuluan, Landasan Teori, Pembahasan, Penutup (Kesimpulan & Saran), Daftar Pustaka.
Gunakan bahasa Indonesia formal sesuai PUEBI. Referensi harus realistis (nama penulis, tahun, judul buku/jurnal).
Tambahkan catatan kaki jika relevan. Pastikan argumen kohesif dan didukung sumber.`,

    essay: `Kamu adalah penulis essay akademik profesional. Tulis essay dengan argumen yang terstruktur dan kohesif.
Gunakan paragraf pembuka yang kuat, body paragraf dengan bukti dan contoh konkret, dan penutup yang memukau.
Bahasa Indonesia formal tetapi mengalir. Sertakan perspektif kritis dan analisis mendalam.`,

    laporan: `Kamu adalah asisten laboratorium ahli. Tulis laporan praktikum dengan format:
Tujuan, Dasar Teori, Alat & Bahan, Prosedur Kerja, Hasil Pengamatan (tabel/data placeholder),
Pembahasan, Kesimpulan. Sertakan placeholder [DATA HASIL PENGAMATAN] untuk diisi user.
Gunakan bahasa formal ilmiah dan notasi yang tepat.`,

    matematika: `Kamu adalah tutor matematika ahli. Selesaikan soal matematika dengan menampilkan
langkah-langkah penyelesaian yang detail dan sistematis. Gunakan notasi matematis yang jelas.
Jelaskan setiap langkah dengan reasoning yang mudah dipahami. Jika ada rumus, tuliskan dan jelaskan penggunaannya.`,

    presentasi: `Kamu adalah desainer presentasi profesional. Buat outline bahan presentasi dengan format:
Slide 1: Judul & Nama
Slide 2: Agenda/Daftar Isi
Slide 3-N: Konten (bullet points, bukan paragraf panjang)
Slide Terakhir: Kesimpulan & Terima Kasih
Sertakan speaker notes detail untuk setiap slide. Fokus pada poin kunci dan visual storytelling.`,

    "book-report": `Kamu adalah kritikus literatur akademik. Tulis book report/review dengan struktur:
Identitas Buku/Paper (judul, penulis, penerbit, tahun), Ringkasan Isi (sinopsis tanpa spoiler berlebihan),
Analisis Kritis (tema, gaya penulisan, kontribusi), Kelebihan & Kekurangan, Kesimpulan & Rekomendasi.`,

    "soal-jawaban": `Kamu adalah guru/dosen ahli pembuat soal. Buat soal beserta jawaban lengkap dengan pembahasan.
Format: Soal, Jawaban, Pembahasan (langkah-langkah penyelesaian). Variasikan tingkat kesulitan.
Pastikan soal valid dan jawaban benar.`,

    rangkuman: `Kamu adalah ahli merangkum materi akademik. Buat rangkuman/ringkasan yang padat dan terstruktur.
Gunakan poin-poin utama, sub-poin, dan highlight konsep kunci. Sertakan definisi penting dan hubungan antar konsep.
Rangkuman harus mudah dipelajari dan mencakup semua materi penting.`,

    proposal: `Kamu adalah penulis proposal akademik profesional. Tulis proposal dengan struktur:
Judul, Latar Belakang, Rumusan Masalah, Tujuan, Manfaat, Tinjauan Pustaka, Metodologi,
Jadwal Kegiatan, Anggaran (jika relevan), Daftar Pustaka. Gunakan bahasa formal dan argumentasi yang kuat.`,

    "karya-ilmiah": `Kamu adalah peneliti akademik ahli. Tulis karya ilmiah dengan struktur:
Abstrak, Pendahuluan, Kajian Teori, Metode Penelitian, Hasil dan Pembahasan, Kesimpulan,
Daftar Pustaka. Gunakan gaya penulisan ilmiah formal, kutipan yang tepat, dan analisis data yang sistematis.`,
  };

  return prompts[taskType];
}

export function generateTaskStream(input: TaskInput) {
  const systemPrompt = getSystemPrompt(input.taskType);
  const targetWords = WORD_COUNT_MAP[input.wordCount];

  const userPrompt = buildUserPrompt(input, targetWords);

  return streamText({
    model: google("gemini-2.5-flash-preview-05-20"),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.7,
    maxOutputTokens: 8192,
  });
}

function buildUserPrompt(input: TaskInput, targetWords: number): string {
  let prompt = `Topik/Judul: ${input.title}\n`;
  prompt += `Jenjang Pendidikan: ${input.educationLevel === "sma" ? "SMA/SMK" : "Kuliah/Perguruan Tinggi"}\n`;

  if (input.subject) {
    prompt += `Mata Pelajaran/Kuliah: ${input.subject}\n`;
  }

  if (input.major) {
    prompt += `Jurusan: ${input.major}\n`;
  }

  prompt += `Target Panjang: ~${targetWords} kata\n`;

  if (input.instructions) {
    prompt += `\nInstruksi Tambahan:\n${input.instructions}\n`;
  }

  prompt += `\nBuatkan tugas dengan kualitas terbaik, sesuai standar akademik ${
    input.educationLevel === "sma" ? "SMA/SMK" : "perguruan tinggi"
  }. Gunakan bahasa Indonesia yang baik dan benar.`;

  return prompt;
}
