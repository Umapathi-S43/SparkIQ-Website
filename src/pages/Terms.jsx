import React from 'react';
import Footer from '../components/Footer';
import sparkLogo from "../assets/logo.png";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="overflow-hidden">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/10 h-full bg-gradient-to-r from-blue-200 to-transparent"></div>
        <header className="w-full py-4 relative z-10" style={{ background: 'linear-gradient(90deg, white, #cfe9ff)' }}>
          <div className="container mx-auto flex items-center justify-center flex-col sm:flex-row py-4 px-4">
          <Link to="/"> 
            <img src={sparkLogo} alt="spark logo" className="w-[158px] mb-4 sm:mb-0 sm:mr-4" />
            </Link>
            <h1 className="text-3xl font-semibold text-blue-700 text-center">Terms of Service</h1>
          </div>
        </header>
        <main className="container mx-auto p-6 lg:mt-4 sm:p-12 bg-white bg-opacity-70 shadow-md mt-[-1%] rounded-lg max-w-4xl relative z-10 backdrop-filter backdrop-blur-lg border border-gray-200 mb-12 text-justify">
          <section>
            <h2 className="text-2xl font-bold mb-4">SPARK IQ'S PROMISE</h2>
            <p className="mb-6">
              We are dedicated to providing you with an exceptional experience through Spark IQ. Our commitment is based on the belief that artificial intelligence is not just a buzzword—it is a powerful reality shaping the future of every industry. In advertising, AI is often misused to make false promises. Spark IQ represents the next generation of ad technology, and we are devoted to enhancing its performance to help you achieve optimal conversion rates.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">SPARK IQ TERMS OF SERVICE</h2>
            <p className="mb-6">
              These General Terms, along with the Acceptable Use Rules and Payment Terms (collectively, the “Spark IQ Terms”), govern your access to and use of any websites, products, or services (collectively, “Services”) offered by Spark IQ (“SPARK IQ” or “we”).
            </p>
            <p className="mb-6">
              OUR SERVICES ARE INTENDED ONLY FOR BUSINESS AND PROFESSIONAL USERS, NOT FOR CONSUMERS OR PRIVATE OR HOUSEHOLD PURPOSES. YOU MUST NOT ACCESS OR USE OUR SERVICES UNLESS (A) YOU ARE ACTING IN A BUSINESS OR PROFESSIONAL CAPACITY, (B) YOU ACCEPT THE SPARK IQ TERMS ON BEHALF OF YOURSELF AND, IF APPLICABLE, YOUR ORGANIZATION, AND (C) IF YOU ARE ACTING ON BEHALF OF YOUR ORGANIZATION, YOU ARE AUTHORIZED TO DO SO. BY ACCESSING OR USING OUR SERVICES, YOU AGREE THAT THE SPARK IQ TERMS FORM A LEGALLY BINDING CONTRACT BETWEEN YOU AND, IF APPLICABLE, YOUR ORGANIZATION (COLLECTIVELY REFERRED TO AS “YOU” HEREINAFTER) AND SPARK IQ. ARBITRATION NOTICE AND CLASS ACTION WAIVER: EXCEPT FOR CERTAIN TYPES OF DISPUTES DESCRIBED IN SECTION 12 BELOW OR WHERE PROHIBITED BY APPLICABLE LAW, YOU AGREE THAT DISPUTES BETWEEN YOU AND SPARK IQ WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Acceptable Use Policy</h3>
            <p className="mb-6">
              YOU MUST:
            </p>
            <ul className="list-disc list-inside mb-6">
              <li>Ensure that you and your Authorized Users comply with all applicable Spark IQ Terms.</li>
              <li>Upload and share only accurate and lawful ad content, for which you control or own all necessary rights.</li>
              <li>Use commercially reasonable efforts to prevent unauthorized access to or use of the Services.</li>
              <li>Keep your login information confidential.</li>
              <li>Monitor and control all activity conducted through your account in connection with the Services.</li>
              <li>Promptly notify us if you become aware of or reasonably suspect any security breach, including any loss, theft, or unauthorized disclosure or use of your (or any of your Authorized Users’) information.</li>
              <li>Comply with all applicable terms of any third-party services that you access or subscribe to in connection with the Services, including the applicable third-party terms.</li>
            </ul>
            <p className="mb-6">
              YOU MUST NOT:
            </p>
            <ul className="list-disc list-inside mb-6">
              <li>Make the Services available to anyone other than your Authorized Users.</li>
              <li>Permit any third party to access or use your (or any of your Authorized Users’) login information or account for the Services.</li>
              <li>Use our Services to process non-publicly available information or any sensitive personal data.</li>
              <li>Sell, trade, or otherwise transfer your account to another party.</li>
              <li>Use the Services to store or transmit any content, including ad content, that may be infringing, defamatory, threatening, harmful, or otherwise tortious or unlawful, including any content that may violate intellectual property, privacy, publicity rights, or other laws, or send spam or other unsolicited messages in violation of applicable law.</li>
              <li>Upload to, or transmit from, the Services any data, file, software, or link that contains or redirects to a virus, Trojan horse, worm, or other harmful components.</li>
              <li>Attempt to reverse engineer, decompile, hack, disable, interfere with, disassemble, modify, copy, translate, or disrupt the features, functionality, integrity, or performance of the Services or those of third-party services (including any mechanism used to restrict or control functionalities), or any third-party data contained therein (except to the extent such restrictions are prohibited by applicable law).</li>
              <li>Attempt to gain unauthorized access to the Services, the third-party services, or related systems or networks, or to defeat, avoid, bypass, remove, deactivate, or otherwise circumvent any software protection or monitoring mechanisms of the Services or the third-party services.</li>
              <li>Access the Services to build a similar or competitive product or service or copy any ideas, features, functions, or graphics of the Services or the third-party services.</li>
              <li>Engage in abusive practices, or use the Services for redistribution, syndication, or deceitful activities.</li>
              <li>Authorize, permit, or encourage any third party to do any of the above.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Your Rights and Obligations</h3>
            <p className="mb-6">
              Access to Services: We grant you a non-exclusive, non-transferable, revocable, limited, personal right to access our Services. 
            </p>
            <p className="mb-6">
              We do not authorize any other use or access, including by robots, spiders, crawlers, or scraping technologies. You are responsible for setting your own username and password (“Login Information”) and should not allow any third party to access or use your Login Information. You are responsible for all individuals that access the Services through your Login Information (“Authorized Users”). You and your Authorized Users may use the Services only for your own business purposes, not to build a similar or competitive product or service or copy any ideas, features, functions, or graphics of the Services.
            </p>
            <p className="mb-6">
              Facebook or Google Ads Account: We provide you with a technical application that allows you to publish and manage ads on Facebook and Google Ads. Therefore, to use our Services, you must be a registered user of Facebook or AdWords and have an advertising account with Facebook or AdWords.
            </p>
            <p className="mb-6">
              Ads Content: You are solely responsible for all ad content that you or your Authorized Users upload, publish, display, link to, or otherwise make available via the Services. We have the right but no obligation to review, filter, block, or remove any ad content that you publish or make available via our Services. UNDER NO CIRCUMSTANCES WILL WE BE LIABLE IN ANY WAY FOR ADS CONTENT POSTED ON OR MADE AVAILABLE THROUGH OUR SERVICES BY YOU OR ANY OTHER THIRD PARTY. “Ads Content” includes all information, text, images, photos, videos, audio, documents, and other content in any media and format which is provided or made available to us in connection with your use of the Services.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Third Party Content and Services</h3>
            <p className="mb-6">
              We are not responsible for any services provided by Facebook, Google Ads (the “Advertising Platforms”), or for any other services, information, or content accessed or purchased through Spark IQ, which you may be able to access, use, or connect to with our Services (together, the “Third-Party Services”). If you access a Third-Party Service through us, you do so at your own risk. When accessing Facebook or Google Ads services, you are responsible for complying with all of their terms, conditions, policies, and guidelines, including those published at:
            </p>
            <ul className="list-disc list-inside mb-6">
              <li>Facebook Terms</li>
              <li>Facebook Ads Policies</li>
              <li>Google Ads Policies</li>
              <li>Google Ad Content Policy</li>
            </ul>
            <p className="mb-6">
              You remain responsible for the payment of the ads purchased through our Services directly to the Advertising Platforms. You understand that we have the right but no obligation to preview, verify, or modify ad content and that you must bear all risks associated with the publishing of ads on the Advertising Platforms. You also agree that Services interoperate with Advertising Platforms, and that our Services are highly dependent on the availability of the Advertising Platforms. If at any time the Advertising Platforms cease to make their features or programs available to us on reasonable terms, we may cease to provide access to such features or programs to you. We assume no responsibility or liability related to ad content or to any ad content not being transferred to or published on the Advertising Platforms as a result of a malfunction in our Services.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Confidentiality and Data Protection</h3>
            <p className="mb-6">
              Confidentiality: If we share non-public information about our Services with you, you must keep it confidential and use reasonable security measures to prevent disclosure or access by unauthorized persons.
            </p>
            <p className="mb-6">
              Personal Data: We will not use or control any of the personal data that you process with our Services. We merely offer you tools with which you can process data. You must comply with all applicable data privacy and data protection laws.
            </p>
            <p className="mb-6">
              Data Retention: We will keep the information until the customer requests its deletion from our records. To initiate this process, please send an email to support@SparkIQ to start the process of deletion.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Intellectual Property</h3>
            <p className="mb-6">
              Ads Content: You retain all rights, title, and interest to your ads content which you may upload to or with our Services. We will not use your ads content except for the purposes of providing, supporting, and improving our Services and in full compliance with all Spark IQ terms.
            </p>
            <p className="mb-6">
              Feedback: You may from time to time provide suggestions, comments, or other feedback to Spark IQ with respect to the Services (“Feedback”). Feedback, even if designated as confidential by you, shall not create any confidentiality obligation for us. Notwithstanding the foregoing, we will not disclose to any third party that you are the source of any Feedback. You hereby grant us a non-exclusive, worldwide, perpetual, irrevocable, transferable, sub-licensable, royalty-free, fully paid-up license to use and exploit the Feedback for any purpose.
            </p>
            <p className="mb-6">
              Services: We retain all rights, title, and interest in and to the Services. Charges and Payment Terms
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Charges and Payment Terms</h3>
            <p className="mb-6">
              You must timely pay all applicable fees based on our payment terms. You remain responsible at all times for the direct payment of the ads purchased through our Services to the Advertising Platforms.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Cancellation</h3>
            <p className="mb-6">
              Cancellation stops the auto-renewal of your subscription. Subscriptions are active until the end of the billing cycle. For instance, if you have paid for an annual subscription, it is active until the end of those 12 months. Cancellation does not delete your account, and you can re-subscribe at any time. Please note all subscriptions are auto-renewed unless explicitly canceled.
            </p>
            <p className="mb-6">
              Termination for Cause: We may both terminate the Spark IQ Terms, effective immediately, if the other party commits a material breach of the Spark IQ Terms and fails to remedy such breach within thirty (30) days of receiving a written request to cure. Additionally, we may suspend or terminate your access to the Services if you violate any Acceptable Use Policy or use the Services in a way that creates risk or possible legal exposure to us, other customers, or others. If you terminate the Spark IQ Terms for cause, we will refund any prepaid fees as of the termination date.
            </p>
            <p className="mb-6">
              Effects of Termination: Upon cancellation or termination of the Services by either party for any reason: (i) we will cease providing you Services and you will no longer be able to access your account; (ii) unless otherwise provided in these Spark IQ Terms, you will not be entitled to any refunds, and you shall pay us all unpaid amounts owing. All provisions of the Spark IQ Terms that by their nature are intended to survive, including but not limited to any disclaimer of warranty and limitation of liability provisions, shall survive the termination or expiry of the Spark IQ Terms.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Warranty Disclaimer</h3>
            <p className="mb-6">
              WE OFFER THE SERVICES “AS IS,” WITHOUT ANY EXPRESS WARRANTIES, REPRESENTATIONS, GUARANTEES, OR CONDITIONS UNLESS WE EXPRESSLY AGREE TO A LIMITED WARRANTY.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Disclaimers</h3>
            <p className="mb-6">
              YOU USE ALL SERVICES AT YOUR OWN RISK. TO THE GREATEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ANY WARRANTIES, REPRESENTATIONS, GUARANTEES, AND CONDITIONS OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, WE SPECIFICALLY DISCLAIM ALL EXPRESS OR IMPLIED WARRANTIES OF DESIGN, MERCHANTABILITY, FITNESS. FOR A PARTICULAR PURPOSE, TITLE, QUALITY, AND NON-INFRINGEMENT, THAT THE SERVICES WILL MEET YOUR REQUIREMENTS, OR THAT OUR SERVICES WILL ALWAYS BE AVAILABLE, ACCESSIBLE, UNINTERRUPTED, TIMELY, SECURE, ACCURATE, COMPLETE, OR ERROR-FREE. IN ADDITION, WE DISCLAIM ANY RESPONSIBILITY FOR ANY THIRD-PARTY SERVICES (INCLUDING FACEBOOK OR ADWORDS) OR ACTIVITIES, ANY CONNECTION TO OR TRANSMISSION FROM THE INTERNET, OR ADVERTISING PLATFORMS, ANY HACKING, TAMPERING, OR OTHER UNAUTHORIZED ACCESS OR USE OF THE SERVICES OR YOUR ACCOUNT OR THE INFORMATION CONTAINED THEREIN (INCLUDING ADS CONTENT).  
              NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM US OR ELSEWHERE WILL CREATE ANY WARRANTY OR CONDITION NOT EXPRESSLY STATED IN THESE SPARK IQ TERMS. THESE LIMITATIONS SHALL APPLY NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY PROVIDED HEREIN
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Sole Remedy</h3>
            <p className="mb-6">
              IF YOU ARE DISSATISFIED WITH OUR SERVICES OR HARMED BY US OR BY ANYTHING RELATED TO OUR SERVICES, YOU MAY TERMINATE THE SPARK IQ TERMS IN ACCORDANCE WITH OUR CANCELLATION SECTION.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Indemnification</h3>
            <p className="mb-6">
              You shall defend, indemnify, and hold harmless Spark IQ, and our affiliates, directors, officers, employees, and agents from and against all claims, losses, damages, penalties, liability, and costs, including reasonable attorneys’ fees, of any kind or nature that are in connection with or arising out of a claim (a) alleging that your ads content infringes or violates the intellectual property rights, privacy rights, or other rights of a third party or violates any applicable law; (b) relating to, or arising from, ads content or your breach of any Spark IQ Terms or (c) relating to, or arising from, your use of any third-party services (including your breach of the third-party terms).
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Limitations of Liability</h3>
            <p className="mb-6">
              CAP: OUR AGGREGATE LIABILITY TO YOU FOR ANY AND ALL CLAIMS OF ANY KIND SHALL NOT EXCEED THE GREATER OF (A) THE FEES WE RECEIVED FROM YOU FOR THE SERVICES SUBJECT TO THE CLAIM DURING THE THREE (3) MONTH PERIOD IMMEDIATELY PRECEDING THE DATE ON WHICH THE CAUSE OF ACTION AROSE AND (B) USD $500.
            </p>
            <p className="mb-6">
              EXCLUSION: WE SHALL NOT BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, OR DATA OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM THE USE OF, OR INABILITY TO USE, THE SERVICES OR ANY OTHER ASPECT OF THE SPARK IQ TERMS. UNDER NO CIRCUMSTANCES WILL WE BE RESPONSIBLE FOR ANY DAMAGE, LOSS, OR INJURY RESULTING FROM HACKING, TAMPERING, OR OTHER UNAUTHORIZED ACCESS OR USE OF THE SERVICES OR YOUR ACCOUNT OR THE INFORMATION CONTAINED THEREIN.
            </p>
            <p className="mb-6">
              SCOPE: THE LIMITATIONS OF LIABILITY SET FORTH IN THIS SECTION 11 SHALL (A) ALSO BENEFIT OUR AFFILIATED COMPANIES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, LICENSORS, AND SERVICE PROVIDERS, (B) APPLY TO ANY CLAIMS BROUGHT BASED ON ANY CAUSE OF ACTION, INCLUDING BREACH OF CONTRACT, TORT, STATUTE, OR OTHER LEGAL THEORY, AND (C) NOT APPLY IF YOU CAN PROVE THAT: (I) OUR NEGLIGENCE CAUSED DEATH OR PHYSICAL INJURY; (II) WE CAUSED DAMAGES INTENTIONALLY OR WITH WILLFUL MISCONDUCT; OR (III) APPLICABLE LAW DOES NOT ALLOW A LIMITATION AS CONTEMPLATED IN THE SPARK IQ TERMS (IN WHICH CASE THE LIMITATIONS OF LIABILITY IN THE SPARK IQ TERMS SHALL BE REDUCED TO THE MAXIMUM LIMITATION THAT IS VALID AND ENFORCEABLE UNDER APPLICABLE LAW).
            </p>
            <p className="mb-6">
              BASIS OF BARGAIN: THE PARTIES ACKNOWLEDGE AND AGREE THAT THE ESSENTIAL PURPOSE OF THIS SECTION 11 IS TO ALLOCATE THE RISKS UNDER THESE SPARK IQ TERMS BETWEEN THE PARTIES AND LIMIT SPARK IQ’S POTENTIAL LIABILITY IN APPROPRIATE RELATION TO THE FEES CHARGED UNDER THE SPARK IQ TERMS, WHICH WOULD HAVE BEEN SUBSTANTIALLY HIGHER IF WE WERE TO ASSUME ANY FURTHER LIABILITY OTHER THAN AS SET FORTH HEREIN. THE PARTIES HAVE RELIED ON THESE LIMITATIONS IN DETERMINING WHETHER TO ENTER INTO THESE SPARK IQ TERMS.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Governing Law, Arbitration, Class Action Waiver</h3>
            <p className="mb-6">
              Choice of Law: These Spark IQ Terms and any dispute arising out of or in connection with these Spark IQ Terms or Services (“Dispute”) will be governed as to all matters, including, but not limited to the validity, construction, and performance of these Spark IQ Terms, by and under the laws of the State of Delaware, without giving effect to conflicts of law principles thereof.
            </p>
            <p className="mb-6">
              Injunctive Relief: Either party may, at its sole discretion, seek injunctive relief in any court of competent jurisdiction (including, but not limited to, preliminary injunctive relief). Also, the provisions of this Section 12.3 may be enforced by any court of competent jurisdiction.
            </p>
            <p className="mb-6">
              Binding Arbitration: All Disputes shall be finally resolved by binding arbitration before three (3) arbitrators pursuant to the rules (“Rules”) and under the auspices of the American Arbitration Association. In accordance with the Rules, each party shall select one arbitrator, and the two arbitrators so selected shall select the third arbitrator. The arbitrators shall be knowledgeable in the chosen law and the online advertising industry. At either party’s request, the arbitrators shall give a written opinion stating the factual basis and legal reasoning for their decision. The arbitrators shall have the authority to determine issues of arbitrability and to award compensatory damages, but they shall not award punitive or exemplary damages. The parties, their representatives, and any other participants shall hold the existence, content, and result of the arbitration in confidence. The arbitration proceedings shall be conducted in the English language and take place in Wilmington, Delaware, or any other place on which all three arbitrators agree unanimously.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Miscellaneous</h3>
            <p className="mb-6">
              Assignment: You may not assign or otherwise transfer any of your rights or obligations hereunder, whether by merger, sale of assets, change of control, operation of law, or otherwise, without our prior written consent. Any attempted assignment or transfer without such consent will be void. We may freely assign or delegate all rights and obligations under these Spark IQ Terms, fully or partially, without notice to you. We may also substitute by way of unilateral novation, effective upon notice to you, any third party that assumes our rights and obligations under these Spark IQ Terms.
            </p>
            <p className="mb-6">
              Severability: Each provision of these Spark IQ Terms is severable. If any provision of these Spark IQ Terms is or becomes illegal, invalid, or unenforceable in any jurisdiction, the illegality, invalidity, or unenforceability of that provision will not affect the legality, validity, or enforceability of the remaining provisions of these Spark IQ Terms or of that provision in any other jurisdiction.
            </p>
            <p className="mb-6">
              Force Majeure: Except for payment obligations, neither party shall be liable for any failure to perform its obligations hereunder where and such failure results from any cause beyond such party’s reasonable control, including without limitation: if one or several third parties change their offerings or terms or no longer offer their services to you or Spark IQ on reasonable terms; denial of service attacks; acts of God; acts of war; acts of terrorism; labor disruptions; and any laws, orders, rules, regulations, acts, or restraints of any government or governmental body or authority, civil or military, including the orders and judgments of courts.
            </p>
            <p className="mb-6">
              Entire Agreement: These Spark IQ Terms constitute the entire agreement between the parties with respect to the Services provided hereunder and supersedes all previous agreements and understandings between the parties with respect to the Services.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
