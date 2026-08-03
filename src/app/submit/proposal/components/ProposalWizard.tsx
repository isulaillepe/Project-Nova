"use client";

import * as React from "react";
import { TrackSelection } from "./TrackSelection";
import { ProposalPortal } from "./ProposalPortal";

const STORAGE_KEY = "nova_selected_proposal_track";

export function ProposalWizard() {
  const [selectedTrack, setSelectedTrack] = React.useState<"university" | "school" | null>(null);

  // Restore track from sessionStorage on initial load
  React.useEffect(() => {
    try {
      const savedTrack = sessionStorage.getItem(STORAGE_KEY);
      if (savedTrack === "university" || savedTrack === "school") {
        setSelectedTrack(savedTrack);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSelectTrack = (track: "university" | "school") => {
    setSelectedTrack(track);
    try {
      sessionStorage.setItem(STORAGE_KEY, track);
    } catch {
      // Ignore storage errors
    }
  };

  const handleBackToHub = () => {
    setSelectedTrack(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  if (!selectedTrack) {
    return <TrackSelection onSelectTrack={handleSelectTrack} />;
  }

  return (
    <ProposalPortal
      track={selectedTrack}
      onBackToHub={handleBackToHub}
    />
  );
}
