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
import { Check, ChevronRight, Code, Globe, Copy, MessageSquare, AlertCircle, Loader2, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface DarkModeTutorialProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (websiteUrl: string) => void
  existingDomains: Array<{
    website: string;
    has_dark_mode: boolean;
    is_default: boolean;
  }>
}

type Language = 'JavaScript' | 'TypeScript' | 'React' | 'Vue' | 'Svelte';
type Framework = 'Tailwind' | 'CSS' | 'SCSS';

const languageImplementations: Record<Language, Record<Framework, string>> = {
  JavaScript: {
    Tailwind: `// Add this to your main component or layout
const darkMode = () => {
  // Check for saved user preference, first in localStorage, then in system preferences
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  return savedTheme === 'dark';
};

const toggleDarkMode = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Add this button to your UI
<button onClick={toggleDarkMode}>
  {darkMode() ? '🌙' : '☀️'}
</button>`,
    CSS: `/* Add these styles to your CSS */
:root {
  --text-color: #000000;
  --background-color: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #ffffff;
    --background-color: #000000;
  }
}

body {
  color: var(--text-color);
  background-color: var(--background-color);
}

.dark-mode-toggle {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
}`,
    SCSS: `// Add these styles to your SCSS
$light-text: #000000;
$light-bg: #ffffff;
$dark-text: #ffffff;
$dark-bg: #000000;

@mixin theme-colors {
  --text-color: #{$light-text};
  --background-color: #{$light-bg};
  
  @media (prefers-color-scheme: dark) {
    --text-color: #{$dark-text};
    --background-color: #{$dark-bg};
  }
}

:root {
  @include theme-colors;
}

body {
  color: var(--text-color);
  background-color: var(--background-color);
}`
  },
  TypeScript: {
    Tailwind: `// Add this to your main component or layout
interface DarkModeState {
  isDark: boolean;
  toggle: () => void;
}

const useDarkMode = (): DarkModeState => {
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? 
      savedTheme === 'dark' : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return {
    isDark,
    toggle: () => setIsDark(!isDark)
  };
};

// Add this button to your UI
const DarkModeToggle: React.FC = () => {
  const { isDark, toggle } = useDarkMode();
  return (
    <button onClick={toggle}>
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};`,
    CSS: `/* Add these styles with TypeScript type safety */
interface ThemeColors {
  textColor: string;
  backgroundColor: string;
}

const lightTheme: ThemeColors = {
  textColor: '#000000',
  backgroundColor: '#ffffff',
};

const darkTheme: ThemeColors = {
  textColor: '#ffffff',
  backgroundColor: '#000000',
};

// Use in your styled components or CSS-in-JS solution
const getThemeColors = (isDark: boolean): ThemeColors => 
  isDark ? darkTheme : lightTheme;`,
    SCSS: `// Add these styles to your SCSS with TypeScript
$themes: (
  light: (
    text-color: #000000,
    background-color: #ffffff,
  ),
  dark: (
    text-color: #ffffff,
    background-color: #000000,
  ),
);

@mixin themed() {
  @each $theme, $map in $themes {
    .theme--#{$theme} & {
      $theme-map: () !global;
      @each $key, $value in $map {
        $theme-map: map-merge($theme-map, ($key: $value)) !global;
      }
      @content;
      $theme-map: null !global;
    }
  }
}`
  },
  React: {
    Tailwind: `// Create a new context for dark mode
import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? 
        savedTheme === 'dark' : 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggle: () => setIsDark(!isDark)
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Usage in a component
export function DarkModeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}`,
    CSS: `/* Add these styles to your React component's CSS */
:root {
  --text-color: #000000;
  --background-color: #ffffff;
  --transition-duration: 0.3s;
}

:root[data-theme='dark'] {
  --text-color: #ffffff;
  --background-color: #000000;
}

body {
  color: var(--text-color);
  background-color: var(--background-color);
  transition: color var(--transition-duration),
              background-color var(--transition-duration);
}`,
    SCSS: `// Add these styles to your React component's SCSS
$themes: (
  light: (
    text-color: #000000,
    background-color: #ffffff,
  ),
  dark: (
    text-color: #ffffff,
    background-color: #000000,
  ),
);

@mixin themed() {
  @each $theme, $map in $themes {
    [data-theme='#{$theme}'] & {
      @content;
    }
  }
}

.themed-component {
  @include themed {
    color: map-get($map, text-color);
    background-color: map-get($map, background-color);
  }
}`
  },
  Vue: {
    Tailwind: `<!-- Create a new composable for dark mode -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const isDark = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme ? 
    savedTheme === 'dark' : 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  updateTheme();
});

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
};

const updateTheme = () => {
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

watch(isDark, updateTheme);
</script>

<template>
  <button @click="toggleDarkMode" class="p-2 rounded-lg bg-gray-200 dark:bg-gray-800">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>`,
    CSS: `<style>
:root {
  --text-color: #000000;
  --background-color: #ffffff;
}

html.dark {
  --text-color: #ffffff;
  --background-color: #000000;
}

body {
  color: var(--text-color);
  background-color: var(--background-color);
  transition: color 0.3s, background-color 0.3s;
}
</style>`,
    SCSS: `<style lang="scss">
$themes: (
  light: (
    text-color: #000000,
    background-color: #ffffff,
  ),
  dark: (
    text-color: #ffffff,
    background-color: #000000,
  ),
);

@mixin themed() {
  @each $theme, $map in $themes {
    html[data-theme='#{$theme}'] & {
      @content;
    }
  }
}

.themed-component {
  @include themed {
    color: map-get($map, text-color);
    background-color: map-get($map, background-color);
  }
}
</style>`
  },
  Svelte: {
    Tailwind: `<!-- Create a new store for dark mode -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const darkMode = writable(false);

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    $darkMode = savedTheme ? 
      savedTheme === 'dark' : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    updateTheme($darkMode);
  });

  function toggleDarkMode() {
    $darkMode = !$darkMode;
    updateTheme($darkMode);
  }

  function updateTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  $: updateTheme($darkMode);
</script>

<button on:click={toggleDarkMode} class="p-2 rounded-lg bg-gray-200 dark:bg-gray-800">
  {$darkMode ? '🌙' : '☀️'}
</button>`,
    CSS: `<style>
  :root {
    --text-color: #000000;
    --background-color: #ffffff;
  }

  :global(html.dark) {
    --text-color: #ffffff;
    --background-color: #000000;
  }

  :global(body) {
    color: var(--text-color);
    background-color: var(--background-color);
    transition: color 0.3s, background-color 0.3s;
  }
</style>`,
    SCSS: `<style lang="scss">
  $themes: (
    light: (
      text-color: #000000,
      background-color: #ffffff,
    ),
    dark: (
      text-color: #ffffff,
      background-color: #000000,
    ),
  );

  @mixin themed() {
    @each $theme, $map in $themes {
      :global(html[data-theme='#{$theme}']) & {
        @content;
      }
    }
  }

  .themed-component {
    @include themed {
      color: map-get($map, text-color);
      background-color: map-get($map, background-color);
    }
  }
</style>`
  }
};

const vibeCodingPrompt = `Please help me implement a dark mode feature for my website with the following requirements:

1. Add a dark/light mode toggle button with smooth transitions
2. Support system preference detection (prefers-color-scheme)
3. Persist user preference in localStorage
4. Implement proper color schemes for both modes
5. Ensure accessibility (sufficient contrast ratios)
6. Add proper aria-labels and keyboard navigation
7. Include smooth transitions between modes
8. Handle initial load flash correctly

Please provide the implementation using modern best practices and consider:
- Clean, maintainable code structure
- Performance optimization
- Cross-browser compatibility
- Mobile responsiveness
- SEO considerations`;

export function DarkModeTutorial({ open, onOpenChange, onComplete, existingDomains }: DarkModeTutorialProps) {
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>('JavaScript');
  const [selectedFramework, setSelectedFramework] = React.useState<Framework>('Tailwind');
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [verificationStep, setVerificationStep] = React.useState<'implementation' | 'verification'>('implementation');
  const [verificationStatus, setVerificationStatus] = React.useState<'idle' | 'success' | 'error' | 'pending'>('idle');
  const [errorMessage, setErrorMessage] = React.useState("");

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const normalizeUrl = (url: string) => {
    // Remove protocol and www, and get domain
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  };

  const generateBadgeCode = (domain: string) => {
    const badgeUrl = `https://www.darkmodenow.com?url=${encodeURIComponent(domain)}`;
    return `<a href="${badgeUrl}" target="_blank" rel="noopener noreferrer">
  <img src="https://www.darkmodenow.com/badge.svg" alt="Dark Mode Enabled" width="160" height="32" />
</a>`;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsiteUrl(value);
    // Reset states when input changes
    setVerificationStatus('idle');
    setErrorMessage("");
  };

  const addToVerificationQueue = async (url: string) => {
    try {
      const normalizedUrl = normalizeUrl(url);
      await addDoc(collection(db, "verification-queue"), {
        website: normalizedUrl,
        submitted_at: serverTimestamp(),
        status: 'pending'
      });
      
      setVerificationStatus('pending');
      setErrorMessage("");
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage("Failed to submit for verification. Please try again.");
    }
  };

  const handleVerify = async () => {
    // Reset states
    setVerificationStatus('idle');
    setErrorMessage("");

    // Enhanced URL validation
    if (!websiteUrl.trim()) {
      setVerificationStatus('error');
      setErrorMessage("Please enter a website URL");
      return;
    }

    // Validate URL format
    if (!websiteUrl.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)) {
      setVerificationStatus('error');
      setErrorMessage("Please enter a valid website URL (e.g., example.com)");
      return;
    }

    const normalizedUrl = normalizeUrl(websiteUrl);
    
    // Check if domain exists in the list and has dark mode
    const existingDomain = existingDomains.find(domain => normalizeUrl(domain.website) === normalizedUrl);
    
    if (existingDomain) {
      if (existingDomain.has_dark_mode) {
        setVerificationStatus('success');
        onComplete(normalizedUrl);
      } else {
        setVerificationStatus('error');
        setErrorMessage("This website is in our database but doesn't have dark mode support yet. Please implement dark mode first.");
      }
    } else {
      // Add to verification queue if not in database
      await addToVerificationQueue(websiteUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800">
        <DialogHeader className="pb-6 border-b border-zinc-800">
          <DialogTitle className="text-2xl font-bold text-zinc-50">
            Dark Mode Verification
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-base mt-2">
            {verificationStatus === 'error' && !existingDomains.find(domain => normalizeUrl(domain.website) === normalizeUrl(websiteUrl))
              ? 'Follow the steps below to implement and verify your dark mode'
              : 'Follow the steps below to verify your dark mode implementation'}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-6">
          {/* Main Content Area - Verification Steps */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-zinc-50 flex items-center gap-2">
              Verification Steps
            </h3>
            <div className="space-y-8">
              <div className="space-y-6">
                <Collapsible>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xl font-medium shrink-0">
                      1
                    </div>
                    <div className="space-y-4 flex-1">
                      <CollapsibleTrigger className="flex items-start justify-between w-full">
                        <div className="space-y-2 text-left">
                          <p className="text-lg font-medium text-zinc-200">Choose Implementation</p>
                          <p className="text-base text-zinc-400 leading-relaxed">Select your preferred language and framework, then copy the implementation code.</p>
                        </div>
                        <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180 mt-1.5" />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="pt-4">
                        <Tabs defaultValue="code" className="w-full">
                          <TabsList className="w-full grid grid-cols-2 bg-zinc-800 rounded-lg p-0">
                            <TabsTrigger 
                              value="code" 
                              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-zinc-400 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                              <Code className="w-5 h-5" />
                              Code Implementation
                            </TabsTrigger>
                            <TabsTrigger 
                              value="vibe" 
                              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-zinc-400 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                              <MessageSquare className="w-5 h-5" />
                              Vibe Coding
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="code" className="space-y-4 mt-0">
                            <div className="flex gap-4">
                              <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Language</label>
                                <select 
                                  value={selectedLanguage}
                                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                                  className="w-full bg-zinc-800/50 text-zinc-100 rounded-lg p-3 border border-zinc-700/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                >
                                  {Object.keys(languageImplementations).map((lang) => (
                                    <option key={lang} value={lang}>{lang}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Framework</label>
                                <select 
                                  value={selectedFramework}
                                  onChange={(e) => setSelectedFramework(e.target.value as Framework)}
                                  className="w-full bg-zinc-800/50 text-zinc-100 rounded-lg p-3 border border-zinc-700/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                >
                                  {Object.keys(languageImplementations[selectedLanguage]).map((framework) => (
                                    <option key={framework} value={framework}>{framework}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="relative rounded-xl overflow-hidden border border-zinc-800/50">
                              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-zinc-400" />
                                  <span className="text-sm font-medium text-zinc-400">Implementation Code</span>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-100"
                                  onClick={() => copyToClipboard(languageImplementations[selectedLanguage][selectedFramework])}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <pre className="p-4 bg-black/50 text-zinc-100 text-sm overflow-x-auto">
                                <code>{languageImplementations[selectedLanguage][selectedFramework]}</code>
                              </pre>
                            </div>
                          </TabsContent>

                          <TabsContent value="vibe" className="space-y-4 mt-0">
                            <div className="relative rounded-xl overflow-hidden border border-zinc-800/50">
                              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-zinc-400" />
                                  <span className="text-sm font-medium text-zinc-400">AI Assistant Prompt</span>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-100"
                                  onClick={() => copyToClipboard(vibeCodingPrompt)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <pre className="p-4 bg-black/50 text-zinc-100 text-sm overflow-x-auto">
                                <code>{vibeCodingPrompt}</code>
                              </pre>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CollapsibleContent>
                    </div>
                  </div>
                </Collapsible>

                <Collapsible>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xl font-medium shrink-0">
                      2
                    </div>
                    <div className="space-y-4 flex-1">
                      <CollapsibleTrigger className="flex items-start justify-between w-full">
                        <div className="space-y-2 text-left">
                          <p className="text-lg font-medium text-zinc-200">Implement Dark Mode</p>
                          <p className="text-base text-zinc-400 leading-relaxed">Add the dark mode toggle and theme switching functionality to your website using our provided code snippets.</p>
                        </div>
                        <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180 mt-1.5" />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="pt-4">
                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                          <ol className="list-decimal list-inside space-y-3 text-zinc-300">
                            <li>Copy the code snippet that matches your tech stack</li>
                            <li>Add the code to your project's main layout or component file</li>
                            <li>Customize the styles to match your website's design</li>
                          </ol>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </div>
                </Collapsible>

                <Collapsible>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xl font-medium shrink-0">
                      3
                    </div>
                    <div className="space-y-4 flex-1">
                      <CollapsibleTrigger className="flex items-start justify-between w-full">
                        <div className="space-y-2 text-left">
                          <p className="text-lg font-medium text-zinc-200">Verify Implementation</p>
                          <p className="text-base text-zinc-400 leading-relaxed">Enter your website URL to verify the dark mode implementation and receive your badge.</p>
                        </div>
                        <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180 mt-1.5" />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="pt-4">
                        <div className="space-y-4">
                          <Input
                            placeholder="Enter your website URL (e.g., example.com)"
                            value={websiteUrl}
                            onChange={handleUrlChange}
                            className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 h-12 text-base ${
                              verificationStatus === 'error' ? 'border-red-500 focus:ring-red-500' : 'focus:ring-emerald-500'
                            }`}
                            aria-invalid={verificationStatus === 'error'}
                            aria-describedby={verificationStatus === 'error' ? 'url-error' : undefined}
                          />
                          {verificationStatus === 'error' && (
                            <Alert variant="destructive" className="bg-red-900/50 border-red-900 text-red-200" id="url-error" role="alert">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                {errorMessage}
                              </AlertDescription>
                            </Alert>
                          )}
                          {verificationStatus === 'success' && (
                            <div className="space-y-4">
                              <Alert className="bg-emerald-900/50 border-emerald-900 text-emerald-200">
                                <Check className="h-4 w-4" />
                                <AlertDescription>
                                  Congratulations! Your website has been verified. Here's your badge:
                                </AlertDescription>
                              </Alert>
                              <div className="relative">
                                <pre className="p-4 rounded-lg bg-black text-zinc-100 text-sm overflow-x-auto border border-zinc-800">
                                  <code>{generateBadgeCode(normalizeUrl(websiteUrl))}</code>
                                </pre>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute top-2 right-2 h-8 w-8 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                                  onClick={() => copyToClipboard(generateBadgeCode(normalizeUrl(websiteUrl)))}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          {verificationStatus === 'pending' && (
                            <Alert className="bg-blue-900/50 border-blue-900 text-blue-200">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <AlertDescription>
                                Your website has been submitted for verification. Our AI agent will review your implementation soon.
                              </AlertDescription>
                            </Alert>
                          )}
                          <Button 
                            onClick={handleVerify}
                            disabled={!websiteUrl || verificationStatus === 'pending'}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-zinc-700 h-12 text-base font-medium"
                          >
                            <Globe className="mr-2 h-5 w-5" />
                            {verificationStatus === 'pending' ? 'Submitted for Verification' : 'Verify & Get Badge'}
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </div>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 