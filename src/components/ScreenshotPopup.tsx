import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { X, Share2, Check, Copy, Code } from "lucide-react"
import { EmbeddableBadge } from "./EmbeddableBadge"

interface WebsiteData {
  website: string;
  analyzed_at: string;
  has_dark_mode: boolean;
  is_default: boolean;
  notes: string;
  screenshot: string | null;
}

interface ScreenshotPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteData?: WebsiteData;
}

export function ScreenshotPopup({ open, onOpenChange, websiteData }: ScreenshotPopupProps) {
  if (!websiteData) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-100">
            {websiteData.website}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            <span className="text-xs">Analyzed on {formatDate(websiteData.analyzed_at)}</span>
          </DialogDescription>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm text-zinc-400 opacity-70 transition-opacity hover:opacity-100 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {websiteData.screenshot && (
            <div className="relative w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
              <img
                src={websiteData.screenshot}
                alt={`${websiteData.website} Screenshot`}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}
          <div className={`p-3 rounded-lg ${
            websiteData.has_dark_mode 
              ? 'bg-emerald-950 text-emerald-100 border border-emerald-900' 
              : 'bg-red-950 text-red-100 border border-red-900'
          }`}>
            <p className="font-medium text-sm">
              {websiteData.has_dark_mode 
                ? '✓ This website has dark mode support!' 
                : '✗ This website does not support dark mode.'}
            </p>
          </div>
          {websiteData.notes && (
            <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
              <p className="text-sm text-zinc-300">
                <span className="font-medium text-zinc-100">Notes:</span> {websiteData.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 