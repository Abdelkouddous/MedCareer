// Test data fixtures for consistent testing
export const testUsers = {
  admin: {
    name: "Admin User",
    email: "admin@medcareer.com",
    password: "password123",
    role: "admin",
    lastName: "Admin",
    location: "Algeria",
    specialty: "General Practitioner",
  },
  employer: {
    name: "Dr. Smith",
    email: "employer@medcareer.com",
    password: "password123",
    role: "user",
    lastName: "Smith",
    location: "Algeria",
    specialty: "Cardiologist",
  },
  jobSeeker: {
    name: "Dr. Johnson",
    email: "jobseeker@medcareer.com",
    password: "password123",
    lastName: "Johnson",
    location: "Algeria",
    specialty: "Pediatrician",
    experience: "5 years",
    education: "MD",
    skills: ["Pediatrics", "Emergency Medicine"],
  },
};

export const testJobs = {
  cardiologist: {
    position: "Senior Cardiologist",
    company: "Heart Hospital",
    jobLocation: "Algiers, Algeria",
    jobType: "full-time",
    status: "pending",
    description: "Looking for an experienced cardiologist to join our team.",
    requirements: [
      "MD degree",
      "5+ years experience",
      "Cardiology specialization",
    ],
    salary: "150000-200000 DZD",
  },
  pediatrician: {
    position: "Pediatrician",
    company: "Children Hospital",
    jobLocation: "Oran, Algeria",
    jobType: "full-time",
    status: "pending",
    description:
      "Join our pediatric team to provide excellent care for children.",
    requirements: [
      "MD degree",
      "Pediatrics specialization",
      "3+ years experience",
    ],
    salary: "120000-150000 DZD",
  },
};

export const testApplications = {
  pending: {
    jobId: "test-job-id",
    jobSeekerId: "test-jobseeker-id",
    status: "pending",
    coverLetter: "I am very interested in this position...",
    resume: "resume.pdf",
  },
};

