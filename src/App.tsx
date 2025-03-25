import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmbedPage from "./pages/embed";
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const queryClient = new QueryClient();


const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchFirestoreData() {
  const querySnapshot = await getDocs(collection(db, 'theme_analysis'));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

async function fetchLogo(website) {
  try {
    // Try fetching with no-cors mode first
    const response = await fetch(`https://logo.clearbit.com/${website}`, {
      mode: 'no-cors',
      headers: {
        'Accept': 'image/webp,image/*,*/*'
      }
    });
    
    if (response.type === 'opaque' || response.ok) {
      return `https://logo.clearbit.com/${website}`;
    }
  } catch (error) {
    console.warn(`Failed to fetch logo for ${website}:`, error);
  }
  
  // Fallback to favicon
  try {
    return `https://${website}/favicon.ico`;
  } catch {
    // If all fails, return null
    return null;
  }
}

const App = () => {
  const [dataWithLogos, setDataWithLogos] = useState([]);

  useEffect(() => {
    const getDataWithLogos = async () => {
      const data = await fetchFirestoreData();
      const enrichedData = await Promise.all(
        data.map(async (item) => {
          try {
            const hostname = new URL(item.website).hostname;
            const logoUrl = await fetchLogo(hostname);
            return { 
              ...item, 
              logoUrl: logoUrl || '/placeholder-logo.png' // Fallback to a placeholder if no logo found
            };
          } catch (error) {
            console.warn(`Error processing ${item.website}:`, error);
            return { 
              ...item, 
              logoUrl: '/placeholder-logo.png'  // Use placeholder for invalid URLs
            };
          }
        })
      );
      setDataWithLogos(enrichedData);
    };

    getDataWithLogos();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index data={dataWithLogos} />} />
            <Route path="/embed" element={<EmbedPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
