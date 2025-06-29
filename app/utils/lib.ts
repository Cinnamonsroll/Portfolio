type Context = {
  time: {
    coding: number;
    graduation: number;
    age: number;
  };
  instruments: number;
};

const context: Context = {
  time: {
    coding: yearsBetween(new Date(), new Date("2022-05-25")),
    graduation: 2025,
    age: yearsBetween(new Date(), new Date("2006-11-18")),
  },
  instruments: 8,
};

export function interpolate(input: string): string {
  let result = "";
  let i = 0;

  while (i < input.length) {
    if (input[i] === "{" && input[i + 1] !== undefined) {
      let j = i + 1;
      let token = "";

      while (j < input.length && input[j] !== "}") {
        token += input[j];
        j++;
      }

      if (input[j] === "}") {
        const keys = token.split(".");
        let value: unknown = context;

        for (const key of keys) {
          if (typeof value === "object" && value !== null && key in value) {
            value = (value as Record<string, unknown>)[key];
          } else {
            value = undefined;
            break;
          }
        }

        result += value !== undefined ? String(value) : `{${token}}`;
        i = j + 1;
      } else {
        result += input[i];
        i++;
      }
    } else {
      result += input[i];
      i++;
    }
  }

  return result;
}

function yearsBetween(date1: Date, date2: Date): number {
  const start = new Date(Math.min(date1.getTime(), date2.getTime()));
  const end = new Date(Math.max(date1.getTime(), date2.getTime()));

  let yearsDiff = end.getFullYear() - start.getFullYear();

  const hasNotHadBirthday =
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate());

  if (hasNotHadBirthday) {
    yearsDiff--;
  }

  return yearsDiff;
}
