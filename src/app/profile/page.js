"use client";
import React, { useState } from "react";
import "./profile.css";

function Profile() {
  const [name, setName] = useState("John Doe");
  const [githubLink, setGithubLink] = useState("https://github.com/johndoe");
  const [linkedinLink, setLinkedinLink] = useState(
    "https://linkedin.com/in/johndoe"
  );
  const [about, setAbout] = useState("A passionate developer.");
  const [skills, setSkills] = useState(["JavaScript", "React"]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [isEditingLinkedin, setIsEditingLinkedin] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditingName(false);
    setIsEditingGithub(false);
    setIsEditingLinkedin(false);
    setIsEditingAbout(false);
    setIsEditingSkills(false);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="container">
      <div className="profile-page">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Name Section */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            {isEditingName ? (
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            ) : (
              <div className="profile-info">
                <span>{name}</span>
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => setIsEditingName(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* GitHub Link Section */}
          <div className="form-group">
            <label htmlFor="githubLink">GitHub Link</label>
            {isEditingGithub ? (
              <input
                type="url"
                id="githubLink"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                required
              />
            ) : (
              <div className="profile-info">
                <span>{githubLink}</span>
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => setIsEditingGithub(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* LinkedIn Link Section */}
          <div className="form-group">
            <label htmlFor="linkedinLink">LinkedIn Link</label>
            {isEditingLinkedin ? (
              <input
                type="url"
                id="linkedinLink"
                value={linkedinLink}
                onChange={(e) => setLinkedinLink(e.target.value)}
                required
              />
            ) : (
              <div className="profile-info">
                <span>{linkedinLink}</span>
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => setIsEditingLinkedin(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="form-group">
            <label htmlFor="about">About</label>
            {isEditingAbout ? (
              <textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            ) : (
              <div className="profile-info">
                <span>{about}</span>
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => setIsEditingAbout(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="form-group">
            <label>Skills</label>
            {isEditingSkills ? (
              <>
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="remove-skill-button"
                        onClick={() => removeSkill(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="add-skill-button"
                  onClick={addSkill}
                >
                  Add Skill
                </button>
              </>
            ) : (
              <div className="profile-info">
                <div className="skills-list">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span key={index} className="skill-item">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span>No skills added</span>
                  )}
                </div>
                {skills.length > 0 && (
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => setIsEditingSkills(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="save-button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
