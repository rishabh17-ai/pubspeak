import React from 'react';
import { SimulatorProvider, useSimulator } from './context/SimulatorContext';
import { ShellLayout } from './components/layout/ShellLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScenarioSelectionView } from './components/scenarios/ScenarioSelectionView';
import { PracticeRoomView } from './components/room/PracticeRoomView';
import { PracticeSetupView } from './components/setup/PracticeSetupView';
import { ResultsView } from './components/results/ResultsView';
import { ProgressProfileView } from './components/profile/ProgressProfileView';
import { AudienceSetupView } from './components/audience/AudienceSetupView';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Runtime Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#f8fafc' }}>
          <h2>Something went wrong displaying this view.</h2>
          <p style={{ color: '#94a3b8', margin: '1rem 0' }}>{this.state.error?.toString()}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ScreenRouter = () => {
  const { currentStep } = useSimulator();

  switch (currentStep) {
    case 'DASHBOARD':
      return <DashboardView />;
    case 'SCENARIO_SELECTION':
      return <ScenarioSelectionView />;
    case 'PRACTICE_SETUP':
      return <PracticeSetupView />;
    case 'PRACTICE_ROOM':
      return <PracticeRoomView />;
    case 'RESULTS_SCREEN':
      return <ResultsView />;
    case 'PROFILE':
      return <ProgressProfileView />;
    case 'AUDIENCE_SETUP':
      return <AudienceSetupView />;
    default:
      return <DashboardView />;
  }
};

export function App() {
  return (
    <ErrorBoundary>
      <SimulatorProvider>
        <ShellLayout>
          <ScreenRouter />
        </ShellLayout>
      </SimulatorProvider>
    </ErrorBoundary>
  );
}

export default App;

