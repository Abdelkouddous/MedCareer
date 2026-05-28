/**
 * VitalWork — Algerian Mock Data Seed Script
 * 
 * Populates the database with realistic Algerian medical data:
 *   • 10 Employers (hospitals/clinics)
 *   • 15 Job Seekers (doctors, nurses, pharmacists)
 *   • 60 Jobs across all specializations
 *   • 40 Applications with varied statuses
 *   • 8 Blog posts with medical content
 * 
 * Usage:
 *   node backend/seed.js          → seeds data (additive)
 *   node backend/seed.js --reset  → clears everything first, then seeds
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Employer from "./models/EmployerModel.js";
import JobSeeker from "./models/JobSeekerModel.js";
import Job from "./models/JobModel.js";
import Application from "./models/ApplicationModel.js";
import Blog from "./models/BlogModel.js";

import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.log("Could not set custom DNS servers");
}



// ─── Helpers ────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};
const randBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

// ─── Algerian Data Pools ────────────────────────────────────
const WILAYAS = [
  "Algiers", "Oran", "Constantine", "Annaba", "Blida",
  "Batna", "Sétif", "Tlemcen", "Béjaïa", "Tizi Ouzou",
  "Biskra", "Djelfa", "M'sila", "Médéa", "Mostaganem",
  "Skikda", "Chlef", "Ghardaia", "Ouargla", "Jijel",
];

const HOSPITALS = [
  { name: "CHU Mustapha Pacha",        city: "Algiers" },
  { name: "Hôpital Frantz Fanon",      city: "Blida" },
  { name: "CHU Beni Messous",          city: "Algiers" },
  { name: "EHU 1er Novembre 1954",     city: "Oran" },
  { name: "CHU Ibn Badis",             city: "Constantine" },
  { name: "CHU Ibn Rochd",             city: "Annaba" },
  { name: "Hôpital Central de l'Armée", city: "Algiers" },
  { name: "Clinique El Azhar",         city: "Sétif" },
  { name: "Clinique Les Oliviers",     city: "Algiers" },
  { name: "Polyclinique El Biar",      city: "Algiers" },
  { name: "EPH Mohamed Boudiaf",       city: "Médéa" },
  { name: "CHU Tizi Ouzou",            city: "Tizi Ouzou" },
  { name: "EPH Batna",                 city: "Batna" },
  { name: "Clinique Ennasr",           city: "Oran" },
  { name: "Clinique El Hayat",         city: "Constantine" },
];

const FIRST_NAMES_M = [
  "Aymen", "Mohamed", "Ahmed", "Yacine", "Karim",
  "Sofiane", "Nabil", "Amine", "Bilal", "Rachid",
  "Omar", "Khaled", "Samir", "Abdelkader", "Farid",
];
const FIRST_NAMES_F = [
  "Amina", "Fatima", "Khadija", "Samira", "Nadia",
  "Leila", "Meriem", "Soraya", "Houria", "Asma",
  "Yasmine", "Djamila", "Lamia", "Sabrina", "Rania",
];
const LAST_NAMES = [
  "Benali", "Bouzid", "Hamdi", "Mebarki", "Khelif",
  "Bensalah", "Toumi", "Slimani", "Boudiaf", "Cherif",
  "Belkacem", "Ferhat", "Benamara", "Djamel", "Hadjadj",
  "Ait Ahmed", "Bouhadjar", "Mansouri", "Zerrouki", "Brahimi",
];

const SPECIALIZATIONS = [
  "General Practitioner", "Cardiologist", "Dermatologist",
  "Gastroenterologist", "Neurologist", "Oncologist",
  "Psychiatrist", "Rheumatologist", "Urologist",
  "Endocrinologist", "Ophthalmologist", "Orthopedic Specialist",
  "Pediatrician", "Pulmonologist", "Surgery Specialist",
  "Vascular Specialist", "Nurse", "Biologist",
  "Dentist", "Pharmacist", "Pathologist",
];

const JOB_POSITIONS = [
  "Médecin Généraliste", "Médecin Résident",
  "Chef de Service", "Chirurgien",
  "Infirmier(ère) Diplômé(e)", "Infirmier(ère) de Bloc",
  "Pharmacien Hospitalier", "Biologiste Médical",
  "Médecin Spécialiste", "Technicien de Laboratoire",
  "Radiologue", "Anesthésiste-Réanimateur",
  "Sage-femme", "Kinésithérapeute",
  "Dentiste", "Cardiologue",
  "Pédiatre", "Dermatologue",
  "Ophtalmologue", "Psychiatre",
  "Neurologue", "Urologue",
  "Gastro-entérologue", "Pneumologue",
  "Directeur Médical", "Coordinateur Clinique",
];

const JOB_TYPES = ["full-time", "part-time", "internship"];
const JOB_STATUSES = ["pending", "interview", "declined"];
const APP_STATUSES = ["applied", "viewed", "accepted", "rejected"];

const SKILLS = [
  "Auscultation", "ECG Reading", "Emergency Care", "Patient Triage",
  "Surgery Assistance", "IV Administration", "Blood Drawing",
  "Medical Imaging", "Lab Analysis", "Prescription Management",
  "CPR Certified", "Wound Care", "Dialysis Operation",
  "Vaccination Protocols", "Electronic Medical Records",
  "Infection Control", "Pain Management",
  "Pediatric Care", "Geriatric Care", "Mental Health Assessment",
  "Dental Procedures", "Pharmacy Dispensing",
  "Radiography", "Ultrasound", "CT/MRI Interpretation",
];

const LANGUAGES = [
  "Arabic", "French", "English", "Tamazight", "Spanish",
];

const BLOG_CATEGORIES = [
  "Medical News", "Career Advice", "Technology",
  "Research", "Education", "Personal Stories", "Industry Insights",
];

const DEFAULT_PASSWORD = "password123";

// ─── Seed Functions ─────────────────────────────────────────

async function seedEmployers() {
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const employers = [];

  for (let i = 0; i < 10; i++) {
    const h = HOSPITALS[i];
    const isOwner = i === 0;
    const fn = isOwner ? "VitalWork" : pick([...FIRST_NAMES_M, ...FIRST_NAMES_F]);
    const ln = isOwner ? "Admin" : pick(LAST_NAMES);
    employers.push({
      name: fn,
      lastName: ln,
      email: isOwner && process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase() : `employer${i + 1}@vitalwork.dz`,
      password: hash,
      location: h.city,
      specialty: pick(SPECIALIZATIONS.filter(s =>
        ["General Practitioner","Cardiologist","Dermatologist","Gastroenterologist",
         "Neurologist","Oncologist","Psychiatrist","Rheumatologist","Urologist",
         "Endocrinologist","Ophthalmologist","Orthopedic Specialist","Pediatrician",
         "Pulmonologist","Surgery Specialist","Vascular Specialist"].includes(s)
      )),
      role: i === 0 ? "admin" : "employer",
      status: "approved",
      isConfirmed: true,
      plan: pick(["trial", "basic", "pro", "enterprise"]),
      jobOffersQuota: randBetween(5, 50),
      trialJobsLimit: 3,
      lifetimeJobOffersCreated: randBetween(0, 20),
      createdAt: daysAgo(randBetween(30, 365)),
    });
  }

  const inserted = await Employer.insertMany(employers);
  console.log(`✅ Seeded ${inserted.length} employers`);
  return inserted;
}

async function seedJobSeekers() {
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const seekers = [];

  const allNames = [...FIRST_NAMES_M, ...FIRST_NAMES_F];

  for (let i = 0; i < 15; i++) {
    const fn = allNames[i % allNames.length];
    const ln = LAST_NAMES[i % LAST_NAMES.length];
    const spec = SPECIALIZATIONS[i % SPECIALIZATIONS.length];

    seekers.push({
      name: fn,
      lastName: ln,
      email: `seeker${i + 1}@vitalwork.dz`,
      password: hash,
      specialization: spec,
      location: pick(WILAYAS),
      phoneNumber: `+213${randBetween(5, 7)}${String(randBetween(10000000, 99999999))}`,
      bio: `Professionnel de la santé passionné spécialisé en ${spec}. Diplômé de l'Université d'Alger avec ${randBetween(1, 15)} ans d'expérience dans les hôpitaux algériens.`,
      experience: `${randBetween(1, 15)} ans — ${pick(HOSPITALS).name}`,
      education: `Doctorat en Médecine — ${pick(["Université d'Alger", "Université d'Oran", "Université de Constantine", "Université de Annaba", "Université de Tlemcen", "Université de Sétif"])}`,
      skills: pickN(SKILLS, randBetween(3, 7)),
      languages: pickN(LANGUAGES, randBetween(2, 4)),
      isPremium: Math.random() > 0.7,
      isConfirmed: true,
      createdAt: daysAgo(randBetween(10, 300)),
    });
  }

  const inserted = await JobSeeker.insertMany(seekers);
  console.log(`✅ Seeded ${inserted.length} job seekers`);
  return inserted;
}

async function seedJobs(employers) {
  const jobs = [];

  for (let i = 0; i < 60; i++) {
    const hosp = pick(HOSPITALS);
    const spec = pick(SPECIALIZATIONS);
    const pos = pick(JOB_POSITIONS);

    jobs.push({
      position: pos,
      company: hosp.name,
      jobLocation: hosp.city,
      jobType: pick(JOB_TYPES),
      jobStatus: pick(JOB_STATUSES),
      specialization: spec,
      notes: pick([
        "Poste urgent — à pourvoir immédiatement.",
        "Possibilité de logement sur place.",
        "Formation continue incluse.",
        "Horaires flexibles, garde de nuit requise.",
        "Contrat renouvelable selon performance.",
        "Salaire compétitif avec primes.",
        "Avantages sociaux complets (CNAS).",
        "Possibilité d'avancement rapide.",
        `Exigé: minimum ${randBetween(2, 10)} ans d'expérience.`,
        "Stage rémunéré avec possibilité d'embauche.",
        "Environnement de travail moderne et bien équipé.",
        "Collaboration avec une équipe pluridisciplinaire.",
      ]),
      createdBy: pick(employers)._id,
      createdAt: daysAgo(randBetween(1, 90)),
    });
  }

  const inserted = await Job.insertMany(jobs);
  console.log(`✅ Seeded ${inserted.length} jobs`);
  return inserted;
}

async function seedApplications(jobs, seekers) {
  const apps = [];
  const usedPairs = new Set();

  for (let i = 0; i < 40; i++) {
    let job, seeker, pairKey;
    // Ensure unique job+seeker pairs
    let attempts = 0;
    do {
      job = pick(jobs);
      seeker = pick(seekers);
      pairKey = `${job._id}_${seeker._id}`;
      attempts++;
    } while (usedPairs.has(pairKey) && attempts < 100);

    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    apps.push({
      job: job._id,
      jobSeeker: seeker._id,
      status: pick(APP_STATUSES),
      compatibilityScore: randBetween(30, 98),
      createdAt: daysAgo(randBetween(1, 60)),
    });
  }

  const inserted = await Application.insertMany(apps);
  console.log(`✅ Seeded ${inserted.length} applications`);
  return inserted;
}

async function seedBlogs(employers, seekers) {
  const allAuthors = [
    ...employers.map(e => ({ id: e._id, type: "Employer" })),
    ...seekers.map(s => ({ id: s._id, type: "JobSeeker" })),
  ];

  const blogData = [
    {
      title: "La Médecine en Algérie : État des Lieux et Perspectives",
      content:
        "Le système de santé algérien connaît une transformation profonde. Avec plus de 350 hôpitaux publics et des milliers de cliniques privées, l'Algérie investit massivement dans la modernisation de ses infrastructures médicales. Les CHU de Mustapha Pacha à Alger, Ibn Badis à Constantine et EHU d'Oran sont devenus des pôles d'excellence reconnus. La formation médicale algérienne, largement francophone, produit chaque année des milliers de diplômés hautement qualifiés. Cependant, le défi reste de retenir ces talents face à l'émigration vers l'Europe et le Golfe. VitalWork Connect vise à créer un pont entre les professionnels de santé et les établissements qui cherchent à recruter localement.",
      excerpt: "Tour d'horizon du système de santé algérien et des opportunités pour les professionnels médicaux.",
      category: "Industry Insights",
      tags: ["Algérie", "Santé publique", "Recrutement médical"],
    },
    {
      title: "Comment Réussir son Résidanat en Algérie",
      content:
        "Le concours de résidanat en Algérie est l'un des examens les plus compétitifs du parcours médical. Chaque année, des milliers de médecins généralistes tentent d'accéder à une spécialisation. La préparation nécessite au minimum 6 mois de travail intensif. Les meilleures stratégies incluent : rejoindre un groupe d'étude, utiliser les QCM des années précédentes, et suivre un planning strict. Les spécialités les plus demandées restent la cardiologie, la chirurgie et la pédiatrie. Conseil important : ne négligez pas les matières fondamentales comme l'anatomie et la physiologie, elles représentent souvent plus de 40% des questions.",
      excerpt: "Guide pratique pour préparer et réussir le concours de résidanat en médecine.",
      category: "Education",
      tags: ["Résidanat", "Concours", "Formation"],
    },
    {
      title: "L'Intelligence Artificielle au Service de la Santé en Algérie",
      content:
        "L'IA révolutionne la pratique médicale dans le monde entier, et l'Algérie n'est pas en reste. Plusieurs projets pilotes sont en cours dans les CHU algériens pour l'aide au diagnostic par imagerie, notamment en radiologie et en dermatologie. L'Université des Sciences et Technologies Houari Boumediene (USTHB) mène des recherches pionnières en imagerie médicale assistée par IA. Des startups algériennes développent des solutions de télémédecine adaptées aux zones rurales, où l'accès aux spécialistes reste limité. L'avenir de la médecine algérienne passe indéniablement par l'adoption de ces nouvelles technologies.",
      excerpt: "Comment l'intelligence artificielle transforme la pratique médicale en Algérie.",
      category: "Technology",
      tags: ["IA", "Innovation", "Télémédecine"],
    },
    {
      title: "Les Infirmiers en Algérie : Des Héros Méconnus",
      content:
        "Les infirmiers constituent la colonne vertébrale du système de santé algérien. Avec plus de 120 000 infirmiers diplômés, ils assurent les soins au quotidien dans les hôpitaux, les cliniques et les centres de santé de proximité. Malgré leur rôle essentiel, la profession reste sous-valorisée avec des conditions de travail difficiles et des salaires modestes. Le récent décret portant statut particulier des paramédicaux apporte quelques améliorations, mais beaucoup reste à faire. VitalWork Connect offre une plateforme aux infirmiers pour trouver de meilleures opportunités et faire valoir leurs compétences.",
      excerpt: "Hommage aux infirmiers algériens et aux défis de leur profession.",
      category: "Personal Stories",
      tags: ["Infirmiers", "Paramédicaux", "Témoignages"],
    },
    {
      title: "Salaires des Médecins en Algérie : Grille 2025",
      content:
        "La question salariale est centrale pour les professionnels de santé en Algérie. Un médecin généraliste dans le secteur public gagne entre 80 000 et 120 000 DA par mois, tandis qu'un spécialiste peut atteindre 150 000 à 200 000 DA. Dans le secteur privé, les rémunérations sont nettement supérieures, pouvant aller de 200 000 DA pour un généraliste à plus de 500 000 DA pour un chirurgien expérimenté. Les primes de garde, d'astreinte et de zone ajoutent un complément non négligeable. La tendance est à la revalorisation progressive des salaires hospitaliers pour freiner l'exode des compétences.",
      excerpt: "Détail des rémunérations médicales en Algérie pour 2025.",
      category: "Career Advice",
      tags: ["Salaires", "Rémunération", "Carrière médicale"],
    },
    {
      title: "Découvertes Récentes en Oncologie : Espoirs pour l'Algérie",
      content:
        "Le cancer reste un défi majeur de santé publique en Algérie, avec environ 50 000 nouveaux cas diagnostiqués chaque année. Les avancées récentes en immunothérapie et en thérapie ciblée offrent de nouveaux espoirs. Le Centre Pierre et Marie Curie (CPMC) d'Alger est à la pointe de la recherche oncologique en Afrique du Nord. Le Plan National Cancer 2025-2030 prévoit la construction de nouveaux centres anti-cancer dans chaque région. Les médecins algériens formés à l'étranger sont encouragés à revenir contribuer à cet effort national grâce à des programmes de réintégration attractifs.",
      excerpt: "Les avancées en oncologie et leur application dans le contexte algérien.",
      category: "Research",
      tags: ["Oncologie", "Cancer", "Recherche médicale"],
    },
    {
      title: "Guide : Ouvrir un Cabinet Médical en Algérie",
      content:
        "Ouvrir un cabinet médical en Algérie nécessite de suivre un processus administratif bien défini. Les étapes clés incluent : l'obtention de l'agrément auprès de la Direction de la Santé de la Wilaya, l'inscription au Conseil de l'Ordre des Médecins, l'enregistrement au Centre National du Registre du Commerce (CNRC), et l'affiliation à la CNAS. Le local doit répondre à des normes d'hygiène et d'accessibilité strictes. Le budget initial varie entre 3 et 10 millions de DA selon la spécialité. Les zones rurales offrent des avantages fiscaux et une demande forte pour attirer les praticiens.",
      excerpt: "Étapes et conseils pour lancer son cabinet médical en Algérie.",
      category: "Career Advice",
      tags: ["Cabinet médical", "Installation", "Guide pratique"],
    },
    {
      title: "La Pharmacie en Algérie : Entre Tradition et Modernité",
      content:
        "Le secteur pharmaceutique algérien est en pleine mutation. Avec la politique de production locale de médicaments, l'Algérie couvre désormais plus de 70% de ses besoins en médicaments génériques. Saidal, le groupe pharmaceutique public, ainsi que des laboratoires privés comme Biopharm et El Kendi, sont des acteurs majeurs. Les pharmaciens jouent un rôle croissant dans la chaîne de santé, avec l'émergence de la pharmacie clinique dans les hôpitaux. Les perspectives de carrière sont excellentes, tant en officine qu'en industrie pharmaceutique, avec un marché estimé à plus de 4 milliards de dollars.",
      excerpt: "Panorama du secteur pharmaceutique algérien et opportunités de carrière.",
      category: "Medical News",
      tags: ["Pharmacie", "Médicaments", "Industrie"],
    },
  ];

  const blogs = blogData.map((b, i) => {
    const author = allAuthors[i % allAuthors.length];
    return {
      ...b,
      author: author.id,
      authorType: author.type,
      isPublished: true,
      viewCount: randBetween(50, 2000),
      createdAt: daysAgo(randBetween(1, 120)),
    };
  });

  const inserted = await Blog.insertMany(blogs);
  console.log(`✅ Seeded ${inserted.length} blog posts`);
  return inserted;
}

// ─── Main ───────────────────────────────────────────────────
async function main() {
  const resetMode = process.argv.includes("--reset");

  try {
    console.log("\n🏥 VitalWork — Algerian Mock Data Seeder\n");
    console.log(`   Mode: ${resetMode ? "🔄 RESET + Seed" : "➕ Additive Seed"}\n`);

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("📡 Connected to MongoDB\n");

    if (resetMode) {
      console.log("🗑️  Clearing existing data...");
      await Promise.all([
        Employer.deleteMany({}),
        JobSeeker.deleteMany({}),
        Job.deleteMany({}),
        Application.deleteMany({}),
        Blog.deleteMany({}),
      ]);
      console.log("   Done.\n");
    }

    // Seed in order (dependencies)
    const employers = await seedEmployers();
    const seekers = await seedJobSeekers();
    const jobs = await seedJobs(employers);
    await seedApplications(jobs, seekers);
    await seedBlogs(employers, seekers);

    console.log("\n─────────────────────────────────────────────");
    console.log("✅ All Algerian mock data seeded successfully!");
    console.log("─────────────────────────────────────────────");
    console.log("\n📋 Login Credentials:");
    console.log(`   Employers:  ${process.env.ADMIN_EMAIL || "employer1@vitalwork.dz"}  → password123  (admin)`);
    console.log("               employer2@vitalwork.dz  → password123");
    console.log("   Seekers:    seeker1@vitalwork.dz    → password123");
    console.log("               seeker2@vitalwork.dz    → password123");
    console.log("               ... up to seeker15@vitalwork.dz\n");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB\n");
  }
}

main();
