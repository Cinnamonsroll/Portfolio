interface OgCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer: string;
  accent?: string;
}

export function OgCard({ eyebrow, title, subtitle, footer, accent = "#e8c44a" }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#130f0c",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        padding: 64,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(232,196,74,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,196,74,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${accent}22 0%, ${accent}00 55%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `${accent}26`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `${accent}40`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 980,
          width: "100%",
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: accent,
              opacity: 0.8,
              marginBottom: 28,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#f0ebe3",
            letterSpacing: "-0.02em",
            textAlign: "center",
            display: "flex",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.4,
              color: "#a89f93",
              marginTop: 24,
              textAlign: "center",
              maxWidth: 860,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 36,
          fontSize: 15,
          color: "#6b5f53",
          letterSpacing: "0.08em",
          display: "flex",
        }}
      >
        {footer}
      </div>
    </div>
  );
}