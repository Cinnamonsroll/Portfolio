export function ContactHeader() {
  return (
    <header className="contact-header">
      <button
        onClick={() => (window.location.href = "/cafe")}
        className="back-btn"
      >
        <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Café
      </button>
      <h1 className="contact-title">Write Me a Letter</h1>
      <p className="contact-subtitle">Send a message the old-fashioned way</p>
    </header>
  );
}