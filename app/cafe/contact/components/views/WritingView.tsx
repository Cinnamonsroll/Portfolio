import React from "react";
import "./WritingView.css"

export default function WritingView({
  formData,
  setFormData,
  paperTypes,
  selectedPaper,
  setSelectedPaper,
  onBack,
  onNext,
}: {
  formData: { name: string; email: string; message: string };
  setFormData: (data: typeof formData) => void;
  paperTypes: { id: string; name: string; color: string; texture: string }[];
  selectedPaper: string;
  setSelectedPaper: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const canProceed = formData.name && formData.email && formData.message;

  return (
    <div className="writing-station">
      <div className="writing-layout">
        <div className="paper-selection-sidebar">
          <h3>Choose Paper:</h3>
          <div className="paper-options-compact">
            {paperTypes.map((paper) => (
              <button
                key={paper.id}
                className={`paper-option-compact ${selectedPaper === paper.id ? "selected" : ""}`}
                onClick={() => setSelectedPaper(paper.id)}
                style={{ backgroundColor: paper.color }}
              >
                <div className="paper-sample-small"></div>
                <span className="paper-name-small">{paper.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="letter-writing-main">
          <div
            className={`letter-paper-large ${selectedPaper}`}
            style={{
              backgroundColor: paperTypes.find((p) => p.id === selectedPaper)?.color,
            }}
          >
           
            <form className="letter-form-large">
              <div className="letter-greeting-large">
                <label>Dear John,</label>
              </div>
              <div className="form-section-large">
                <label>My name is:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Write your name..."
                  className="handwritten-input-large"
                />
              </div>
              <div className="form-section-large">
                <label>You can reach me at:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="handwritten-input-large"
                />
              </div>
              <div className="form-section-large message-section-large">
                <label>Here&apos;s what I wanted to tell you:</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="handwritten-textarea-large"
                  rows={1}
                  
                />
              </div>
              <div className="letter-closing-large">
                <div className="closing-line-large">Sincerely,</div>
                <div className="signature-line-large">
                  {formData.name || "Your signature"}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="writing-actions">
        <button onClick={onBack} className="back-to-desk">
          Back to Desk
        </button>
        <button onClick={onNext} className="finish-letter" disabled={!canProceed}>
          Finish Letter
        </button>
      </div>
    </div>
  );
}