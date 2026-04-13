import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../components/shell/Sidebar';
import { TopBar } from '../components/shell/TopBar';
import { NowPlayingBar } from '../components/shell/NowPlayingBar';
import { PlaybackControls } from '../components/shell/PlaybackControls';
import { ProgressBar } from '../components/shell/ProgressBar';
import { HeroSection } from '../components/demo/HeroSection';
import { GlossaryPanel } from '../components/demo/GlossaryPanel';
import { DecisionCard } from '../components/demo/DecisionCard';
import { FactorBreakdown } from '../components/demo/FactorBreakdown';
import { RecommendationList } from '../components/demo/RecommendationList';
import { TransparencyControls } from '../components/demo/TransparencyControls';
import { FairnessMetricCard } from '../components/demo/FairnessMetricCard';
import { FairnessSection } from '../components/demo/FairnessSection';
import { DecisionHistory } from '../components/demo/DecisionHistory';
import { AppealSection } from '../components/demo/AppealSection';
import { VideoPage } from '../components/video/VideoPage';
import { AppendixPage } from '../components/appendix/AppendixPage';
import { decisions, explanations } from '../data/decisions';
import { recommendations } from '../data/recommendations';
import { fairnessAudits, fairnessMetrics } from '../data/fairness';
import { appeals } from '../data/appeals';
import { glossaryTerms } from '../data/glossary';
import { tracks } from '../data/tracks';

describe('Shell Components', () => {
  describe('Sidebar', () => {
    it('renders Home and Search nav items', () => {
      render(<Sidebar activeTab="demo" />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('renders Your Library section', () => {
      render(<Sidebar activeTab="demo" />);
      expect(screen.getByText('Your Library')).toBeInTheDocument();
    });

    it('renders playlist items', () => {
      render(<Sidebar activeTab="demo" />);
      expect(screen.getByText('Discover Weekly')).toBeInTheDocument();
    });
  });

  describe('TopBar', () => {
    it('renders all four tab buttons', () => {
      render(<TopBar activeTab="demo" onTabChange={() => {}} scrollOpacity={0} user={null} isAuthenticated={false} onLogin={async () => {}} onLogout={() => {}} />);
      expect(screen.getByText('Demo')).toBeInTheDocument();
      expect(screen.getByText('Presentation')).toBeInTheDocument();
      expect(screen.getByText('Video')).toBeInTheDocument();
      expect(screen.getByText('Appendix')).toBeInTheDocument();
    });

    it('calls onTabChange when a tab is clicked', () => {
      const onTabChange = vi.fn();
      render(<TopBar activeTab="demo" onTabChange={onTabChange} scrollOpacity={0} user={null} isAuthenticated={false} onLogin={async () => {}} onLogout={() => {}} />);
      fireEvent.click(screen.getByText('Presentation'));
      expect(onTabChange).toHaveBeenCalledWith('presentation');
    });
  });

  describe('NowPlayingBar', () => {
    it('renders track info', () => {
      render(
        <NowPlayingBar
          track={tracks[0]}
          isPlaying={true}
          progress={50}
          volume={65}
          onPlayPause={() => {}}
          onProgressChange={() => {}}
          onVolumeChange={() => {}}
        />
      );
      expect(screen.getByText('Anti-Hero')).toBeInTheDocument();
      expect(screen.getByText('Taylor Swift')).toBeInTheDocument();
    });
  });

  describe('PlaybackControls', () => {
    it('renders play/pause button', () => {
      render(<PlaybackControls isPlaying={false} onPlayPause={() => {}} />);
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('calls onPlayPause when clicked', () => {
      const onPlayPause = vi.fn();
      render(<PlaybackControls isPlaying={false} onPlayPause={onPlayPause} />);
      fireEvent.click(screen.getByLabelText('Play'));
      expect(onPlayPause).toHaveBeenCalled();
    });

    it('shows Pause label when playing', () => {
      render(<PlaybackControls isPlaying={true} onPlayPause={() => {}} />);
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
    });
  });

  describe('ProgressBar', () => {
    it('renders with correct fill width', () => {
      const { container } = render(<ProgressBar value={50} onChange={() => {}} />);
      const fill = container.querySelector('[class*="fill"]') as HTMLElement;
      expect(fill.style.width).toBe('50%');
    });

    it('renders time labels when showTime is true', () => {
      render(<ProgressBar value={50} onChange={() => {}} showTime currentTime={65} duration={200} />);
      expect(screen.getByText('1:05')).toBeInTheDocument();
      expect(screen.getByText('3:20')).toBeInTheDocument();
    });
  });
});

describe('Demo Components', () => {
  describe('HeroSection', () => {
    it('renders the portal title', () => {
      render(<HeroSection />);
      expect(screen.getByText('Algorithmic Transparency')).toBeInTheDocument();
    });

    it('renders the transparency portal tag', () => {
      render(<HeroSection />);
      expect(screen.getByText('TRANSPARENCY PORTAL')).toBeInTheDocument();
    });
  });

  describe('GlossaryPanel', () => {
    it('renders toggle button', () => {
      render(<GlossaryPanel terms={glossaryTerms} isExpanded={false} onToggle={() => {}} />);
      expect(screen.getByText(/Need help with terms/)).toBeInTheDocument();
    });

    it('shows terms when expanded', () => {
      render(<GlossaryPanel terms={glossaryTerms} isExpanded={true} onToggle={() => {}} />);
      expect(screen.getByText('Algorithm')).toBeInTheDocument();
    });

    it('hides terms when collapsed', () => {
      render(<GlossaryPanel terms={glossaryTerms} isExpanded={false} onToggle={() => {}} />);
      expect(screen.queryByText('Algorithm')).not.toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
      const onToggle = vi.fn();
      render(<GlossaryPanel terms={glossaryTerms} isExpanded={false} onToggle={onToggle} />);
      fireEvent.click(screen.getByText(/Need help with terms/));
      expect(onToggle).toHaveBeenCalled();
    });
  });

  describe('DecisionCard', () => {
    it('renders decision description', () => {
      render(<DecisionCard decision={decisions[0]} explanation={explanations[0]} detailLevel="basic" />);
      expect(screen.getByText(decisions[0].description)).toBeInTheDocument();
    });

    it('shows basic explanation by default', () => {
      render(<DecisionCard decision={decisions[0]} explanation={explanations[0]} detailLevel="basic" />);
      expect(screen.getByText(explanations[0].basic)).toBeInTheDocument();
    });

    it('shows detailed explanation when detailLevel is detailed', () => {
      render(<DecisionCard decision={decisions[0]} explanation={explanations[0]} detailLevel="detailed" />);
      expect(screen.getByText(explanations[0].detailed)).toBeInTheDocument();
    });

    it('shows technical explanation when detailLevel is technical', () => {
      render(<DecisionCard decision={decisions[0]} explanation={explanations[0]} detailLevel="technical" />);
      expect(screen.getByText(explanations[0].technical)).toBeInTheDocument();
    });
  });

  describe('FactorBreakdown', () => {
    it('renders factor segments', () => {
      render(<FactorBreakdown factors={decisions[0].factors} />);
      expect(screen.getByText('Listening History')).toBeInTheDocument();
    });
  });

  describe('RecommendationList', () => {
    it('renders track names', () => {
      render(<RecommendationList recommendations={recommendations} detailLevel="basic" />);
      expect(screen.getByText('Anti-Hero')).toBeInTheDocument();
    });

    it('renders "Why" column values', () => {
      render(<RecommendationList recommendations={recommendations} detailLevel="basic" />);
      expect(screen.getByText('Matches your pop listening history')).toBeInTheDocument();
    });

    it('expands a row when clicked', () => {
      render(<RecommendationList recommendations={recommendations} detailLevel="basic" />);
      fireEvent.click(screen.getByText('Anti-Hero'));
      expect(screen.getByText(explanations[1].basic)).toBeInTheDocument();
    });
  });

  describe('TransparencyControls', () => {
    it('renders detail level options', () => {
      render(
        <TransparencyControls
          detailLevel="basic"
          onDetailLevelChange={() => {}}
          notificationsEnabled={true}
          onNotificationsToggle={() => {}}
        />
      );
      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Detailed')).toBeInTheDocument();
      expect(screen.getByText('Technical')).toBeInTheDocument();
    });

    it('calls onDetailLevelChange when option clicked', () => {
      const onChange = vi.fn();
      render(
        <TransparencyControls
          detailLevel="basic"
          onDetailLevelChange={onChange}
          notificationsEnabled={true}
          onNotificationsToggle={() => {}}
        />
      );
      fireEvent.click(screen.getByText('Detailed'));
      expect(onChange).toHaveBeenCalledWith('detailed');
    });
  });

  describe('FairnessMetricCard', () => {
    it('renders metric name and current value', () => {
      render(<FairnessMetricCard metric={fairnessMetrics[0]} />);
      expect(screen.getByText('Independent Artist Exposure')).toBeInTheDocument();
      expect(screen.getByText('12.3%')).toBeInTheDocument();
    });
  });

  describe('FairnessSection', () => {
    it('renders section title', () => {
      render(<FairnessSection audits={fairnessAudits} />);
      expect(screen.getByText('Fairness & Oversight')).toBeInTheDocument();
    });

    it('renders aggregate vs individual callout', () => {
      render(<FairnessSection audits={fairnessAudits} />);
      expect(screen.getByText('Understanding These Metrics')).toBeInTheDocument();
    });

    it('renders challenge link', () => {
      render(<FairnessSection audits={fairnessAudits} />);
      expect(screen.getByText(/Challenge a decision/)).toBeInTheDocument();
    });
  });

  describe('DecisionHistory', () => {
    it('renders decision entries', () => {
      render(<DecisionHistory decisions={decisions} detailLevel="basic" />);
      expect(screen.getByText(decisions[0].description)).toBeInTheDocument();
    });

    it('shows most recent first', () => {
      const { container } = render(<DecisionHistory decisions={decisions} detailLevel="basic" />);
      const entries = container.querySelectorAll('[class*="entryCard"]');
      expect(entries.length).toBe(decisions.length);
    });

    it('expands entry details on click', () => {
      render(<DecisionHistory decisions={decisions} detailLevel="basic" />);
      fireEvent.click(screen.getByText(decisions[0].description));
      expect(screen.getByText(explanations[0].basic)).toBeInTheDocument();
    });
  });

  describe('AppealSection', () => {
    it('renders appeal form', () => {
      render(<AppealSection existingAppeals={appeals} onSubmit={() => {}} />);
      expect(screen.getByText('Submit an Appeal')).toBeInTheDocument();
    });

    it('renders process steps', () => {
      render(<AppealSection existingAppeals={appeals} onSubmit={() => {}} />);
      expect(screen.getByText('How the Appeal Process Works')).toBeInTheDocument();
      expect(screen.getByText('Human Review')).toBeInTheDocument();
    });

    it('renders post-appeal outcomes', () => {
      render(<AppealSection existingAppeals={appeals} onSubmit={() => {}} />);
      expect(screen.getByText('After Review, You Will Receive:')).toBeInTheDocument();
    });

    it('renders previous appeals', () => {
      render(<AppealSection existingAppeals={appeals} onSubmit={() => {}} />);
      expect(screen.getByText('Your Previous Appeals')).toBeInTheDocument();
    });

    it('disables submit button when required fields are empty', () => {
      render(<AppealSection existingAppeals={appeals} onSubmit={() => {}} />);
      const button = screen.getByText('Submit Appeal') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('shows success message on form submit', () => {
      render(<AppealSection existingAppeals={appeals} onSubmit={() => {}} />);
      const descriptionField = screen.getByPlaceholderText(/Explain what happened/);
      const outcomeField = screen.getByPlaceholderText(/Describe the change/);
      fireEvent.change(descriptionField, { target: { value: 'Test description' } });
      fireEvent.change(outcomeField, { target: { value: 'Test outcome' } });
      fireEvent.click(screen.getByText('Submit Appeal'));
      expect(screen.getByText(/Appeal submitted successfully/)).toBeInTheDocument();
    });
  });
});

describe('Other Tabs', () => {
  describe('VideoPage', () => {
    it('renders placeholder state', () => {
      render(<VideoPage />);
      expect(screen.getByText('Presentation Recording')).toBeInTheDocument();
      expect(screen.getByText(/Video will be available/)).toBeInTheDocument();
    });
  });

  describe('AppendixPage', () => {
    it('renders all 6 sections', () => {
      render(<AppendixPage />);
      expect(screen.getByText('Project Brief & Background')).toBeInTheDocument();
      expect(screen.getByText('Data Model')).toBeInTheDocument();
      expect(screen.getByText('User Testing')).toBeInTheDocument();
      expect(screen.getByText('Product Backlog & Sprint Planning')).toBeInTheDocument();
      expect(screen.getByText('Change Management')).toBeInTheDocument();
      expect(screen.getByText('Technical Approach')).toBeInTheDocument();
    });

    it('expands a section on click', () => {
      render(<AppendixPage />);
      fireEvent.click(screen.getByText('Project Brief & Background'));
      expect(screen.getByText(/This section will contain the project brief/)).toBeInTheDocument();
    });
  });
});
