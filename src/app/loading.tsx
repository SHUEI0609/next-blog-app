"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Loading() {
  return (
    <div className="loading-container">
      <FontAwesomeIcon icon={faSpinner} className="spinner" /> 
      <span className="loading-text">Loading...</span>
    </div>
  );
}
