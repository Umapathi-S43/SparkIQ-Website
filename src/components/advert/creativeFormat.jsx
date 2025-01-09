import React from "react";
import SocialMediaPost from "./socialMediaPost";
import AdPost from "./adPost";

export default function CreativeFormat({ selectedOption = "Social Media Post" }) {
  return (
    <div>
      {selectedOption === "Social Media Post" && <SocialMediaPost />}
      {selectedOption === "Advertisement (Ad)" && <AdPost />}
    </div>
  );
}
