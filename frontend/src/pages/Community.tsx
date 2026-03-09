import { useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import ProfileDrawer from "@/components/layout/ProfileDrawer";
import "./Community.css";

/* ======================================================
   DYSLEXIA-SPECIFIC COMMUNITIES
   ====================================================== */

const NGO_GIGS = [
  {
    name: "Dyslexia India Network",
    cause: "Dyslexia Awareness & Early Screening",
    contact: "+91 98765 43210",
    email: "support@dyslexiaindia.org",
    address: "Shivajinagar, Pune, Maharashtra",
    description:
      "A national network focused on early identification, teacher training, and parental guidance for children with dyslexia.",
  },
  {
    name: "ReadRight Learning Center",
    cause: "Reading & Writing Support for Dyslexic Children",
    contact: "+91 91234 56789",
    email: "contact@readright.in",
    address: "Baner, Pune, Maharashtra",
    description:
      "Provides personalized reading and writing interventions using multi-sensory techniques for dyslexic learners.",
  },
  {
    name: "NeuroLearn Foundation",
    cause: "Learning Disabilities & Neurodiversity",
    contact: "+91 99887 66554",
    email: "hello@neurolearn.org",
    address: "Andheri West, Mumbai, Maharashtra",
    description:
      "Supports children with dyslexia, ADHD, and dysgraphia through assessments, therapy, and assistive technology.",
  },
  {
    name: "Letters & Beyond",
    cause: "Assistive Education & Parent Support",
    contact: "+91 97654 32109",
    email: "info@lettersandbeyond.in",
    address: "Hinjewadi, Pune, Maharashtra",
    description:
      "Runs community workshops, parent counselling, and dyslexia-friendly learning programs for early learners.",
  },
];

const Community = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <SceneBackground onProfileOpen={() => setIsProfileOpen(true)}>
      <SignBoard maxWidth="1100px">
        <div className="community-content">

          {/* Header */}
          <div className="community-header">
            <h1>Dyslexia Support Community</h1>
            <p>
              Connect with organizations, mentors, and learning centers dedicated
              to supporting dyslexic learners and their families.
            </p>
          </div>

          {/* Community Grid */}
          <div className="community-grid">
            {NGO_GIGS.map((ngo, index) => (
              <div key={index} className="community-card">
                <h2>{ngo.name}</h2>

                <p className="community-cause">
                  <strong>Focus:</strong> {ngo.cause}
                </p>

                <p className="community-description">
                  {ngo.description}
                </p>

                <div className="community-info">
                  <p>📍 {ngo.address}</p>
                  <p>📞 {ngo.contact}</p>
                  <p>✉️ {ngo.email}</p>
                </div>

                <button className="community-btn">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </SignBoard>

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </SceneBackground>
  );
};

export default Community;