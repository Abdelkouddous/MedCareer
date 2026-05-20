# VitalWork - Requirements

## 1. Project Context

VitalWork is a recruitment platform created exclusively for healthcare professionals. The application is designed to connect medical job seekers with healthcare employers and recruiters in hospitals, clinics, medical centers, and specialized care facilities.

The platform must remain strictly focused on healthcare recruitment, with no general job board features. All functionality should support the hiring lifecycle for doctors, nurses, allied health professionals, and other clinical staff.

## 2. Client and Stakeholder

- **Primary client:** Healthcare recruitment manager / clinic HR lead
- **Target users:** Medical professionals, healthcare employers, recruiters, and platform administrators
- **Client objective:** provide a secure, specialized hiring environment for healthcare staffing, with fast candidate matching and efficient employer workflows.

## 3. Business Requirements

### 3.1 Core client needs

- Recruit only healthcare professionals, including doctors, nurses, therapists, pharmacists, and clinical support staff.
- Provide a streamlined candidate experience for healthcare job seekers.
- Enable employers to post roles with medical specializations, certifications, and shift requirements.
- Maintain a secure system for sensitive candidate and employer data.
- Support clear negotiation and validation of candidate applications.

### 3.2 Detailed requirements

- **Healthcare-only job board:** only medical professions, clinical roles, and allied health positions.
- **Role-based access:** separate tracks for job seekers, recruiters, and healthcare employers.
- **Advanced job posting:** include department, specialty, license requirements, shift type, and contract details.
- **Candidate profiles:** professional biography, medical credentials, experience, certifications, CV uploads, and availability.
- **Smart matching:** match candidates to roles based on specialization, experience, location, and schedule.
- **Application workflow:** allow candidates to apply, employers to review, comment, and decide within one system.
- **Notifications:** email alerts for new matches, application updates, interview invitations, and offer status.
- **Reporting:** provide employer metrics for applications received, time-to-fill, and candidate pipeline status.

## 4. Negotiations and Client Agreements

### 4.1 Prioritized scope

- **High priority:** job posting, candidate profiles, application management, employer review workflow.
- **Medium priority:** smart role matching, notification automation, application status tracking.
- **Lower priority:** multi-language support, third-party sourcing integrations, advanced analytics.

### 4.2 Client decisions

- The MVP must focus on healthcare recruitment workflows, not general staffing or clinic operations.
- Candidate messaging and interview scheduling can be limited in the first release, with richer features added later.
- SMS notifications are optional for a later phase; email notifications are sufficient for MVP.

### 4.3 Agreed constraints

- The platform will target medical professions only, with strict taxonomy and job categories limited to healthcare roles.
- Candidate and employer data confidentiality is required, but document management may be handled through a secure external storage provider.
- Real-time chat is deferred; application status updates are handled through platform notifications and emails.

## 5. Functional Scope

- Employer onboarding and role creation
- Candidate registration and profile management
- Job search with healthcare specialization filters
- Application submission and progress tracking
- Employer review, shortlisting, and hiring decisions
- Notification management for candidates and employers
- Dashboard views for application pipeline and job performance

## 6. Architecture Overview

- **Frontend:** React with Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT
- **File storage:** Cloudinary (for CVs and certifications)
- **Uploads:** Multer

## 7. Development Roadmap

### Phase 1: Core recruitment MVP

- Job postings for healthcare roles
- Candidate profiles and CV upload
- Application flow and employer review
- Basic notifications and dashboard metrics

### Phase 2: Matching and workflow improvements

- Smart candidate-job matching
- Application status tracking and employer notes
- Enhanced search filters and saved searches

### Phase 3: Growth and optimization

- Employer reporting and analytics
- Additional notification channels
- Security hardening and performance improvements

## 8. Annexes

- The current PDF version is available as `Cahier_de_charge.pdf`.
- This Markdown version is the primary recruitment requirements document.
