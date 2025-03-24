import { useState } from 'react';

type Mode = 'dark-plus' | 'dark' | 'light';

interface ModeSwitcherProps {
  onModeChange?: (mode: Mode) => void;
}

export const ModeSwitcher = ({ onModeChange }: ModeSwitcherProps) => {
  const [activeMode, setActiveMode] = useState<Mode>('dark-plus');

  const handleModeChange = (mode: Mode) => {
    setActiveMode(mode);
    onModeChange?.(mode);
  };

  return (
    <div className="mode-switcher">
      <div
        className={`mode-tab ${activeMode === 'dark-plus' ? 'active' : ''}`}
        onClick={() => handleModeChange('dark-plus')}
        data-mode="dark-plus"
      >
        <i className="fas fa-laugh-beam" style={{ color: '#00ff00' }} />
        <span>Default Dark Mode</span>
      </div>
      <div
        className={`mode-tab ${activeMode === 'dark' ? 'active' : ''}`}
        onClick={() => handleModeChange('dark')}
        data-mode="dark"
      >
        <i className="fas fa-meh" style={{ color: '#ffff00' }} />
        <span>Optional Dark Mode</span>
      </div>
      <div
        className={`mode-tab ${activeMode === 'light' ? 'active' : ''}`}
        onClick={() => handleModeChange('light')}
        data-mode="light"
      >
        <i className="fas fa-frown" style={{ color: '#ff0000' }} />
        <span>Light Mode</span>
      </div>
      <div className="mode-tab-slider" />
    </div>
  );
}; 