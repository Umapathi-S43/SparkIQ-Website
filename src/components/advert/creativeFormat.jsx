import React from "react";

import SocialMediaPost from "./socialMediaPost";
import AdPost from "./adPost";


export default function CreativeFormat({ selectedOption }) {
  return (
    <div>
      {selectedOption === "Social Media Post" && <SocialMediaPost />}
      {selectedOption === "Advertisement (Ad)" && <AdPost />}
    </div>
  );
}
