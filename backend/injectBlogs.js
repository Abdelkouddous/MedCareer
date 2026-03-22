import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Blog from "./models/BlogModel.js";
import Employer from "./models/EmployerModel.js";

const mockBlogs = [
  {
    title: "The Future of Telemedicine in Healthcare",
    content: `Telemedicine has revolutionized the way healthcare is delivered, especially in the wake of the global pandemic. This innovative approach to medical care has opened up new possibilities for both healthcare providers and patients.

**Key Benefits of Telemedicine:**
- **Accessibility**: Patients in remote areas can now access quality healthcare without traveling long distances.
- **Convenience**: Virtual consultations save time for both doctors and patients.
- **Cost-Effective**: Reduces healthcare costs by eliminating travel expenses and reducing hospital visits.
- **Safety**: Minimizes exposure to infectious diseases by reducing in-person contact.

**Technology Integration:**
Modern telemedicine platforms incorporate advanced features such as:
- High-definition video conferencing
- Digital health monitoring devices
- AI-powered diagnostic tools
- Electronic health record integration

**Challenges and Solutions:**
While telemedicine offers numerous advantages, it also presents challenges:
- Digital divide affecting some patient populations
- Regulatory compliance across different jurisdictions
- Data privacy and security concerns
- Technical difficulties for some users

**The Road Ahead:**
As technology continues to advance, we can expect telemedicine to become even more sophisticated. The integration of artificial intelligence, machine learning, and IoT devices will further enhance the quality of remote healthcare delivery.

Healthcare professionals should embrace this digital transformation while maintaining the human touch that makes medicine both an art and a science.`,
    excerpt:
      "Explore how telemedicine is transforming healthcare delivery and what the future holds for remote medical care.",
    category: "Technology",
    tags: [
      "telemedicine",
      "healthcare",
      "technology",
      "digital health",
      "remote care",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    isPublished: true,
    viewCount: 1250,
  },
  {
    title:
      "Building a Successful Medical Career: Essential Tips for New Graduates",
    content: `Starting a medical career can be both exciting and overwhelming. As a new graduate, you're about to embark on a journey that will impact countless lives. Here are essential tips to help you build a successful medical career.

**1. Choose Your Specialty Wisely:**
- Research different medical specialties thoroughly
- Consider your interests, lifestyle preferences, and long-term goals
- Seek mentorship from experienced physicians in your areas of interest
- Remember that changing specialties is possible but requires additional training

**2. Develop Strong Clinical Skills:**
- Focus on mastering the fundamentals of patient care
- Practice effective communication with patients and families
- Learn to work efficiently while maintaining quality care
- Stay updated with the latest medical guidelines and protocols

**3. Build Professional Relationships:**
- Network with colleagues, mentors, and other healthcare professionals
- Join professional organizations relevant to your specialty
- Attend conferences and continuing education events
- Maintain positive relationships with nursing staff and support personnel

**4. Prioritize Work-Life Balance:**
- Medicine can be demanding, but burnout is preventable
- Set boundaries between work and personal life
- Find hobbies and activities outside of medicine
- Don't hesitate to seek help when needed

**5. Continuous Learning:**
- Medicine is constantly evolving
- Stay current with medical literature and research
- Consider pursuing additional certifications or fellowships
- Embrace new technologies and treatment modalities

**6. Financial Planning:**
- Understand your student loan repayment options
- Consider disability and life insurance
- Plan for retirement early in your career
- Seek advice from financial advisors familiar with physician finances

**7. Professional Development:**
- Consider academic medicine vs. private practice
- Explore opportunities for teaching and research
- Build a reputation for excellence in your field
- Consider leadership roles within your organization

Remember, building a successful medical career is a marathon, not a sprint. Take time to enjoy the journey while making a positive impact on the lives of your patients.`,
    excerpt:
      "Essential guidance for medical graduates starting their careers, covering specialty selection, skill development, and professional growth.",
    category: "Career Advice",
    tags: [
      "medical career",
      "new graduates",
      "career development",
      "medicine",
      "professional growth",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    isPublished: true,
    viewCount: 2100,
  },
  {
    title: "Mental Health Awareness in the Medical Profession",
    content: `The medical profession, while rewarding, can be incredibly demanding and stressful. Mental health awareness among healthcare professionals is crucial for both personal well-being and patient care quality.

**Understanding the Challenges:**
Healthcare professionals face unique stressors:
- Long working hours and irregular schedules
- High-stakes decision making
- Emotional burden of patient suffering
- Administrative burdens and paperwork
- Fear of medical errors and malpractice

**Signs of Burnout and Mental Health Issues:**
- Emotional exhaustion and fatigue
- Depersonalization or cynicism toward patients
- Reduced sense of personal accomplishment
- Sleep disturbances and appetite changes
- Increased irritability or mood swings
- Difficulty concentrating or making decisions

**Strategies for Mental Health Wellness:**

**1. Self-Care Practices:**
- Maintain regular exercise routines
- Practice mindfulness and meditation
- Ensure adequate sleep and nutrition
- Engage in hobbies and recreational activities
- Take regular vacations and breaks

**2. Professional Support:**
- Seek therapy or counseling when needed
- Join peer support groups for healthcare workers
- Utilize employee assistance programs
- Consider executive coaching for leadership roles
- Don't hesitate to seek psychiatric care if necessary

**3. Workplace Initiatives:**
- Advocate for reasonable work schedules
- Promote team-based care to share responsibilities
- Implement wellness programs in your organization
- Encourage open discussions about mental health
- Support colleagues who may be struggling

**4. Building Resilience:**
- Develop strong coping mechanisms
- Practice stress management techniques
- Maintain perspective on work-life balance
- Cultivate gratitude and positive thinking
- Learn to say no when appropriate

**Breaking the Stigma:**
It's important to remember that seeking help for mental health issues is a sign of strength, not weakness. The medical community must work together to:
- Normalize mental health discussions
- Provide resources and support systems
- Create safe spaces for vulnerable conversations
- Lead by example in prioritizing mental wellness

**Resources for Help:**
- National Suicide Prevention Lifeline: 988
- Physician Support Line: 1-888-409-0141
- National Alliance on Mental Illness (NAMI)
- Local medical society wellness programs

Remember, taking care of your mental health is not just important for you—it's essential for providing the best possible care to your patients. A healthy physician is a more effective physician.`,
    excerpt:
      "Exploring the importance of mental health awareness in the medical profession and strategies for maintaining wellness in healthcare careers.",
    category: "Personal Stories",
    tags: [
      "mental health",
      "physician wellness",
      "burnout",
      "healthcare professionals",
      "self-care",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    isPublished: true,
    viewCount: 1850,
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
};

const injectBlogs = async () => {
  try {
    await connectDB();

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("Cleared existing blogs");

    // Get an admin user to be the author
    let adminUser = await Employer.findOne({ role: "admin" });

    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = await Employer.create({
        name: "Admin",
        lastName: "User",
        email: "admin@medcareer.com",
        password: "admin123",
        role: "admin",
        specialty: "General Practitioner",
        isConfirmed: true,
      });
      console.log("Created default admin user");
    }

    // Add admin user ID and author type to each blog
    const blogsWithAuthor = mockBlogs.map((blog) => ({
      ...blog,
      author: adminUser._id,
      authorType: "Employer",
    }));

    // Insert mock blogs
    const createdBlogs = await Blog.insertMany(blogsWithAuthor);
    console.log(`Successfully injected ${createdBlogs.length} blogs`);

    // Log the created blogs
    createdBlogs.forEach((blog) => {
      console.log(`- ${blog.title} (${blog.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error injecting blogs:", error);
    process.exit(1);
  }
};

injectBlogs();
