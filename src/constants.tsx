
import React from 'react';
import { FunFact } from './types';

// Path file lokal. Jika file tidak ditemukan, sistem akan menggunakan placeholder publik.
export const VANIA_CONFIG = {
  // Ganti "/assets/img/vania.jpg" dengan path foto Vania Anda
  photoPath: "/222.jpeg", 
  // Ganti "/assets/audio/romantic.mp3" dengan path musik romantis Anda
  musicPath: "/music.mp3", 
  fullName: "Vania Dhiya Pramudita",
  birthDate: "27 November 1999",
  traits: [
    { title: "Senyumanmu", text: "Aku suka cara kamu tersenyum terutama kalo kamu tersenyum karena aku." },
    { title: "Kenyamanan", text: "Sejauh ini aku merasakan kenyamanan yang gapernah aku dapatkan dari pengalaman hubunganku. Tenang, hangat, dan selalu apa adanya itu yang kamu berikan." },
    { title: "Hal Kecil", text: "Caramu memperhatikan hal-hal kecil adalah favoritku." }
  ]
};

export const FUN_FACTS: FunFact[] = [
  {
    id: 1,
    icon: "✨",
    title: "Senyum Spontan",
    description: "Aku kadang tersenyum sendiri tiap kali liat kamu."
  },
  {
    id: 2,
    icon: "⌛",
    title: "Waktu Terasa Singkat",
    description: "Ngobrol sama kamu seru banget. Kenapa ya? apa karena kita sefrekuensi?"
  },
  {
    id: 3,
    icon: "💭",
    title: "First Impression",
    description: "Sejujurnya, dari awal kita kenal, ada 'sesuatu' yang bikin aku pengen tahu lebih banyak tentang kamu dan sejauh ini aku sedikit tahu, you special"
  }
];
