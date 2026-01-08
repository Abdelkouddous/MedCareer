import Wrapper from "../assets/wrappers/Dashboard";

const Terms = () => {
  return (
    <Wrapper className="min-h-screen bg-[var(--background-color)]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-8">
          Terms of Service
        </h1>
        
        <div className="bg-[var(--background-secondary-color)] p-8 rounded-lg shadow-sm space-y-6 text-[var(--text-secondary-color)]">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
              Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">3. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of MedCareer Connect and its licensors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">4. Job Postings and Applications</h2>
            <p>
              Employers are solely responsible for their job postings. We do not guarantee the accuracy of any job posting or the validity of any job offer.
              Job Seekers are responsible for the information provided in their applications and CVs.
            </p>
          </section>

           <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-3">6. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

export default Terms;
