import { useEffect, useState } from 'react';
import { Zap, X } from 'lucide-react';
import { MarqueeDemo } from "@/components/MarqueeDemo"
import { ScreenshotPopup } from "@/components/ScreenshotPopup"
import { DarkModeTutorial } from "@/components/DarkModeTutorial"

// Interface for data from Firestore
interface FirestoreData {
  id: string;
  analyzed_at: string;
  has_dark_mode: boolean;
  is_default: boolean;
  notes: string;
  screenshot: string | null;
  website: string;
}

// Interface for ScreenshotPopup
interface PopupData {
  website: string;
  analyzed_at: string;
  has_dark_mode: boolean;
  is_default: boolean;
  notes: string;
  screenshot: string | null;
}

// Update the keyframes animation to use yellow glow
const keyframes = `
  @keyframes pulse {
    0% {
      opacity: 1;
      filter: drop-shadow(0 0 15px #ffd700);
    }
    50% {
      opacity: 0.7;
      filter: drop-shadow(0 0 30px #ffd700);
    }
    100% {
      opacity: 1;
      filter: drop-shadow(0 0 15px #ffd700);
    }
  }
`;

const styles = {
  body: {
    margin: 0,
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  container: {
    position: 'relative',
    backgroundColor: '#000000',
    zIndex: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
  },
  title: {
    position: 'relative',
    color: '#ffffff',
    fontSize: '2.75rem',
    fontWeight: 'bold',
    marginBottom: '15rem',
  },
  progressLineContainer: {
    position: 'relative',
    width: '75%',
    height: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
    marginTop: '-10rem',
  },
  progressLine: {
    position: 'relative',
    width: '40%',
    height: '100%',
    backgroundColor: '#54f5a2',
  },
  progressExtension: {
    position: 'absolute',
    left: '40%',
    width: '8%',
    top: '0',
    height: '100%',
    backgroundColor: '#54f5a2',
    boxShadow: '0 0 10px #54f5a2, 0 0 20px #54f5a2',
  },
  leftLightning: {
    position: 'absolute',
    top: '50%',
    left: '-120px',
    transform: 'translateY(-50%)',
    color: '#ffd700',
    animation: 'pulse 2s infinite',
    zIndex: 20,
    filter: 'drop-shadow(0 0 20px #ffd700)',
  },
  rightLightning: {
    position: 'absolute',
    top: '50%',
    right: '-120px',
    transform: 'translateY(-50%)',
    color: '#ffffff',
    zIndex: 20,
    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
  },
  progressPoint: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: '8px',
    height: '8px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
  },
  progressPointEnd: {
    position: 'absolute',
    top: '50%',
    left: '48%',
    transform: 'translate(-50%, -50%)',
    width: '8px',
    height: '8px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
  },
  percentageLabel: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    left: '40%',
    transform: 'translateX(-50%)',
    width: '100px',
  },
  dateLabel: {
    fontSize: '16px',
    fontWeight: 400,
    opacity: 0.8,
    position: 'absolute',
    top: '-30px',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  percentValue: {
    fontSize: '32px',
    fontWeight: 500,
    position: 'absolute',
    top: '20px',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  todayLabel: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    left: '48%',
    transform: 'translateX(-50%)',
    width: '100px',
  },
  goalSection: {
    marginTop: '4rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    color: '#fff',
  },
  goalTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '2rem',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    WebkitBackgroundClip: 'text',
    color: '#54f5a2',
  },
  metricsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '4rem',
  },
  metricCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    minWidth: '200px',
  },
  metricIcon: {
    width: '28px',
    height: '28px',
    margin: '0.15rem auto',
    padding: '5px',
    background: 'rgba(84, 245, 162, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 600,
    color: '#54f5a2',
    marginBottom: '0.1rem',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  equalsSign: {
    fontSize: '32px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 2rem',
  },
  modeSwitcher: {
    marginTop: '2rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '6px',
    display: 'inline-flex',
    gap: '4px',
    position: 'relative',
  },
  modeTab: {
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  modeTabActive: {
    color: 'rgba(255, 255, 255, 1)',
  },
  logosSection: {
    position: 'fixed',
    bottom: '2rem',
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    overflow: 'hidden',
  },
  productHuntBadge: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    background: 'white',
    padding: '1.25rem 1.75rem',
    borderRadius: '12px',
    marginBottom: '15rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  badgeIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#54f5a2',
  },
  badgeText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  badgeLabel: {
    fontSize: '0.55rem',
    color: '#888',
    fontWeight: '500',
  },
  badgeTitle: {
    fontSize: '1.25rem',
    color: '#000',
    fontWeight: '600',
  },
  applyButton: {
    fontSize: '1.5rem',
    color: '#ffffff',
    fontWeight: 500,
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: '"Space Grotesk", sans-serif',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, #54f5a2, #00ff00)',
    padding: '1rem 2rem',
    borderRadius: '8px',
    transition: 'transform 0.2s ease-in-out',
  } as const,
} as const;

const Index = ({ data }: { data: FirestoreData[] }) => {
  const [activeMode, setActiveMode] = useState<'dark' | 'light'>('dark');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<PopupData | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Calculate progress percentages
  const calculateProgress = () => {
    if (!data.length) return { currentPercentage: 0 };
    
    const totalSites = data.length;
    const sitesWithDarkMode = data.filter(site => site.has_dark_mode).length;
    
    return {
      currentPercentage: Math.round((sitesWithDarkMode / totalSites) * 100)
    };
  };

  const progress = calculateProgress();
  const goalPercentage = 10; // January 2025 goal

  useEffect(() => {
    // Handle URL parameters for direct popup access
    const urlParams = new URLSearchParams(window.location.search);
    const websiteParam = urlParams.get('website');
    
    if (websiteParam) {
      try {
        const decodedData = JSON.parse(atob(websiteParam));
        setSelectedWebsite(decodedData);
        setShowPopup(true);
      } catch (error) {
        console.error('Invalid website data in URL');
      }
    }

    // Add the keyframes to the document
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    // Add font awesome CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(link);

    // Add Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap';
    document.head.appendChild(fontLink);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link);
      document.head.removeChild(fontLink);
    };
  }, []);

  const handleLogoClick = (website: string) => {
    const websiteData = data.find(item => item.website === website);
    if (websiteData) {
      setSelectedWebsite({
        website: websiteData.website,
        analyzed_at: websiteData.analyzed_at,
        has_dark_mode: websiteData.has_dark_mode,
        is_default: websiteData.is_default,
        notes: websiteData.notes,
        screenshot: websiteData.screenshot
      });
      setShowPopup(true);
    }
  };

  const handleTutorialComplete = (websiteUrl: string) => {
    console.log('Tutorial completed for:', websiteUrl);
  };

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div 
        onClick={() => setShowTutorial(true)}
        style={styles.applyButton}
        className="hover:scale-105"
      >
        Apply Today
      </div>

      <div style={styles.productHuntBadge} onClick={() => setShowPopup(true)} className="cursor-pointer hover:opacity-90 transition-opacity">
        <div style={styles.badgeIcon}>
          <i className="fas fa-leaf" style={{ fontSize: '36px' }}></i>
        </div>
        <div style={styles.badgeText}>
          <div style={styles.badgeTitle}>Environment Friendly</div>
          <div style={styles.badgeLabel}>DARKMODENOW.COM</div>
        </div>
      </div>

      <div style={styles.progressLineContainer}>
        <div style={{
          ...styles.progressLine,
          width: `${goalPercentage}%`
        }} />
        <div 
          style={{
            ...styles.progressExtension,
            left: `${goalPercentage}%`,
            width: `${progress.currentPercentage - goalPercentage}%`
          }} 
        />
        <Zap style={styles.leftLightning} size={96} strokeWidth={2.5} />
        <Zap style={styles.rightLightning} size={96} strokeWidth={2.5} />
        <div style={{
          ...styles.progressPoint,
          left: `${goalPercentage}%`
        }}>
          <div style={styles.percentageLabel}>
            <span style={styles.dateLabel}>Jan 2025</span>
            <span style={styles.percentValue}>{goalPercentage}%</span>
          </div>
        </div>
        <div style={{
          ...styles.progressPointEnd,
          left: `${progress.currentPercentage}%`
        }}>
          <div style={styles.todayLabel}>
            <span style={styles.dateLabel}>Today</span>
            <span style={styles.percentValue}>{progress.currentPercentage}%</span>
          </div>
        </div>
      </div>

      <div style={styles.goalSection}>
        <h1 style={styles.goalTitle}>The Goal</h1>
        
        <div style={styles.metricsContainer}>
          <div style={styles.metricCard}>
            <div style={styles.metricIcon}>
              <i className="fas fa-tree" style={{ fontSize: '24px', color: '#54f5a2' }}></i>
            </div>
            <div style={styles.metricValue}>28.5M</div>
            <div style={styles.metricLabel}>Metric Tons CO₂ Reduction</div>
          </div>

          <div style={styles.equalsSign}>=</div>

          <div style={styles.metricCard}>
            <div style={styles.metricIcon}>
              <i className="fas fa-car" style={{ fontSize: '24px', color: '#54f5a2' }}></i>
            </div>
            <div style={styles.metricValue}>6.2M</div>
            <div style={styles.metricLabel}>Cars Removed</div>
          </div>

          <div style={styles.equalsSign}>=</div>

          <div style={styles.metricCard}>
            <div style={styles.metricIcon}>
              <i className="fas fa-lightbulb" style={{ fontSize: '24px', color: '#54f5a2' }}></i>
            </div>
            <div style={styles.metricValue}>102.7M</div>
            <div style={styles.metricLabel}>Lightbulbs</div>
          </div>
        </div>

        <div style={styles.modeSwitcher}>
          <button
            style={{ ...styles.modeTab, ...(activeMode === 'dark' ? styles.modeTabActive : {}) }}
            onClick={() => setActiveMode('dark')}
          >
            <i className="fas fa-moon" style={{ color: '#54f5a2' }}></i>
            <span>Dark Mode</span>
          </button>
          <button
            style={{ ...styles.modeTab, ...(activeMode === 'light' ? styles.modeTabActive : {}) }}
            onClick={() => setActiveMode('light')}
          >
            <i className="fas fa-sun" style={{ color: '#ff6b6b' }}></i>
            <span>Light Mode</span>
          </button>
        </div>
        <MarqueeDemo 
          data={data.map(item => ({
            website: item.website,
            logoUrl: `https://logo.clearbit.com/${item.website}`,
            has_dark_mode: item.has_dark_mode,
            is_default: item.is_default
          }))}
          activeMode={activeMode}
          onLogoClick={handleLogoClick}
        />
      </div>

      <DarkModeTutorial 
        open={showTutorial} 
        onOpenChange={setShowTutorial}
        onComplete={handleTutorialComplete}
      />

      {showPopup && selectedWebsite && (
        <ScreenshotPopup
          open={showPopup}
          onOpenChange={setShowPopup}
          websiteData={selectedWebsite}
        />
      )}
    </div>
  );
};

export default Index;