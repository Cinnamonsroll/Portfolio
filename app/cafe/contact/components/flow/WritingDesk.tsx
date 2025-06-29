import { useState } from "react";
import DeskView from "../views/DeskView";
import EnvelopeView from "../views/EnvelopeView";
import WritingView from "../views/WritingView";
import SentView from "../views/SentView";
import "./WritingDesk.css"

export function WritingDeskFlow() {
  const [currentStep, setCurrentStep] = useState("desk");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [selectedPaper, setSelectedPaper] = useState("cream");
  const [selectedStamp, setSelectedStamp] = useState("coffee");

  const stampTypes = [
    { id: "coffee", emoji: "☕", name: "Coffee Bean", price: "55¢" },
    { id: "code", emoji: "💻", name: "Developer", price: "60¢" },
    { id: "heart", emoji: "❤️", name: "Love Letter", price: "50¢" },
    { id: "star", emoji: "⭐", name: "Special", price: "65¢" },
  ];

  const paperTypes = [
    { id: "cream", name: "Cream Paper", color: "#faf8f3", texture: "smooth" },
    {
      id: "vintage",
      name: "Vintage Parchment",
      color: "#f4f1e8",
      texture: "aged",
    },
  ];

  const actions = {
    toDesk: () => setCurrentStep("desk"),
    toWriting: () => setCurrentStep("writing"),
    toEnvelope: () => setCurrentStep("envelope"),
    toSending: () => {
      setCurrentStep("sent");
    },
    restart: () => {
      setCurrentStep("desk");
      setFormData({ name: "", email: "", message: "" });
    },
  };

  return (
    <main className="writing-desk-container">
      {currentStep === "desk" && (
        <DeskView onStartWriting={actions.toWriting} />
      )}
      {currentStep === "writing" && (
        <WritingView
          formData={formData}
          setFormData={setFormData}
          paperTypes={paperTypes}
          selectedPaper={selectedPaper}
          setSelectedPaper={setSelectedPaper}
          onBack={actions.toDesk}
          onNext={actions.toEnvelope}
        />
      )}
      {currentStep === "envelope" && (
        <EnvelopeView
          formData={formData}
          selectedStamp={selectedStamp}
          setSelectedStamp={setSelectedStamp}
          stampTypes={stampTypes}
          onBack={actions.toWriting}
          onSeal={actions.toSending}
        />
      )}
      {currentStep === "sent" && (
        <SentView
          formData={formData}
          selectedStamp={selectedStamp}
          stampTypes={stampTypes}
          onRestart={actions.restart}
        />
      )}
    </main>
  );
}
