import * as React from "react"
import { Moon, Sun, Leaf } from "lucide-react"

interface WebsiteData {
  name: string;
  url: string;
  hasDarkMode: boolean;
  imageUrl: string;
  timestamp?: string;
}

interface BadgeProps {
  websiteData: WebsiteData;
  popupUrl: string;
}

export function EmbeddableBadge({ websiteData, popupUrl }: BadgeProps) {
  return (
    <a
      href={popupUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-4 py-3 bg-zinc-900 text-zinc-100 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors"
    >
      <div className="text-emerald-400">
        <Leaf className="h-5 w-5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-medium">Environment Friendly</div>
        <div className="text-[10px] text-zinc-400">{websiteData.name} - DARKMODENOW.COM</div>
      </div>
    </a>
  )
} 