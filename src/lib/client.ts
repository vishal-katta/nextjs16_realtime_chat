import { treaty } from "@elysiajs/eden"
import type { App } from "../app/api/[[...slugs]]/route"

// Get API URL - use environment variable, current origin, or fallback to localhost for dev
const getApiUrl = () => {
  // Check for explicit API URL environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // Client-side: use current origin (browser)
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  
  // Server-side: use Vercel URL if available, otherwise localhost
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  
  // Fallback to localhost for local development
  return "http://localhost:3000"
}

export const client = treaty<App>(getApiUrl()).api
