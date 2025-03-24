import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ChevronRight, Code, Globe } from "lucide-react"

interface DarkModeTutorialProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (websiteUrl: string) => void
}

const tutorialSteps = [
  {
    title: "Add Dark Mode Toggle",
    description: "First, add a button or switch component that will toggle between light and dark modes.",
    code: `// Add this to your main component or layout
const [darkMode, setDarkMode] = useState(false);

// Toggle function
const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  document.documentElement.classList.toggle('dark');
};

// Add this button to your UI
<button onClick={toggleDarkMode}>
  {darkMode ? '🌙' : '☀️'}
</button>`
  },
  {
    title: "Configure Tailwind Dark Mode",
    description: "Set up your Tailwind CSS configuration to support dark mode classes.",
    code: `// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ... rest of your config
}`
  },
  {
    title: "Add Dark Mode Styles",
    description: "Add dark mode variants to your components using Tailwind's dark: modifier.",
    code: `<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  {/* Your content */}
</div>`
  }
];

export function DarkModeTutorial({ open, onOpenChange, onComplete }: DarkModeTutorialProps) {
  const [step, setStep] = React.useState(0);
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleSubmitUrl = () => {
    if (websiteUrl) {
      onComplete(websiteUrl);
      onOpenChange(false);
      // Reset state for next time
      setStep(0);
      setWebsiteUrl("");
      setIsCompleted(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-50">
            {isCompleted ? "Almost there!" : "How to Add Dark Mode"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isCompleted 
              ? "Enter your website URL to verify dark mode implementation"
              : `Step ${step + 1} of ${tutorialSteps.length}`
            }
          </DialogDescription>
        </DialogHeader>

        {!isCompleted ? (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-50">{tutorialSteps[step].title}</h3>
              <p className="text-sm text-zinc-400">
                {tutorialSteps[step].description}
              </p>
              <div className="relative">
                <pre className="p-4 rounded-lg bg-black text-zinc-100 text-sm overflow-x-auto border border-zinc-800">
                  <code>{tutorialSteps[step].code}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                  onClick={() => {
                    navigator.clipboard.writeText(tutorialSteps[step].code);
                  }}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Enter your website URL"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {!isCompleted ? (
            <Button 
              onClick={handleNext} 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {step < tutorialSteps.length - 1 ? (
                <>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Complete Tutorial
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitUrl} 
              disabled={!websiteUrl} 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-zinc-700"
            >
              Get Dark Mode Badge
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 