// src/config/project-constants.ts
// 🛡️ SINGLE SOURCE OF TRUTH - Ghost-Proof Configuration

export const PROJECT_CONFIG = {
  name: "Policy.Compliance.by.Hnoss.PrisManTHarIOn",
  domain: "starlightmovementz.org",
  
  // ✅ OFFICIAL ENDPOINTS (Only these are allowed)
  supabase: {
    url: "https://xblewwjjqvwerypvttfh.supabase.co",
    project: "C3Yz3ye2"
  },
  
  netlify: {
    url: "https://europea-un-world-lfx-peace-eu-gov-int.netlify.app/"
  },

  // ✅ ALLOWED CATEGORIES (Whitelist)
  allowedCategories: [
    "github",
    "assets", 
    "database",
    "deployment",
    "platform",
    "badge",
    "community",
    "documentation",
    "registry",
    "infrastructure",
    "reference",
    "license"
  ] as const,

  // 🚫 FORBIDDEN PATTERNS (Ghost Detection)
  forbiddenPatterns: [
    /lovable\.dev/i,
    /hello-hug-wave/i,
    /REPLACE_WITH_PROJECT_ID/i,
    /onbiela\.dev/i,
    /macaly-app\.com/i,
    /PLACEHOLDER/i,
    /TODO:/i
  ] as const,

  // ✅ OFFICIAL GITHUB REPOSITORIES
  officialRepos: [
    "CaZaR.AGi",
    "3D-MODELING-ANIMATION", 
    "PrismanTHarIOn.Hnoss---Website-B3w3rbung2-M4pp3-",
    "4a3C5u2S7T1i3C"
  ] as const,

  // ✅ OFFICIAL DOCUMENTATION URLS
  officialDocs: [
    "https://learn.microsoft.com/en-us/agent-framework/",
    "https://hnoss-ambassador.org",
    "https://universal-values.org",
    "https://st-daniel-pohl.org"
  ] as const
} as const;

// Type definitions for compile-time checks
export type AllowedCategory = typeof PROJECT_CONFIG.allowedCategories[number];
export type OfficialRepo = typeof PROJECT_CONFIG.officialRepos[number];

// Ghost Validation Function
export function isGhostUrl(url: string): boolean {
  return PROJECT_CONFIG.forbiddenPatterns.some(pattern => pattern.test(url));
}

export function validateCategory(category: string): category is AllowedCategory {
  return PROJECT_CONFIG.allowedCategories.includes(category as AllowedCategory);
}
