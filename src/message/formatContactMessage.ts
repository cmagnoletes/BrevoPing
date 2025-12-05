import type { BrevoContact } from "../types/brevo";

const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
};

const serialize = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export const formatContactMessage = (contact: BrevoContact): string => {
  const lines: string[] = ["🆕 New Brevo Contact", ""];

  for (const [key, value] of Object.entries(contact)) {
    if (key === "attributes" && value && typeof value === "object") {
      const attributes = value as Record<string, unknown>;
      for (const [attrKey, attrValue] of Object.entries(attributes)) {
        if (isEmptyValue(attrValue)) continue;
        lines.push(`attributes.${attrKey}: ${serialize(attrValue)}`);
      }
      continue;
    }

    if (isEmptyValue(value)) continue;
    lines.push(`${key}: ${serialize(value)}`);
  }

  return lines.join("\n");
};
