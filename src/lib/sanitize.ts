/**
 * Input Sanitization Utilities
 *
 * Provides comprehensive sanitization for user inputs to prevent XSS,
 * injection attacks, and data corruption.
 */

import { z } from "zod";

/**
 * HTML entity encoding map for XSS prevention
 * Using numeric entity references to avoid encoding issues in source
 */
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape HTML special characters to prevent XSS
 * @param input - String to escape
 * @returns HTML-escaped string
 */
export function escapeHtml(input: string): string {
  if (typeof input !== "string") return String(input);
  return input.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize plain text input - remove control characters, trim whitespace
 * @param input - String to sanitize
 * @param options - Sanitization options
 * @returns Sanitized string
 */
export function sanitizeText(
  input: string,
  options: {
    maxLength?: number;
    allowNewlines?: boolean;
    trim?: boolean;
  } = {}
): string {
  if (typeof input !== "string") return String(input);

  const { maxLength = 10000, allowNewlines = false, trim = true } = options;

  let sanitized = input;

  // Remove null bytes and control characters except newlines/tabs if allowed
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  if (!allowNewlines) {
    sanitized = sanitized.replace(/[\r\n\t]+/g, " ");
  }

  if (trim) {
    sanitized = sanitized.trim();
  }

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize email address - validate format and normalize
 * @param input - Email string
 * @returns Sanitized lowercase email or empty string if invalid
 */
export function sanitizeEmail(input: string): string {
  if (typeof input !== "string") return "";

  const sanitized = sanitizeText(input, { maxLength: 254, trim: true }).toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) return "";

  return sanitized;
}

/**
 * Sanitize phone number - keep only digits, +, spaces, dashes, parentheses
 * @param input - Phone string
 * @returns Sanitized phone number
 */
export function sanitizePhone(input: string): string {
  if (typeof input !== "string") return "";
  return sanitizeText(input, { maxLength: 30, trim: true }).replace(/[^\d\s+\-()]/g, "");
}

/**
 * Sanitize name - allow letters, spaces, hyphens, apostrophes, periods
 * @param input - Name string
 * @returns Sanitized name
 */
export function sanitizeName(input: string): string {
  if (typeof input !== "string") return "";
  return sanitizeText(input, { maxLength: 100, trim: true }).replace(/[^a-zA-Z\s\-'.]/g, "");
}

/**
 * Sanitize alphanumeric ID (NIC, student ID, etc.)
 * @param input - ID string
 * @returns Sanitized ID
 */
export function sanitizeAlphanumericId(input: string): string {
  if (typeof input !== "string") return "";
  return sanitizeText(input, { maxLength: 50, trim: true }).replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Sanitize HTML - escape all HTML special characters
 * @param input - String to sanitize
 * @returns HTML-escaped string
 */
export function sanitizeHtml(input: string): string {
  return escapeHtml(input);
}

/**
 * Sanitize NIC/ID number - keep alphanumeric only
 * @param input - NIC/ID string
 * @returns Sanitized ID
 */
export function sanitizeNic(input: string): string {
  if (typeof input !== "string") return "";
  return sanitizeText(input, { maxLength: 20, trim: true }).replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Sanitize track selection - only allow known values
 * @param input - Track string
 * @param allowedValues - Array of allowed track values
 * @returns Sanitized track or empty string if invalid
 */
export function sanitizeTrack(input: string, allowedValues: string[] = ["school", "university"]): string {
  if (typeof input !== "string") return "";
  const sanitized = sanitizeText(input, { maxLength: 20, trim: true }).toLowerCase();
  return allowedValues.includes(sanitized) ? sanitized : "";
}

/**
 * Deep sanitize object - recursively sanitize all string values
 * @param obj - Object to sanitize
 * @param sanitizers - Map of key patterns to sanitizer functions
 * @returns Sanitized object
 */
export function deepSanitize<T extends Record<string, unknown>>(
  obj: T,
  sanitizers: Record<string, (value: string) => string> = {}
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result[key] = value;
      continue;
    }

    // Check for specific sanitizer
    if (typeof value === "string") {
      const sanitizer = sanitizers[key];
      if (sanitizer) {
        result[key] = sanitizer(value);
      } else {
        result[key] = sanitizeText(value);
      }
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitizeText(item) : deepSanitize(item as Record<string, unknown>, sanitizers)
      );
    } else if (typeof value === "object") {
      result[key] = deepSanitize(value as Record<string, unknown>, sanitizers);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Zod transform for HTML escaping
 */
export const escapeHtmlTransform = z.string().transform(escapeHtml);

/**
 * Zod transform for text sanitization
 */
export const sanitizeTextTransform = (options?: { maxLength?: number; allowNewlines?: boolean }) =>
  z.string().transform((val) => sanitizeText(val, options));

/**
 * Zod transform for email sanitization
 */
export const sanitizeEmailTransform = z.string().transform(sanitizeEmail);

/**
 * Zod transform for name sanitization
 */
export const sanitizeNameTransform = z.string().transform(sanitizeName);

/**
 * Zod transform for phone sanitization
 */
export const sanitizePhoneTransform = z.string().transform(sanitizePhone);

/**
 * Zod transform for alphanumeric ID sanitization
 */
export const sanitizeAlphanumericIdTransform = z.string().transform(sanitizeAlphanumericId);

/**
 * Zod transform for team name sanitization
 */
export const sanitizeTeamNameTransform = z.string().transform(sanitizeName);

/**
 * Rate limiting helper - simple in-memory store (for edge runtime compatibility)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Sanitize email template variables to prevent injection
 * @param variables - Object with template variables
 * @returns Sanitized variables safe for template interpolation
 */
export function sanitizeTemplateVariables(variables: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === "string") {
      sanitized[key] = escapeHtml(value);
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = String(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((v) => (typeof v === "string" ? escapeHtml(v) : String(v))).join(", ");
    } else {
      sanitized[key] = "";
    }
  }

  return sanitized;
}