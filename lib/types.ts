type DateString = string & { readonly _brand: 'DateString' };

export function toDateString(value: string): DateString {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) {
    throw new Error(`Invalid date format "${value}", expected YYYY-MM-DD`);
  }
  return value as DateString;
}

export type ProjectImage = {
  src: string;
  alt?: string;
};

export interface Collaborator {
  name: string;
  github: string;
  role?: string;
}

export interface ProjectLink {
  name: string;
  url: string;
}

export interface RawProject {
  title: string;
  description: string;
  synopsis?: string;
  tags: string[];
  hero?: ProjectImage;
  images?: ProjectImage[];
  date?: {
    start: DateString;
    end?: DateString;
  };
  collaborators?: Collaborator[];
  links?: ProjectLink[];
  status?: "active" | "archived" | "paused";
}

export type Project = RawProject & { slug: string };

export interface RawCraft {
  title: string;
  description: string;
  icon?: ProjectImage;
  date: {
    start: DateString;
  };
  tags?: string[];
  links?: ProjectLink[];
}

export type Craft = RawCraft & { slug: string };

export interface RawBlog {
  title: string;
  description: string;
  hero?: ProjectImage;
  images?: ProjectImage[];
  date: {
    start: DateString;
    end?: DateString;
  };
  tags?: string[];
  collaborators?: Collaborator[];
}

export type Blog = RawBlog & { slug: string };

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}