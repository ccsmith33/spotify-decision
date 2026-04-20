import { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import {
  SearchCode,
  Scale,
  Users,
  ClipboardCheck,
  UserCircle,
  Target,
  ListChecks,
  Database,
  Briefcase,
  FlaskConical,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Music2,
  Eye,
  ShieldCheck,
  History,
  Hand,
  User,
  UserMinus,
  Headphones,
  Calendar,
  BarChart3,
  Lightbulb,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  FileText,
  Network,
  FileBarChart,
  Megaphone,
  PlayCircle,
  Rocket,
  Globe,
  AlertTriangle,
  Building2,
  Code2,
  Mic2,
} from 'lucide-react';
import styles from './PresentationPage.module.css';

const GREEN = '#1DB954';
const RED = '#E22134';

const matrixRows = [
  { task: 'Orientation', scores: [5, 5, 3] },
  { task: 'Explanation', scores: [5, 4, 2] },
  { task: 'Fairness', scores: [5, 4, 2] },
  { task: 'Appeal', scores: [5, 5, 3] },
];

const personaShortCodes = ['P1', 'P2', 'P3'];

function heatColor(score: number): string {
  switch (score) {
    case 5:
      return GREEN;
    case 4:
      return `${GREEN}B3`;
    case 3:
      return `${GREEN}66`;
    case 2:
      return `${RED}80`;
    case 1:
      return RED;
    default:
      return '#555';
  }
}

const milestones = [
  { version: 'V1.0', date: 'Jan 2026' },
  { version: 'V1.5', date: 'Feb 2026' },
  { version: 'V2.0', date: 'Mar 2026' },
  { version: 'Current', date: 'Apr 2026', current: true },
];

export function PresentationPage() {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!deckRef.current) return;

    const deck = new Reveal(deckRef.current, {
      embedded: true,
      hash: false,
      controls: true,
      progress: true,
      transition: 'fade',
      transitionSpeed: 'default',
      backgroundTransition: 'fade',
      width: '100%',
      height: '100%',
      margin: 0,
      minScale: 1,
      maxScale: 1,
    });

    deck.initialize();

    return () => {
      deck.destroy();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className="reveal" ref={deckRef}>
        <div className="slides">
          {/* Slide 1: Title Slide */}
          <section>
            <div className={styles.titleSlide}>
              <p className={styles.courseTag}>
                <GraduationCap size={14} strokeWidth={2.5} />
                MIS 430 · Spring 2026
              </p>
              <h1 className={styles.titleLine}>Algorithmic Fairness &amp;</h1>
              <h1 className={styles.titleLineLast}>Transparency Portal</h1>
              <div className={styles.eqDivider} aria-hidden="true">
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
              <p className={styles.titleSubtitle}>
                Music Streaming Platform · Project Closeout Presentation
              </p>
              <p className={styles.titleTagline}>
                From ambiguous case to working prototype — a semester of iterative systems design
              </p>
              <div className={styles.titleMetaRow}>
                <p className={styles.titleMetaItem}>
                  <Calendar size={13} strokeWidth={2} />
                  April 2026
                </p>
                <p className={styles.titleMetaItem}>
                  <PlayCircle size={13} strokeWidth={2} />
                  Project Closeout
                </p>
                <p className={styles.titleMetaItem}>
                  <span className={styles.eqMotif} aria-hidden="true">
                    <span className={styles.eqBar} />
                    <span className={styles.eqBar} />
                    <span className={styles.eqBar} />
                    <span className={styles.eqBar} />
                  </span>
                  Now Presenting
                </p>
              </div>
            </div>
          </section>

          {/* Slide 2: Agenda */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>Today&apos;s Agenda</h2>
            <div className={styles.agendaGrid}>
              <div className={styles.agendaItem}>
                <div className={styles.agendaNumber}>01</div>
                <p className={styles.agendaLabel}>Why this problem is hard</p>
                <p className={styles.agendaHint}>The case, the challenge, the ambiguity</p>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.agendaNumber}>02</div>
                <p className={styles.agendaLabel}>Semester process recap</p>
                <p className={styles.agendaHint}>How semester assignments shaped the solution</p>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.agendaNumber}>03</div>
                <p className={styles.agendaLabel}>System data architecture</p>
                <p className={styles.agendaHint}>What the system needs behind the scenes</p>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.agendaNumber}>04</div>
                <p className={styles.agendaLabel}>MoSCoW feature ranking</p>
                <p className={styles.agendaHint}>MoSCoW prioritization &amp; sprint planning</p>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.agendaNumber}>05</div>
                <p className={styles.agendaLabel}>Usability study outcomes</p>
                <p className={styles.agendaHint}>What worked, what didn&apos;t, what we improved</p>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.agendaNumber}>06</div>
                <p className={styles.agendaLabel}>Change Management &amp; Rollout</p>
                <p className={styles.agendaHint}>Stakeholders, risks, and phased deployment</p>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.agendaNumber}>07</div>
                <p className={styles.agendaLabel}>Final Prototype &amp; reflections</p>
                <p className={styles.agendaHint}>The portal and closing thoughts</p>
              </div>
              <div className={`${styles.agendaItem} ${styles.agendaItemCTA}`}>
                <div className={styles.agendaCTAInner}>
                  <ArrowRight size={24} strokeWidth={2.2} />
                  <p className={styles.agendaCTALabel}>Let&apos;s Begin</p>
                </div>
              </div>
            </div>
          </section>

          {/* Slide 3: Problem Space */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>01 | Problem Space &amp; Project Background</h2>
            <div className={styles.problemLayout}>
              <div className={styles.problemLeft}>
                <h3>The Case</h3>
                <p>
                  A large consumer digital platform faces mounting pressure around AI transparency.
                  Automated systems determine: which content users see, how requests are prioritized,
                  and who gets access to opportunities.
                </p>
                <p>
                  The problem was intentionally open-ended. No consensus existed on what transparency
                  should look like, how fairness should be defined, or what role humans should play.
                </p>
              </div>
              <div>
                <h3>Key Tensions We Had to Resolve</h3>
                <div className={styles.tensionsStack}>
                  <div className={styles.tensionChip}>
                    <span className={styles.tensionIcon}>
                      <SearchCode size={16} strokeWidth={2} />
                    </span>
                    <span>Transparency vs. IP protection</span>
                  </div>
                  <div className={styles.tensionChip}>
                    <span className={styles.tensionIcon}>
                      <Users size={16} strokeWidth={2} />
                    </span>
                    <span>User trust vs. org risk</span>
                  </div>
                  <div className={styles.tensionChip}>
                    <span className={styles.tensionIcon}>
                      <Scale size={16} strokeWidth={2} />
                    </span>
                    <span>Fairness vs. algorithm performance</span>
                  </div>
                  <div className={styles.tensionChip}>
                    <span className={styles.tensionIcon}>
                      <ClipboardCheck size={16} strokeWidth={2} />
                    </span>
                    <span>Accountability vs. complexity</span>
                  </div>
                  <div className={styles.tensionChip}>
                    <span className={styles.tensionIcon}>
                      <UserCircle size={16} strokeWidth={2} />
                    </span>
                    <span>Individual vs. aggregate metrics</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.roleCallout}>
              <span className={styles.roleCalloutTag}>Our role</span>
              <p className={styles.roleCalloutText}>
                Analyze the problem space, gather requirements, and design a system that balances
                org goals, ethics, and user needs.
              </p>
            </div>
          </section>

          {/* Slide 4: Process Overview */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>02 | Process Overview</h2>
            <p className={styles.italicLead}>
              How semester assignments shaped our final solution
            </p>
            <div className={styles.phaseFlow}>
              <div className={styles.phaseNode}>
                <div className={styles.phaseCircle}>
                  <Target size={18} strokeWidth={2.2} />
                </div>
                <p className={styles.phaseLabel}>Phase 1: Problem Definition</p>
                <p className={styles.phaseDesc}>
                  Fairness, trust, and transparency from multiple stakeholder views
                </p>
              </div>
              <div className={styles.phaseNode}>
                <div className={styles.phaseCircle}>
                  <ListChecks size={18} strokeWidth={2.2} />
                </div>
                <p className={styles.phaseLabel}>Phase 2: Backlog &amp; Prioritization</p>
                <p className={styles.phaseDesc}>
                  Must-haves: explanations, fairness metrics, appeals
                </p>
              </div>
              <div className={styles.phaseNode}>
                <div className={styles.phaseCircle}>
                  <Database size={18} strokeWidth={2.2} />
                </div>
                <p className={styles.phaseLabel}>Phase 3: System Data Design</p>
                <p className={styles.phaseDesc}>
                  Backend structure for decisions, audits, appeals
                </p>
              </div>
              <div className={styles.phaseNode}>
                <div className={styles.phaseCircle}>
                  <Briefcase size={18} strokeWidth={2.2} />
                </div>
                <p className={styles.phaseLabel}>Phase 4: Change Management</p>
                <p className={styles.phaseDesc}>
                  Phased rollout with stakeholder engagement and risk mitigation
                </p>
              </div>
              <div className={styles.phaseNode}>
                <div className={`${styles.phaseCircle} ${styles.phaseCircleActive}`}>
                  <FlaskConical size={18} strokeWidth={2.2} />
                </div>
                <p className={styles.phaseLabel}>Phase 5: Usability Validation</p>
                <p className={styles.phaseDesc}>
                  Validated with 3 users; 100% task completion
                </p>
              </div>
            </div>
            <div className={styles.insightCallout}>
              <Lightbulb size={18} strokeWidth={2.2} color="#1ed760" style={{ flexShrink: 0 }} />
              <p className={styles.insightCalloutText}>
                Key insight: Every assignment fed into the next — we were never just building
                deliverables, we were building understanding.
              </p>
            </div>
          </section>

          {/* Slide 5: Data Modeling & Architecture */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>03 | Data Modeling &amp; Architecture</h2>
            <p className={styles.italicLead}>
              Key Design Decision: Separate system functionality from transparency features
            </p>
            <div className={styles.entityGrid}>
              <div className={styles.entityCard}>
                <span className={styles.entityIcon}>
                  <Network size={18} strokeWidth={2} />
                </span>
                <div className={styles.entityBodyWrap}>
                  <p className={styles.entityTitle}>Algorithm Decisions</p>
                  <p className={styles.entityBody}>
                    Tracks not just what content is shown, but how and why decisions are made. Exists
                    independently from recommendations.
                  </p>
                </div>
              </div>
              <div className={styles.entityCard}>
                <span className={styles.entityIcon}>
                  <MessageSquare size={18} strokeWidth={2} />
                </span>
                <div className={styles.entityBodyWrap}>
                  <p className={styles.entityTitle}>Explanations</p>
                  <p className={styles.entityBody}>
                    Stores different explanation tiers for user-facing transparency without exposing
                    proprietary algorithm logic.
                  </p>
                </div>
              </div>
              <div className={styles.entityCard}>
                <span className={styles.entityIcon}>
                  <ShieldCheck size={18} strokeWidth={2} />
                </span>
                <div className={styles.entityBodyWrap}>
                  <p className={styles.entityTitle}>Fairness Audits</p>
                  <p className={styles.entityBody}>
                    Enables monitoring for bias — especially major-label vs. independent artist
                    visibility disparities.
                  </p>
                </div>
              </div>
              <div className={styles.entityCard}>
                <span className={styles.entityIcon}>
                  <BarChart3 size={18} strokeWidth={2} />
                </span>
                <div className={styles.entityBodyWrap}>
                  <p className={styles.entityTitle}>Interactions</p>
                  <p className={styles.entityBody}>
                    Supports analysis of how engagement-driven algorithms influence recommendation
                    outcomes.
                  </p>
                </div>
              </div>
              <div className={styles.entityCard}>
                <span className={styles.entityIcon}>
                  <Hand size={18} strokeWidth={2} />
                </span>
                <div className={styles.entityBodyWrap}>
                  <p className={styles.entityTitle}>Appeals</p>
                  <p className={styles.entityBody}>
                    Represents human-in-the-loop processes. Users can challenge automated decisions,
                    improving accountability.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.dataModelCallout}>
              <p className={styles.dataModelCalloutText}>
                The data model gave the website its structure: recommendation transparency, fairness
                metrics, decision history, and appeals — not one vague &ldquo;AI info&rdquo; page.
              </p>
            </div>
          </section>

          {/* Slide 6: Data Model ERD */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>04 | Data Model — Entity Relationship Diagram</h2>
            <div className={styles.erdPanel}>
              <div className={styles.erdPanelHeader}>
                <Database size={14} strokeWidth={2.2} color="#1ed760" />
                <p className={styles.erdPanelTitle}>Schema Overview</p>
              </div>
              <svg
                data-testid="erd-diagram"
                viewBox="0 0 900 460"
                className={styles.erdSvg}
              >
                {/* users */}
                <g>
                  <rect x="30" y="180" width="130" height="70" rx="4" className={styles.erdBox} />
                  <text x="95" y="205" textAnchor="middle" className={styles.erdTitle}>users</text>
                  <text x="95" y="225" textAnchor="middle" className={styles.erdField}>id, email</text>
                  <text x="95" y="240" textAnchor="middle" className={styles.erdField}>preferences</text>
                </g>
                {/* interactions */}
                <g>
                  <rect x="30" y="40" width="130" height="70" rx="4" className={styles.erdBox} />
                  <text x="95" y="65" textAnchor="middle" className={styles.erdTitle}>interactions</text>
                  <text x="95" y="85" textAnchor="middle" className={styles.erdField}>id, user_id</text>
                  <text x="95" y="100" textAnchor="middle" className={styles.erdField}>event, ts</text>
                </g>
                {/* decisions */}
                <g>
                  <rect x="250" y="180" width="130" height="70" rx="4" className={styles.erdBox} />
                  <text x="315" y="205" textAnchor="middle" className={styles.erdTitle}>decisions</text>
                  <text x="315" y="225" textAnchor="middle" className={styles.erdField}>id, user_id</text>
                  <text x="315" y="240" textAnchor="middle" className={styles.erdField}>why, factors</text>
                </g>
                {/* explanations */}
                <g>
                  <rect x="470" y="100" width="130" height="70" rx="4" className={styles.erdBox} />
                  <text x="535" y="125" textAnchor="middle" className={styles.erdTitle}>explanations</text>
                  <text x="535" y="145" textAnchor="middle" className={styles.erdField}>id, decision_id</text>
                  <text x="535" y="160" textAnchor="middle" className={styles.erdField}>tier, text</text>
                </g>
                {/* appeals */}
                <g>
                  <rect x="470" y="260" width="130" height="70" rx="4" className={styles.erdBox} />
                  <text x="535" y="285" textAnchor="middle" className={styles.erdTitle}>appeals</text>
                  <text x="535" y="305" textAnchor="middle" className={styles.erdField}>id, decision_id</text>
                  <text x="535" y="320" textAnchor="middle" className={styles.erdField}>status, sla</text>
                </g>
                {/* fairness_metrics */}
                <g>
                  <rect x="700" y="100" width="160" height="70" rx="4" className={styles.erdBox} />
                  <text x="780" y="125" textAnchor="middle" className={styles.erdTitle}>fairness_metrics</text>
                  <text x="780" y="145" textAnchor="middle" className={styles.erdField}>id, name</text>
                  <text x="780" y="160" textAnchor="middle" className={styles.erdField}>current, target</text>
                </g>
                {/* audit_logs */}
                <g>
                  <rect x="700" y="260" width="160" height="70" rx="4" className={styles.erdBox} />
                  <text x="780" y="285" textAnchor="middle" className={styles.erdTitle}>audit_logs</text>
                  <text x="780" y="305" textAnchor="middle" className={styles.erdField}>id, metric_id</text>
                  <text x="780" y="320" textAnchor="middle" className={styles.erdField}>captured_at</text>
                </g>

                {/* relationships */}
                <line x1="95" y1="110" x2="95" y2="180" className={styles.erdEdge} />
                <text x="105" y="150" className={styles.erdCardinality}>1..*</text>

                <line x1="160" y1="215" x2="250" y2="215" className={styles.erdEdge} />
                <text x="185" y="210" className={styles.erdCardinality}>1..*</text>

                <line x1="380" y1="205" x2="470" y2="140" className={styles.erdEdge} />
                <text x="405" y="170" className={styles.erdCardinality}>1..*</text>

                <line x1="380" y1="230" x2="470" y2="290" className={styles.erdEdge} />
                <text x="395" y="275" className={styles.erdCardinality}>0..*</text>

                <line x1="600" y1="135" x2="700" y2="135" className={styles.erdEdge} />
                <line x1="780" y1="170" x2="780" y2="260" className={styles.erdEdge} />
                <text x="790" y="220" className={styles.erdCardinality}>1..*</text>
              </svg>
            </div>
          </section>

          {/* Slide 7: Prioritized Backlog */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>05 | Prioritized Backlog</h2>
            <div className={styles.backlogGrid}>
              <div className={`${styles.backlogColumn} ${styles.backlogColumnP0}`}>
                <div className={styles.backlogHead}>
                  <AlertCircle size={16} strokeWidth={2.2} color="#1DB954" />
                  <p className={`${styles.backlogHeadLabel} ${styles.backlogHeadP0}`}>Must Have</p>
                  <span className={`${styles.backlogTier} ${styles.backlogTierP0}`}>P0</span>
                </div>
                <ul className={styles.backlogItems}>
                  <li>Recommendations Transparency — users understand what content they see and basic why</li>
                  <li>Plain-Language Explanations — avoid technical jargon; explain in natural language</li>
                  <li>Fairness &amp; Oversight — current metrics with targets, real-time monitoring</li>
                  <li>Decision History — users can review log of decisions affecting their experience</li>
                  <li>Appeal &amp; Review Process — structured challenge mechanism with SLA and human review</li>
                </ul>
              </div>
              <div className={`${styles.backlogColumn} ${styles.backlogColumnP1}`}>
                <div className={styles.backlogHead}>
                  <TrendingUp size={16} strokeWidth={2.2} color="#ffa42b" />
                  <p className={`${styles.backlogHeadLabel} ${styles.backlogHeadP1}`}>Should Have</p>
                  <span className={`${styles.backlogTier} ${styles.backlogTierP1}`}>P1</span>
                </div>
                <ul className={styles.backlogItems}>
                  <li>Detailed Audit Trail — deeper fairness analytics and trend analysis</li>
                  <li>Multi-Tier Explanation Levels — technical/casual/detailed explanation options</li>
                  <li>Appeal History — users can revisit past appeals</li>
                </ul>
              </div>
              <div className={`${styles.backlogColumn} ${styles.backlogColumnP2}`}>
                <div className={styles.backlogHead}>
                  <Sparkles size={16} strokeWidth={2.2} color="#a7a7a7" />
                  <p className={`${styles.backlogHeadLabel} ${styles.backlogHeadP2}`}>Could Have</p>
                  <span className={`${styles.backlogTier} ${styles.backlogTierP2}`}>P2</span>
                </div>
                <ul className={styles.backlogItems}>
                  <li>Personalized Recommendation Factors — user-specific weight explainers</li>
                  <li>Real-Time Bias Alerts — proactive notification system</li>
                  <li>Community Fairness Voting — users rate perceived fairness</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Slide 8: Prototype Roadmap */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>06 | Prototype Roadmap</h2>
            <div className={styles.roadmapPanel}>
              <svg
                data-testid="roadmap-timeline"
                viewBox="0 0 800 160"
                className={styles.roadmapSvg}
              >
                <defs>
                  <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={GREEN} stopOpacity="0.3" />
                    <stop offset="50%" stopColor={GREEN} stopOpacity="1" />
                    <stop offset="100%" stopColor="#1ed760" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <line x1="60" y1="70" x2="740" y2="70" stroke="url(#timelineGradient)" strokeWidth="3" />
                {milestones.map((m, i) => {
                  const cx = 60 + (680 / (milestones.length - 1)) * i;
                  return (
                    <g key={m.version}>
                      {m.current ? (
                        <>
                          <circle cx={cx} cy={70} r="18" fill={GREEN} opacity="0.25" />
                          <circle cx={cx} cy={70} r="12" fill={GREEN} stroke="#1ed760" strokeWidth="3" />
                        </>
                      ) : (
                        <circle cx={cx} cy={70} r="9" fill="#121212" stroke={GREEN} strokeWidth="3" />
                      )}
                      <text x={cx} y={40} textAnchor="middle" className={styles.roadmapVersion}>
                        {m.version}
                      </text>
                      <text x={cx} y={108} textAnchor="middle" className={styles.roadmapDate}>
                        {m.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className={styles.roadmapDetails}>
              <div className={styles.roadmapCard}>
                <p className={styles.roadmapCardLabel}>Foundation</p>
                <ul className={styles.roadmapList}>
                  <li>Basic recommendation transparency</li>
                  <li>Static fairness metrics</li>
                  <li>Simple appeal form</li>
                </ul>
              </div>
              <div className={styles.roadmapCard}>
                <p className={styles.roadmapCardLabel}>Clarity</p>
                <ul className={styles.roadmapList}>
                  <li>Plain-language explanations</li>
                  <li>Improved UI</li>
                  <li>Decision history tab</li>
                </ul>
              </div>
              <div className={styles.roadmapCard}>
                <p className={styles.roadmapCardLabel}>Depth</p>
                <ul className={styles.roadmapList}>
                  <li>Fairness audit dashboard</li>
                  <li>Multi-tier explanations</li>
                  <li>Usability study prep</li>
                </ul>
              </div>
              <div className={styles.roadmapCardCurrent}>
                <p className={styles.roadmapCardLabel}>Current Build</p>
                <ul className={styles.roadmapList}>
                  <li>Participant feedback iterations</li>
                  <li>Refined UX</li>
                  <li>Production-ready</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Slide 9: User Testing Protocol */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>07 | User Testing — Protocol &amp; Participants</h2>
            <div className={styles.protocolLayout}>
              <div className={styles.protocolColumn}>
                <div className={styles.testDateBar}>
                  <Calendar size={13} strokeWidth={2.2} />
                  Test Date: April 1–3, 2026
                </div>
                <p className={styles.protocolHeading}>
                  <Users size={14} strokeWidth={2.2} />
                  Participant Personas
                </p>
                <div className={styles.personaCard}>
                  <span className={styles.personaIcon}>
                    <User size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.personaBody}>
                    <span className={styles.personaName}>P1 — Power User</span>
                    <span className={styles.personaHint}>highly engaged, wants technical details</span>
                  </div>
                </div>
                <div className={styles.personaCard}>
                  <span className={styles.personaIcon}>
                    <Music2 size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.personaBody}>
                    <span className={styles.personaName}>P2 — Music-Focused</span>
                    <span className={styles.personaHint}>casual, cares about song recommendations</span>
                  </div>
                </div>
                <div className={styles.personaCard}>
                  <span className={styles.personaIcon}>
                    <UserMinus size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.personaBody}>
                    <span className={styles.personaName}>P3 — Casual User</span>
                    <span className={styles.personaHint}>minimal engagement, wants simplicity</span>
                  </div>
                </div>
              </div>
              <div className={styles.protocolColumn}>
                <p className={styles.protocolHeading}>
                  <ClipboardCheck size={14} strokeWidth={2.2} />
                  Test Tasks
                </p>
                <div className={styles.taskChipStack}>
                  <div className={styles.taskChip}>
                    <span className={styles.taskNumber}>1</span>
                    <div>
                      <span className={styles.taskName}>Task 1: Orientation</span>
                      <span className={styles.taskHint}>navigate to recommendations section</span>
                    </div>
                  </div>
                  <div className={styles.taskChip}>
                    <span className={styles.taskNumber}>2</span>
                    <div>
                      <span className={styles.taskName}>Task 2: Explanation</span>
                      <span className={styles.taskHint}>find why a song appeared</span>
                    </div>
                  </div>
                  <div className={styles.taskChip}>
                    <span className={styles.taskNumber}>3</span>
                    <div>
                      <span className={styles.taskName}>Task 3: Fairness</span>
                      <span className={styles.taskHint}>check fairness metrics</span>
                    </div>
                  </div>
                  <div className={styles.taskChip}>
                    <span className={styles.taskNumber}>4</span>
                    <div>
                      <span className={styles.taskName}>Task 4: Appeal</span>
                      <span className={styles.taskHint}>file an appeal for unfair treatment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Slide 10: Results Matrix (heatmap) */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>08 | Results Matrix</h2>
            <div className={styles.matrixLayout}>
              <div className={styles.matrixPanel}>
                <svg
                  data-testid="testing-matrix"
                  viewBox="0 0 520 320"
                  className={styles.matrixSvg}
                >
                  {/* column headers (short codes to avoid text collision with slide 9) */}
                  {personaShortCodes.map((code, i) => {
                    const x = 150 + i * 110 + 50;
                    return (
                      <text
                        key={code}
                        x={x}
                        y={40}
                        textAnchor="middle"
                        className={styles.matrixHeader}
                      >
                        {code}
                      </text>
                    );
                  })}
                  {/* rows */}
                  {matrixRows.map((row, rowIdx) => {
                    const y = 70 + rowIdx * 60;
                    return (
                      <g key={row.task}>
                        <text x={140} y={y + 38} textAnchor="end" className={styles.matrixRowLabel}>
                          {row.task}
                        </text>
                        {row.scores.map((score, colIdx) => {
                          const x = 150 + colIdx * 110;
                          return (
                            <g key={colIdx}>
                              <rect
                                x={x}
                                y={y}
                                width={100}
                                height={50}
                                rx={6}
                                fill={heatColor(score)}
                              />
                              <text
                                x={x + 50}
                                y={y + 32}
                                textAnchor="middle"
                                className={styles.matrixCellText}
                              >
                                {score}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
                <div className={styles.matrixLegend}>
                  <p className={styles.matrixLegendLabel}>Legend</p>
                  <span className={styles.matrixLegendChip}>
                    <span className={styles.matrixLegendSwatch} style={{ background: GREEN }} />
                    5 — Easy
                  </span>
                  <span className={styles.matrixLegendChip}>
                    <span className={styles.matrixLegendSwatch} style={{ background: `${GREEN}66` }} />
                    3 — Neutral
                  </span>
                  <span className={styles.matrixLegendChip}>
                    <span className={styles.matrixLegendSwatch} style={{ background: RED }} />
                    1 — Unable
                  </span>
                </div>
              </div>
              <div className={styles.matrixSummary}>
                <div className={styles.matrixFinding}>
                  <p className={styles.matrixFindingLabel}>
                    <Lightbulb size={12} strokeWidth={2.5} />
                    Key Finding
                  </p>
                  <p className={styles.matrixFindingText}>
                    Casual participants (P3) struggled with explanation depth and fairness metric
                    interpretation. Recommend a simplified tier for less-engaged users.
                  </p>
                </div>
                <div className={styles.keyInsightStack}>
                  <div className={styles.keyInsightCard}>
                    <span className={styles.keyInsightName}>Power Users</span>
                    <span className={styles.keyInsightAvg}>avg 5.0</span>
                    <span className={styles.keyInsightHint}>Fully engaged with technical detail</span>
                  </div>
                  <div className={styles.keyInsightCard}>
                    <span className={styles.keyInsightName}>Music-Focused</span>
                    <span className={styles.keyInsightAvg}>avg 4.25</span>
                    <span className={styles.keyInsightHint}>Competent with clear explanations</span>
                  </div>
                  <div className={styles.keyInsightCard}>
                    <span className={styles.keyInsightName}>Casual Users</span>
                    <span className={styles.keyInsightAvg}>avg 2.5</span>
                    <span className={styles.keyInsightHint}>Need simplified tier</span>
                  </div>
                </div>
                <p className={styles.matrixScale}>
                  Scale: 1–5 (5 = task completed easily, 1 = unable to complete)
                </p>
              </div>
            </div>
          </section>

          {/* Slide 11: Change Management & Phased Rollout */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>09 | Change Management &amp; Phased Rollout</h2>
            <div className={styles.phaseRolloutGrid}>
              <div className={styles.phaseRolloutCard}>
                <div className={styles.phaseRolloutHead}>
                  <span className={styles.phaseRolloutBadge}>
                    <Rocket size={16} strokeWidth={2.2} />
                    <span>Phase 1</span>
                  </span>
                  <span className={styles.phaseRolloutWindow}>Wks 1–4 · 5–10%</span>
                </div>
                <p className={styles.phaseRolloutTitle}>Limited Beta</p>
                <p className={styles.phaseRolloutSection}>Success Metrics</p>
                <ul className={styles.phaseRolloutList}>
                  <li>≥80% task completion</li>
                  <li>≥4/5 confidence</li>
                  <li>No engagement regression</li>
                </ul>
                <p className={styles.phaseRolloutSection}>Channels</p>
                <p className={styles.phaseRolloutChannels}>
                  Direct invites, think-aloud testing, bi-weekly check-ins
                </p>
              </div>
              <div className={styles.phaseRolloutCard}>
                <div className={styles.phaseRolloutHead}>
                  <span className={styles.phaseRolloutBadge}>
                    <Users size={16} strokeWidth={2.2} />
                    <span>Phase 2</span>
                  </span>
                  <span className={styles.phaseRolloutWindow}>Wks 5–12 · 25–40%</span>
                </div>
                <p className={styles.phaseRolloutTitle}>Broader Rollout</p>
                <p className={styles.phaseRolloutSection}>Success Metrics</p>
                <ul className={styles.phaseRolloutList}>
                  <li>Adoption ≥35%</li>
                  <li>Appeal SLA ≤7 days</li>
                  <li>Artist awareness confirmed</li>
                </ul>
                <p className={styles.phaseRolloutSection}>Channels</p>
                <p className={styles.phaseRolloutChannels}>
                  In-app announcements, weekly research, monthly all-hands
                </p>
              </div>
              <div className={styles.phaseRolloutCard}>
                <div className={styles.phaseRolloutHead}>
                  <span className={`${styles.phaseRolloutBadge} ${styles.phaseRolloutBadgeActive}`}>
                    <Globe size={16} strokeWidth={2.2} />
                    <span>Phase 3</span>
                  </span>
                  <span className={styles.phaseRolloutWindow}>Wk 13+ · 100%</span>
                </div>
                <p className={styles.phaseRolloutTitle}>Full Launch</p>
                <p className={styles.phaseRolloutSection}>Success Metrics</p>
                <ul className={styles.phaseRolloutList}>
                  <li>Discoverability ≥60%</li>
                  <li>Trust scores improved</li>
                  <li>Zero compliance violations</li>
                </ul>
                <p className={styles.phaseRolloutSection}>Channels</p>
                <p className={styles.phaseRolloutChannels}>
                  Platform-wide notifications, press, quarterly fairness reports
                </p>
              </div>
            </div>
            <div className={styles.gateCallout}>
              <AlertCircle size={16} strokeWidth={2.2} color="#1ed760" style={{ flexShrink: 0 }} />
              <p className={styles.gateCalloutText}>
                <strong>Go/No-Go gates at Week 4 &amp; Week 12</strong> — pause and iterate if metrics
                are not met before expanding.
              </p>
            </div>
          </section>

          {/* Slide 12: Stakeholders & Risk Management */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>10 | Stakeholders &amp; Risk Management</h2>
            <div className={styles.stakeholdersLayout}>
              <div className={styles.stakeholdersColumn}>
                <p className={styles.protocolHeading}>
                  <Users size={14} strokeWidth={2.2} />
                  Engagement Sequence
                </p>
                <div className={styles.stakeholderCard}>
                  <span className={styles.stakeholderNum}>1</span>
                  <div className={styles.stakeholderBody}>
                    <div className={styles.stakeholderHead}>
                      <span className={styles.stakeholderIcon}>
                        <ShieldCheck size={16} strokeWidth={2} />
                      </span>
                      <span className={styles.stakeholderName}>Privacy Advocates / Regulators</span>
                      <span className={`${styles.stanceChip} ${styles.stanceSupportive}`}>SUPPORTIVE</span>
                    </div>
                    <p className={styles.stakeholderNote}>
                      Engage first to validate compliance posture.
                    </p>
                  </div>
                </div>
                <div className={styles.stakeholderCard}>
                  <span className={styles.stakeholderNum}>2</span>
                  <div className={styles.stakeholderBody}>
                    <div className={styles.stakeholderHead}>
                      <span className={styles.stakeholderIcon}>
                        <Code2 size={16} strokeWidth={2} />
                      </span>
                      <span className={styles.stakeholderName}>Engineering &amp; Algorithm Teams</span>
                      <span className={`${styles.stanceChip} ${styles.stanceResistant}`}>RESISTANT</span>
                    </div>
                    <p className={styles.stakeholderNote}>
                      Address workload and IP concerns before code ships.
                    </p>
                  </div>
                </div>
                <div className={styles.stakeholderCard}>
                  <span className={styles.stakeholderNum}>3</span>
                  <div className={styles.stakeholderBody}>
                    <div className={styles.stakeholderHead}>
                      <span className={styles.stakeholderIcon}>
                        <Building2 size={16} strokeWidth={2} />
                      </span>
                      <span className={styles.stakeholderName}>Executive Leadership</span>
                      <span className={`${styles.stanceChip} ${styles.stanceMixed}`}>MIXED</span>
                    </div>
                    <p className={styles.stakeholderNote}>
                      Need budget approval + strategic alignment.
                    </p>
                  </div>
                </div>
                <div className={styles.stakeholderCard}>
                  <span className={styles.stakeholderNum}>4</span>
                  <div className={styles.stakeholderBody}>
                    <div className={styles.stakeholderHead}>
                      <span className={styles.stakeholderIcon}>
                        <Mic2 size={16} strokeWidth={2} />
                      </span>
                      <span className={styles.stakeholderName}>Independent Artists</span>
                      <span className={`${styles.stanceChip} ${styles.stanceSupportive}`}>SUPPORTIVE</span>
                    </div>
                    <p className={styles.stakeholderNote}>
                      Engage last; only promise once metrics are proven.
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.stakeholdersColumn}>
                <p className={styles.protocolHeading}>
                  <AlertTriangle size={14} strokeWidth={2.2} />
                  Major Risks &amp; Mitigations
                </p>
                <div className={styles.riskCard}>
                  <p className={styles.riskTitle}>Appeal Overload</p>
                  <p className={styles.riskMitigation}>
                    Pilot appeals in Phase 2; scale review team before full launch.
                  </p>
                </div>
                <div className={styles.riskCard}>
                  <p className={styles.riskTitle}>Bias Discovered in Audit</p>
                  <p className={styles.riskMitigation}>
                    Pre-commit to visible action plan with published timeline.
                  </p>
                </div>
                <div className={styles.riskCard}>
                  <p className={styles.riskTitle}>Perceived as Performative</p>
                  <p className={styles.riskMitigation}>
                    Report tangible outcomes; publish concrete fairness metrics.
                  </p>
                </div>
                <div className={styles.riskCard}>
                  <p className={styles.riskTitle}>Engineering Scalability</p>
                  <p className={styles.riskMitigation}>
                    Stress-test in Phases 1–2; dedicate ops team before Phase 3.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Slide 13: Portal Features */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>11 | Portal Features — What Made It Into V2.1</h2>
            <p className={styles.italicLead}>
              The Algorithmic Fairness &amp; Transparency Portal — four core sections, each grounded
              in a semester of work
            </p>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureHead}>
                  <span className={styles.featureIcon}>
                    <Eye size={20} strokeWidth={2} />
                  </span>
                  <p className={styles.featureTitle}>Recommendations Transparency</p>
                </div>
                <p className={styles.featureBody}>How &amp; why a song appears in your queue</p>
                <p className={styles.featureStories}>Stories #1, #2, #3</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureHead}>
                  <span className={styles.featureIcon}>
                    <Scale size={20} strokeWidth={2} />
                  </span>
                  <p className={styles.featureTitle}>Fairness &amp; Oversight</p>
                </div>
                <p className={styles.featureBody}>
                  Current fairness metrics with targets, independent artist visibility monitoring,
                  and monthly audit results displayed in real time.
                </p>
                <p className={styles.featureStories}>Stories #4, #8</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureHead}>
                  <span className={styles.featureIcon}>
                    <History size={20} strokeWidth={2} />
                  </span>
                  <p className={styles.featureTitle}>Decision History</p>
                </div>
                <p className={styles.featureBody}>
                  Users can review a log of automated decisions that affected their experience
                </p>
                <p className={styles.featureStories}>Story #3 (extension)</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureHead}>
                  <span className={styles.featureIcon}>
                    <Hand size={20} strokeWidth={2} />
                  </span>
                  <p className={styles.featureTitle}>Appeal &amp; Review</p>
                </div>
                <p className={styles.featureBody}>
                  Structured process to challenge decisions: form submission, 5–7 business day SLA,
                  human review team, and outcome notification.
                </p>
                <p className={styles.featureStories}>Stories #5, #10</p>
              </div>
            </div>
            <div className={styles.featuresFooter}>
              <p className={styles.featuresFooterText}>
                Prototype Version 2.1 · Tested April 1–3, 2026 · MIS 430 Spring 2026
              </p>
            </div>
          </section>

          {/* Slide 12: Key Takeaways */}
          <section>
            <div className={styles.slideAccentBar} />
            <h2>Key Takeaways &amp; Reflections</h2>
            <div className={styles.takeawaysGrid}>
              <div className={styles.takeawayCard}>
                <div className={styles.takeawayNumber}>01</div>
                <div className={styles.takeawayBodyWrap}>
                  <p className={styles.takeawayTitle}>Ambiguity is a feature</p>
                  <p className={styles.takeawayBody}>
                    The open-ended case forced us to think about the actual problem before jumping to
                    solutions.
                  </p>
                </div>
              </div>
              <div className={styles.takeawayCard}>
                <div className={styles.takeawayNumber}>02</div>
                <div className={styles.takeawayBodyWrap}>
                  <p className={styles.takeawayTitle}>Every assignment built on the last</p>
                  <p className={styles.takeawayBody}>
                    Backlog → data model → prototype → testing → change management. Nothing existed in
                    isolation.
                  </p>
                </div>
              </div>
              <div className={styles.takeawayCard}>
                <div className={styles.takeawayNumber}>03</div>
                <div className={styles.takeawayBodyWrap}>
                  <p className={styles.takeawayTitle}>User trust requires specificity</p>
                  <p className={styles.takeawayBody}>
                    Vague fairness targets erode credibility. Real numbers and real process beat polished
                    PR language.
                  </p>
                </div>
              </div>
              <div className={styles.takeawayCard}>
                <div className={styles.takeawayNumber}>04</div>
                <div className={styles.takeawayBodyWrap}>
                  <p className={styles.takeawayTitle}>Design for the casual user</p>
                  <p className={styles.takeawayBody}>
                    Tech-literate users will find their way; it&apos;s the confused user who determines
                    if the portal truly works.
                  </p>
                </div>
              </div>
              <div className={styles.takeawayCardWide}>
                <div className={styles.takeawayNumber}>05</div>
                <div className={styles.takeawayBodyWrap}>
                  <p className={styles.takeawayTitle}>Transparency is a product problem, not just a legal one</p>
                  <p className={styles.takeawayBody}>
                    How information is presented matters as much as what is disclosed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Slide 13: Thank You */}
          <section>
            <div className={styles.thanksSlide}>
              <div className={styles.eqDivider} aria-hidden="true" style={{ margin: '0 auto 1.5em auto' }}>
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
              <h1 className={styles.thanksTitle}>Thank You</h1>
              <p className={styles.thanksPortalLine}>Algorithmic Fairness &amp; Transparency Portal</p>
              <p className={styles.thanksCourseLine}>MIS 430 · Spring 2026 Project Closeout</p>
              <p className={styles.thanksQA}>
                <Headphones size={18} strokeWidth={2.2} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Questions &amp; Discussion
              </p>
              <div className={styles.thanksAppendixRow}>
                <span className={styles.thanksAppendixPill}>
                  <FileText size={13} strokeWidth={2} />
                  Prioritized Product Backlog
                </span>
                <span className={styles.thanksAppendixPill}>
                  <Database size={13} strokeWidth={2} />
                  Data Model (ERD)
                </span>
                <span className={styles.thanksAppendixPill}>
                  <FileBarChart size={13} strokeWidth={2} />
                  User Testing Report
                </span>
                <span className={styles.thanksAppendixPill}>
                  <Megaphone size={13} strokeWidth={2} />
                  Change Management Plan
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
