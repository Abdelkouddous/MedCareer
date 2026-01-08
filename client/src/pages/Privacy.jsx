import Wrapper from "../assets/wrappers/Dashboard";

const Privacy = () => {
  return (
    <Wrapper className="min-h-screen bg-[var(--background-color)]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-8">
          Privacy Policy
        </h1>
        
        <div className="bg-[var(--background-secondary-color)] p-8 rounded-lg shadow-sm space-y-6 text-[var(--text-secondary-color)]">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">1. Introduction</h2>
            <p>
              Welcome to MedCareer Connect. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">2. Data We Collect</h2>
            <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Professional Data:</strong> includes CV, qualifications, and employment history.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To register you as a new user.</li>
              <li>To process your job applications.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">5. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at: {' '}
              <a href="mailto:hml_soft@medcareer.com" className="text-[var(--primary-500)] hover:underline">
                hml_soft@medcareer.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

export default Privacy;
