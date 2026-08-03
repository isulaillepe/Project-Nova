import type { Metadata } from "next";
import { ProposalWizard } from "./components/ProposalWizard";

export const metadata: Metadata = {
  title: "Submit Proposal - Project Nova",
  description: "Submit your team proposal for Project Nova inter-university and inter-school technology competition organized by AIESEC in USJ.",
  keywords: ["Project Nova", "proposal submission", "AIESEC", "University of Sri Jayewardenepura", "tech competition", "Sri Lanka"],
};

export default function SubmitProposalPage() {
  return <ProposalWizard />;
}
