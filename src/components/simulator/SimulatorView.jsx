import React from 'react';
import { AvatarVisualizer } from './AvatarVisualizer';
import { TranscriptStream } from './TranscriptStream';
import { SpeechControls } from './SpeechControls';
import { useSimulator } from '../../context/SimulatorContext';

export const SimulatorView = () => {
  const { selectedScenario } = useSimulator();

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: 'calc(100vh - 160px)' }}>
      
      {/* Simulation Layout: Sidebar Avatar Visualizer + Main Transcript Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        
        {/* Left Column: AI Avatar Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <AvatarVisualizer />
        </div>

        {/* Right Column: Dialogue Stream */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TranscriptStream />
        </div>

      </div>

      {/* Bottom Fixed/Sticky Speech Controls Panel */}
      <SpeechControls />

    </div>
  );
};
