export default function DeskView({ onStartWriting }: { onStartWriting: () => void }) {
  return (
    <div className="writing-desk">
      <div className="desk-surface">
        <div className="wood-grain"></div>
        <div className="desk-items">
          <div className="coffee-mug">
            <div className="mug-handle"></div>
            <div className="coffee-steam">
              <div className="steam-wisp"></div>
              <div className="steam-wisp"></div>
              <div className="steam-wisp"></div>
            </div>
          </div>

          <div className="clipboard">
            <div className="clipboard-back"></div>
            <div className="clipboard-clip"></div>
            <div className="clipboard-papers">
              <div className="paper-sheet clipboard-paper-1"></div>
              <div className="paper-sheet clipboard-paper-2"></div>
              <div className="paper-sheet clipboard-paper-3"></div>
            </div>
          </div>

          <div className="sticky-note sticky-yellow">
            <div className="sticky-content">
              <div className="sticky-text">Call client</div>
              <div className="sticky-text">@ 3pm</div>
            </div>
          </div>

          <div className="sticky-note sticky-pink">
            <div className="sticky-content">
              <div className="sticky-text">Deploy</div>
              <div className="sticky-text">website</div>
            </div>
          </div>

          <div className="sticky-note sticky-blue">
            <div className="sticky-content">
              <div className="sticky-text">Buy</div>
              <div className="sticky-text">coffee ☕</div>
            </div>
          </div>

          <div className="pencil-holder">
            <div className="holder-base"></div>
            <div className="pencil pencil-1">✏️</div>
            <div className="pencil pencil-2">🖊️</div>
            <div className="pencil pencil-3">✒️</div>
          </div>

          <div className="notebook">
            <div className="notebook-cover"></div>
            <div className="notebook-spiral"></div>
          </div>

          <div className="desk-lamp">
            <div className="lamp-base"></div>
            <div className="lamp-arm"></div>
            <div className="lamp-head"></div>
            <div className="light-glow"></div>
          </div>

          <div className="paper-stack">
            <div className="paper-sheet stack-paper-1"></div>
            <div className="paper-sheet stack-paper-2"></div>
            <div className="paper-sheet stack-paper-3"></div>
            <div className="paper-sheet stack-paper-4"></div>
          </div>

          <div className="stapler">
            <div className="stapler-base"></div>
            <div className="stapler-top"></div>
          </div>

          <div className="rubber-stamps">
            <div className="rubber-stamp stamp-approved">
              <div className="stamp-handle"></div>
              <div className="stamp-base"></div>
            </div>
            <div className="rubber-stamp stamp-urgent">
              <div className="stamp-handle"></div>
              <div className="stamp-base"></div>
            </div>
          </div>

          <div className="envelope-tray">
            <div className="tray-base"></div>
            <div className="envelope env-1"></div>
            <div className="envelope env-2"></div>
            <div className="envelope env-3"></div>
          </div>

          <div className="desk-calendar">
            <div className="calendar-base"></div>
            <div className="calendar-page">
              <div className="calendar-date">15</div>
              <div className="calendar-month">DEC</div>
            </div>
          </div>

          <div className="desk-phone">
            <div className="phone-base"></div>
            <div className="phone-handset"></div>
            <div className="phone-cord"></div>
          </div>
        </div>
        <div className="desk-invitation">
          <h3>Ready to write?</h3>
          <p>Pull up a chair and let&apos;s craft your message together</p>
          <button onClick={onStartWriting} className="start-writing">
            <span className="btn-icon">✍️</span>
            Start Writing
          </button>
        </div>
      </div>
    </div>
  );
}