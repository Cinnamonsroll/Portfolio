export type DiscordEmbedButtonStyle = 1 | 2 | 3 | 4 | 5;

export type DiscordEmbedButton = {
  label: string;
  url: string;
  style?: DiscordEmbedButtonStyle;
};

export type DiscordEmbedImage = {
  url: string;
  description?: string;
};

export type DiscordEmbedContent = {
  accentColor?: string | number;
  title: string;
  subtitle?: string;
  image?: DiscordEmbedImage;
  text?: string;
  texts?: string[];
  buttons?: DiscordEmbedButton[];
};

function normalizeAccentColor(color?: string | number): number | undefined {
  if (typeof color === "number") return color;
  if (typeof color === "string") {
    const hex = color.replace(/^#/, "");
    if (/^[0-9a-f]{6}$/i.test(hex)) return parseInt(hex, 16);
  }
  return undefined;
}

export function buildDiscordEmbed(content: DiscordEmbedContent) {
  const accentColor = normalizeAccentColor(content.accentColor);
  const components: object[] = [];

  const gallery: object[] = [];
  if (content.title) gallery.push({ type: 10, content: `# ${content.title}` });
  if (content.subtitle) gallery.push({ type: 10, content: content.subtitle });

  const mediaGallery: {
    type: number;
    components: object[];
    accessory?: { type: number; media: { url: string }; description?: string };
  } = { type: 9, components: gallery };

  if (content.image) {
    const accessory: {
      type: number;
      media: { url: string };
      description?: string;
    } = {
      type: 11,
      media: { url: content.image.url },
    };
    if (content.image.description) {
      accessory.description = content.image.description;
    }
    mediaGallery.accessory = accessory;
  }

  components.push(mediaGallery);

  const texts = content.text
    ? [content.text, ...(content.texts ?? [])]
    : (content.texts ?? []);

  if (texts.length > 0) {
    components.push({ type: 14, divider: true, spacing: 1 });
    for (const text of texts) {
      components.push({ type: 10, content: text });
    }
  }

  if (content.buttons && content.buttons.length > 0) {
    components.push({
      type: 1,
      components: content.buttons.map((button) => ({
        type: 2,
        style: button.style ?? 5,
        label: button.label,
        url: button.url,
      })),
    });
  }

  return {
    component: {
      type: 17,
      ...(accentColor !== undefined ? { accent_color: accentColor } : {}),
      components,
    },
  };
}
