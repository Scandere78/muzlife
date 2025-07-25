import Image from "next/image";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaBookmark } from "react-icons/fa";
import ReadingTracker from "../../../components/ReadingTracker";
import { useAuth } from "../../../contexts/AuthContext";

// ...recitationsMap, recitersInfo, souratesNames (identiques à la version JS, typés ci-dessous)

const recitationsMap: Record<string, string> = {
  "abdul-basit": "abdelbasset-abdessamad",
  "mishary": "mishary-rashid",
  "saad": "saad-ghamidi",
  "yasser": "yasser-dossari",
  "balilah": "bandar-balila",
  "hussary": "mahmoud-khalil-hussary",
  "afs": "afs",
  "hudhaify": "hudhaify",
  "sds": "sudais",
  "maher": "maher",
  "h_dukhain": "h_dukhain",
  "soufi-1": "soufi-1",
  "jhn": "jhn",
  "aabd-lrhmn-lshh-t": "abdulrahman-al-shahat",
  "islam": "islam-subhi",
};

const recitersInfo: Record<string, { name: string; image: string }> = {
  "abdul-basit": { name: "Abdul Basit", image: "/img/abdul-basit.webp" },
  "saad": { name: "Saad Al-Ghamidi", image: "/img/saad-al-ghamdi.jpg" },
  "yasser": { name: "Yasser Al-Dossari", image: "/img/yasser-al-dossari.png" },
  "balilah": { name: "Bandar Balila", image: "/img/bandar-balila.jpg" },
  "hussary": { name: "Mahmoud Khalil Hussary", image: "/img/mahmoud.jpg" },
  "afs": { name: "Abu Faisal", image: "/img/mishary.webp" },
  "hudhaify": { name: "Hudhaify", image: "/images/hudhaify.jpg" },
  "sds": { name: "Abdul Rahman Al-Sudais", image: "/img/sudais.jpg" },
  "maher": { name: "Maher Al Meaqli", image: "/img/Maher.png" },
  "h_dukhain": { name: "Haitham Aldukhain", image: "/img/haitham.webp" },
  "soufi-1": { name: "Abderrashed Sofy", image: "/img/abdul-rashid-ali-sufi.png" },
  "jhn": { name: "Abdellah Al-Johany", image: "/img/al.jpg" },
  "aabd-lrhmn-lshh-t": { name: "Abdulrahman Al Shahat", image: "/img/abderrahman-shahat.jpg" },
  "islam": { name: "Islam Subhi", image: "/img/islam.png" },
};

const souratesNames: string[] = [
  "Al-Fatiha", "Al-Baqarah", "Aali Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajda", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqia", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahina",
  "As-Saff", "Al-Jumu'a", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqa", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyama", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiya", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Lail", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzala", "Al-Adiyat",
  "Al-Qari'a", "At-Takathur", "Al-Asr", "Al-Humaza", "Al-Fil", "Quraish", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

type RecitationsProps = {
  params: Promise<{ id: string }>;
};

export default async function Recitations({ params }: RecitationsProps) {
  const { id } = await params;
  const reciterFolder = recitationsMap[id];
  const reciterInfo = recitersInfo[id];
  // Ici, tu peux faire des fetch côté server si besoin

  // Pour la démo, on affiche juste les infos de base
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-2">{reciterInfo?.name || "Récitateur inconnu"}</h1>
      <div className="mb-6">
        <Image src={reciterInfo?.image || "/muzlife.JPG"} alt={reciterInfo?.name || id} width={80} height={80} className="rounded-full" />
      </div>
      <div className="text-gray-400 mb-4">Dossier audio : {reciterFolder}</div>
      <div className="bg-black/30 rounded-xl p-6 text-gray-100 text-2xl leading-loose text-center">
        (Ici tu peux afficher la liste des sourates, les boutons de lecture, etc. en SSR)
      </div>
    </main>
  );
}
