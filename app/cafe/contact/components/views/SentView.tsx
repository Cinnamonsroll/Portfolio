import "./SentView.css"

export default function SentView({
  formData,
  selectedStamp,
  stampTypes,
  onRestart,
}: {
  formData: { name: string; email: string };
  selectedStamp: string;
  stampTypes: { id: string; emoji: string; name: string; price: string }[];
  onRestart: () => void;
}) {
  const stamp = stampTypes.find((s) => s.id === selectedStamp);
  return (
    <div className="sent-station">
      <div className="success-scene">
        <div className="success-icon">📬</div>
        <h3>Letter Delivered!</h3>
        <p>Your message has been successfully sent.</p>
        <p>I&apos;ll get back to you as soon as possible!</p>
        <div className="message-summary">
          <h4>Message Summary:</h4>
          <div className="summary-item">
            <strong>From:</strong> {formData.name}
          </div>
          <div className="summary-item">
            <strong>Email:</strong> {formData.email}
          </div>
          <div className="summary-item">
            <strong>Stamp:</strong> {stamp?.name || "Unknown"}
          </div>
        </div>
        <button onClick={onRestart} className="write-another">
          Write Another Letter
        </button>
      </div>
    </div>
  );
}