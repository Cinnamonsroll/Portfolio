import { isValidElement } from "react";
import type { ReactNode } from "react";

export type DiscordEmbedButtonStyle = 1 | 2 | 3 | 4 | 5;

export type DiscordEmbedImage = {
  src: string;
  description?: string;
};

export type DiscordEmbedButton = {
  label: string;
  url: string;
  style?: DiscordEmbedButtonStyle;
};

type EmbTextProps = { children?: ReactNode };

function toText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  return "";
}

function voidProps(_: unknown): null {
  void _;
  return null;
}

export function DiscordEmbedTitle(props: EmbTextProps): null {
  return voidProps(props);
}

export function DiscordEmbedSubtitle(props: EmbTextProps): null {
  return voidProps(props);
}

export function DiscordEmbedContent(props: EmbTextProps): null {
  return voidProps(props);
}

export function DiscordEmbedImage(props: {
  src: string;
  description?: string;
}): null {
  return voidProps(props);
}

export function DiscordEmbedGallery(props: {
  items: DiscordEmbedImage[];
}): null {
  return voidProps(props);
}

export function DiscordEmbedButton(props: DiscordEmbedButton): null {
  return voidProps(props);
}

export function DiscordEmbedButtons(props: {
  children?: ReactNode;
}): null {
  return voidProps(props);
}

type Collected = {
  title?: string;
  subtitle?: string;
  image?: DiscordEmbedImage;
  contents: string[];
  galleries: DiscordEmbedImage[][];
  buttons: DiscordEmbedButton[];
};

function collect(node: ReactNode, out: Collected): void {
  if (node == null || typeof node === "boolean") return;
  if (Array.isArray(node)) {
    for (const child of node) collect(child, out);
    return;
  }
  if (!isValidElement(node)) return;

  const props = node.props as Record<string, ReactNode>;

  switch (node.type) {
    case DiscordEmbedTitle:
      out.title = toText(props.children);
      break;
    case DiscordEmbedSubtitle:
      out.subtitle = toText(props.children);
      break;
    case DiscordEmbedContent:
      out.contents.push(toText(props.children));
      break;
    case DiscordEmbedImage: {
      const src = typeof props.src === "string" ? props.src : "";
      const description =
        typeof props.description === "string" ? props.description : undefined;
      out.image = {
        src,
        ...(description !== undefined ? { description } : {}),
      };
      break;
    }
    case DiscordEmbedGallery: {
      const raw = Array.isArray(props.items)
        ? (props.items as DiscordEmbedImage[])
        : [];
      out.galleries.push(
        raw.map((item) => ({
          src: String(item.src),
          ...(item.description ? { description: item.description } : {}),
        })),
      );
      break;
    }
    case DiscordEmbedButton: {
      const label = toText(props.label);
      const url = toText(props.url);
      out.buttons.push({
        label,
        url,
        ...(typeof props.style === "number"
          ? { style: props.style as DiscordEmbedButtonStyle }
          : {}),
      });
      break;
    }
    case DiscordEmbedButtons:
      collect(props.children, out);
      break;
    default:
      collect(props.children, out);
      break;
  }
}

export function serializeDiscordEmbed({
  children,
}: {
  accentColor?: string | number;
  children?: ReactNode;
}) {
  const collected: Collected = {
    contents: [],
    galleries: [],
    buttons: [],
  };
  collect(children, collected);

  const components: object[] = [];

  if (collected.title) {
    components.push({ type: 10, content: `# ${collected.title}` });
  }
  if (collected.subtitle) {
    components.push({ type: 10, content: collected.subtitle });
  }

  const mediaItems = [
    ...(collected.image ? [collected.image] : []),
    ...collected.galleries.flat(),
  ];
  if (mediaItems.length > 0) {
    components.push({
      type: 12,
      items: mediaItems.slice(0, 10).map((item) => ({
        media: { url: item.src },
      })),
    });
  }

  for (const text of collected.contents) {
    components.push({ type: 10, content: text });
  }

  return {
    type: 17,
    components,
  };
}