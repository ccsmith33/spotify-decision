import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PresentationPage } from '../components/presentation/PresentationPage';

// reveal.js touches DOM APIs that jsdom doesn't implement fully (e.g. getComputedStyle,
// requestAnimationFrame, various layout measurements). Stub it out so the component mounts.
vi.mock('reveal.js', () => {
  class Reveal {
    initialize() { return Promise.resolve(); }
    destroy() { /* noop */ }
  }
  return { default: Reveal };
});

vi.mock('reveal.js/dist/reveal.css', () => ({}));

describe('PresentationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mounts without crashing', () => {
    const { container } = render(<PresentationPage />);
    expect(container.querySelector('.reveal')).toBeInTheDocument();
    expect(container.querySelector('.slides')).toBeInTheDocument();
  });

  it('renders the title slide', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/Algorithmic Fairness/i)).toBeInTheDocument();
    expect(screen.getByText(/MIS 430/i)).toBeInTheDocument();
  });

  it('renders the agenda slide with all seven sections', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/Today's Agenda/i)).toBeInTheDocument();
    expect(screen.getByText(/Problem Space/i)).toBeInTheDocument();
    expect(screen.getByText(/Process Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Modeling/i)).toBeInTheDocument();
    expect(screen.getByText(/Prioritized Backlog/i)).toBeInTheDocument();
    expect(screen.getByText(/User Testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Final Prototype/i)).toBeInTheDocument();
  });

  it('renders the process phases slide', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/Phase 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 5/i)).toBeInTheDocument();
  });

  it('renders the data architecture slide with core entities', () => {
    render(<PresentationPage />);
    expect(screen.getAllByText(/Algorithm Decisions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Fairness Audits/i).length).toBeGreaterThan(0);
  });

  it('renders the ERD slide with an SVG diagram', () => {
    const { container } = render(<PresentationPage />);
    const erdSvg = container.querySelector('svg[data-testid="erd-diagram"]');
    expect(erdSvg).toBeInTheDocument();
    expect(screen.getByText(/Entity Relationship Diagram/i)).toBeInTheDocument();
  });

  it('renders the MoSCoW prioritized backlog slide', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/Must Have/i)).toBeInTheDocument();
    expect(screen.getByText(/Should Have/i)).toBeInTheDocument();
    expect(screen.getByText(/Could Have/i)).toBeInTheDocument();
  });

  it('renders the roadmap slide with version milestones and an SVG timeline', () => {
    const { container } = render(<PresentationPage />);
    expect(screen.getByText(/V1\.0/)).toBeInTheDocument();
    expect(screen.getByText(/V1\.5/)).toBeInTheDocument();
    expect(screen.getByText(/V2\.0/)).toBeInTheDocument();
    expect(screen.getByText(/V2\.1/)).toBeInTheDocument();
    expect(container.querySelector('svg[data-testid="roadmap-timeline"]')).toBeInTheDocument();
  });

  it('renders the user testing protocol slide with personas and tasks', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/Power User/i)).toBeInTheDocument();
    expect(screen.getByText(/Music-Focused/i)).toBeInTheDocument();
    expect(screen.getByText(/Casual User/i)).toBeInTheDocument();
  });

  it('renders the user testing results matrix with visual heatmap', () => {
    const { container } = render(<PresentationPage />);
    expect(screen.getByText(/Results Matrix/i)).toBeInTheDocument();
    const matrix = container.querySelector('[data-testid="testing-matrix"]');
    expect(matrix).toBeInTheDocument();
  });

  it('renders the portal features slide', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/What Made It Into V2\.1/i)).toBeInTheDocument();
  });

  it('renders the key takeaways slide', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/Key Takeaways/i)).toBeInTheDocument();
    expect(screen.getByText(/Ambiguity is a feature/i)).toBeInTheDocument();
  });

  it('renders the closing thank-you slide', () => {
    render(<PresentationPage />);
    expect(screen.getByText(/Thank You/i)).toBeInTheDocument();
  });

  it('renders 13 reveal.js sections', () => {
    const { container } = render(<PresentationPage />);
    const sections = container.querySelectorAll('.reveal .slides > section');
    expect(sections.length).toBe(13);
  });
});
