import React from "react";
import "./EnvelopeView.css"

export default function EnvelopeView({
  formData,
  selectedStamp,
  setSelectedStamp,
  stampTypes,
  onBack,
  onSeal,
}: {
  formData: { name: string; email: string };
  selectedStamp: string;
  setSelectedStamp: (id: string) => void;
  stampTypes: { id: string; emoji: string; name: string; price: string }[];
  onBack: () => void;
  onSeal: () => void;
}) {
  return (
    <div className="envelope-station">
      <div className="envelope-preparation">
        <h3>Prepare your envelope</h3>
        <div className="envelope-large">
          <div className="envelope-front">
            <div className="address-section to-address">
              <div className="address-label">To:</div>
              <div className="address-lines">
                <div className="address-line">John Developer</div>
                <div className="address-line">123 Code Street</div>
                <div className="address-line">Dev City, DC 12345</div>
              </div>
            </div>
            <div className="address-section from-address">
              <div className="address-label">From:</div>
              <div className="address-lines">
                <div className="address-line">{formData.name}</div>
                <div className="address-line">{formData.email}</div>
              </div>
            </div>
            <div className="stamp-area">
              <div className="stamp-selection">
                <h4>Choose a stamp:</h4>
                <div className="stamp-options">
                  {stampTypes.map((stamp) => (
                    <button
                      key={stamp.id}
                      className={`stamp-option ${selectedStamp === stamp.id ? "selected" : ""}`}
                      onClick={() => setSelectedStamp(stamp.id)}
                    >
                      <div className="stamp-design">
                        <span className="stamp-emoji">{stamp.emoji}</span>
                        <div className="stamp-price">{stamp.price}</div>
                      </div>
                      <div className="stamp-name">{stamp.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="selected-stamp">
                <div className="stamp-placed">
                  <span className="stamp-emoji">
                    {stampTypes.find((s) => s.id === selectedStamp)?.emoji}
                  </span>
                  <div className="stamp-price">
                    {stampTypes.find((s) => s.id === selectedStamp)?.price}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="envelope-flap">
            <div className="wax-seal-area">
              <div className="wax-seal">🔒</div>
            </div>
          </div>
        </div>
        <div className="envelope-actions">
          <button onClick={onBack} className="back-to-writing">
            Back to Writing
          </button>
          <button onClick={onSeal} className="seal-envelope">
            <span className="btn-icon">📮</span>
            Seal & Send
          </button>
        </div>
      </div>
    </div>
  );
}
