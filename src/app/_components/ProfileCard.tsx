"use client";

import React from "react";
import Image from "next/image";

const ProfileCard: React.FC = () => {
  return (
    <div className="profile-card">
      <div className="profile-image-wrapper">
        <Image
          src="/NZ.jpg"
          alt="Profile Image"
          width={150}
          height={150}
          className="profile-image"
        />
      </div>
      <h2 className="profile-name">SHUEI KOMURO</h2>

      <div className="profile-info-grid">
        <div className="info-group">
          <span className="info-label">Role</span>
          <span className="info-text">情報系高専生</span>
        </div>
        <div className="info-group">
          <span className="info-label">Location</span>
          <span className="info-text">大阪府</span>
        </div>
        <div className="info-group full-width">
          <span className="info-label">Bio</span>
          <p className="info-text bio-text">
            あかさたなはまやらわ
          </p>
        </div>
        <div className="info-group full-width">
          <span className="info-label">Links</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="https://shuei0609.github.io/MyPortfolio/" className="info-link">MyPortfolio</a>
            <a href="https://github.com/shuei0609" className="info-link">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
