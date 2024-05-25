import React from 'react';
import Footer from '../components/Footer';
import sparkLogo from "../assets/logo.png";

const PrivacyPolicy = () => {
  return (
    <div className="overflow-hidden">
    <div className="min-h-screen bg-gray-100 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/10 h-full bg-gradient-to-r from-blue-200 to-transparent"></div>
      <header className="w-full py-4 relative z-10" style={{ background: 'linear-gradient(90deg, white, #cfe9ff)' }}>
        <div className="container mx-auto flex items-center py-4 px-4">
            <img src={sparkLogo} alt="spark logo" className="w-[158px]" />
          <h1 className="text-3xl font-semibold text-blue-700 text-center absolute w-full top-12">Privacy Policy</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 bg-white bg-opacity-70 shadow-md mt-[-1%] rounded-lg max-w-4xl relative z-10 backdrop-filter backdrop-blur-lg border border-gray-200">
        <section>
          <h2 className="text-2xl font-bold mb-4">Privacy Policy of Spark IQ</h2>
          <p className="mb-6">
            We at Spark IQ understand the importance of safeguarding your personal information. This Privacy Policy outlines how we collect, use, and protect your personal data. By accessing or using Spark IQ's website ("Website") or any of its related products and services (collectively, "Services"), you agree to the terms of this Privacy Policy.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Scope of the Privacy Policy</h2>
          <p className="mb-6">
            This Privacy Policy covers the treatment of personally identifiable information ("Personal Data") collected by Spark IQ during your use of our Services. We may collect and process only the minimal amount of user data necessary to maintain and improve our Website and Services. Your use of our Services constitutes acceptance of this Privacy Policy.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Changes to the Privacy Policy</h2>
          <p className="mb-6">
            This Privacy Policy covers the treatment of personally identifiable information ("Personal Data") collected by Spark IQ during your use of our Services. We may collect and process only the minimal amount of user data necessary to maintain and improve our Website and Services. Your use of our Services constitutes acceptance of this Privacy Policy.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Information Collection</h2>
          <h3 className="text-xl font-semibold mb-2">Information You Have Provided Us:</h3>
          <p className="mb-6">
            We collect any information you knowingly provide to us, such as your name, email address, phone number, and third-party account credentials (e.g., Facebook account ID) during the registration process or through your account settings. If you provide third-party account credentials, certain information from those accounts may be transmitted to Spark IQ's Services. We may use this information to personalize and improve your experience with Spark IQ. We may communicate with you via email for promotional offers or service-related announcements, and we may track email interactions to improve our services.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Information Collected Automatically:</h3>
          <p className="mb-6">
            When you interact with our Services, we automatically receive and record information such as your IP address, device identification, browser type, and cookies. Cookies are identifiers that allow us to recognize your browser and customize content based on your usage patterns. You can adjust your browser settings to limit cookie acceptance, but this may affect certain features of our Services.
            We may use this automatically collected data to customize content, improve our Services, and analyze usage patterns.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Use of Personal Information</h3>
          <p className="mb-6">
            We may use the Personal Information we collect to:
            <ul className="list-disc list-inside mb-6">
              <li>Create and manage your account, process payments, and respond to inquiries.</li>
              <li>Communicate with you for verification, account management, and customer service purposes.</li>
              <li>Tailor our Services and provide personalized advertising.</li>
              <li>Aggregate Personal Information for analytical purposes.</li>
              <li>Provide customer support and improve our business operations.</li>
              <li>Send marketing communications about Spark IQ products and offers.</li>
              <li>Ensure the security of our Services and enforce our legal rights.</li>
              <li>Comply with applicable legal requirements and industry standards.</li>
            </ul>
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Security of Personal Information</h3>
          <p className="mb-6">
            We store and secure your information on controlled servers, protected from unauthorized access, use, or disclosure. While we maintain reasonable safeguards to protect your data, no method of transmission over the internet or wireless network is completely secure. You acknowledge that internet security limitations exist and that your information may be viewed or tampered with by third parties despite our efforts.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Google API Disclosure</h3>
          <p className="mb-6">
            Spark IQ offers functionality that allows users to connect their Gmail accounts using OAuth. By connecting your Gmail account, Spark IQ may access and associate your account with personal information on Google. We adhere to Google API Services User Data Policy's requirements, including limited use of the information received from Google APIs.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Changes and Amendments</h3>
          <p className="mb-6">
            We reserve the right to modify this Privacy Policy at our discretion and will notify you of any material changes. Your continued use of our Services after such changes constitutes acceptance of the updated Privacy Policy.
          </p>
        </section>
      </main>
      </div>
               <Footer />
      </div>
  );
};

export default PrivacyPolicy;
