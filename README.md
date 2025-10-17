# MedCareer 🏥

A comprehensive medical career platform built with the MERN stack, designed to connect healthcare professionals with medical job opportunities. This application serves as a specialized job board for the medical industry, featuring role-based authentication, job management, and application tracking.

## Try it out !

[![Deploy to Render](https://medcareer.onrender.com/)](https://app.netlify.com/start/deploy?repository=https://github.com/medcareer/medcareer)

## 🌟 Features

### For Job Seekers

- **User Registration & Authentication** - Secure account creation and login
- **Profile Management** - Complete profile with CV upload and profile picture
- **Job Search & Filtering** - Browse medical positions by specialization, location, and job type
- **Application Tracking** - Track application status and history
- **Notifications** - Stay updated on application progress

### For Employers

- **Job Posting** - Create and manage medical job listings
- **Application Management** - Review and manage candidate applications
- **Dashboard Analytics** - Track job posting performance and statistics

### Medical Specializations Supported

- General Practitioner
- Cardiologist
- Dermatologist
- Gastroenterologist
- Neurologist
- Oncologist
- Psychiatrist
- Rheumatologist
- Urologist
- Endocrinologist
- Ophthalmologist
- Orthopedic Specialist
- Pediatrician
- Pulmonologist
- Surgery Specialist
- Vascular Specialist
- Dentist
- Pharmacist
- Pathologist
- And more...

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Image and file storage
- **Multer** - File upload handling
- **Express Validator** - Input validation

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Toastify** - Notifications
- **Recharts** - Data visualization
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animation library

### Development Tools

- **Concurrently** - Run multiple commands
- **Nodemon** - Development server auto-restart
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abdelkouddous/MedCareer.git
   cd MedCareer
   ```

2. **Install dependencies for both server and client**

   ```bash
   npm run setup-project
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=5100
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Backend server on `http://localhost:5100`
   - Frontend development server on `http://localhost:5173`

### Production Build

```bash
npm run setup-production-app
npm start
```

## 📁 Project Structure

```
MedCareer/
├── /                    # Backend code
├── client/              # Frontend code
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── README.md            # Project documentation
├── package.json         # Project metadata
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.js       # Vite configuration
└── ...
```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
