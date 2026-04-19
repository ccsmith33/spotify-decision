import { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
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
      transition: 'slide',
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
              <p className={styles.courseTag}>MIS 430 · Spring 2026</p>
              <h1 className={styles.titleLine}>Algorithmic Fairness &amp;</h1>
              <h1 className={styles.titleLineLast}>Transparency Portal</h1>
              <p className={styles.titleSubtitle}>
                Music Streaming Platform · Project Closeout Presentation
              </p>
              <p className={styles.titleTagline}>
                From ambiguous case to working prototype — a semester of iterative systems design
              </p>
              <p className={styles.titleDate}>April 2026</p>
            </div>
          </section>

          {/* Slide 2: Agenda */}
          <section>
            <h2>Today&apos;s Agenda</h2>
            <div className={styles.agendaGrid}>
              <div className={styles.agendaItem}>
                <p className={styles.agendaLabel}>01 · Why this problem is hard</p>
                <p className={styles.agendaHint}>The case, the challenge, the ambiguity</p>
              </div>
              <div className={styles.agendaItem}>
                <p className={styles.agendaLabel}>02 · Semester process recap</p>
                <p className={styles.agendaHint}>How assignments shaped the solution</p>
              </div>
              <div className={styles.agendaItem}>
                <p className={styles.agendaLabel}>03 · System data architecture</p>
                <p className={styles.agendaHint}>What the system needs behind the scenes</p>
              </div>
              <div className={styles.agendaItem}>
                <p className={styles.agendaLabel}>04 · MoSCoW feature ranking</p>
                <p className={styles.agendaHint}>MoSCoW prioritization &amp; sprint planning</p>
              </div>
              <div className={styles.agendaItem}>
                <p className={styles.agendaLabel}>05 · Usability study outcomes</p>
                <p className={styles.agendaHint}>What worked, what didn&apos;t, what we improved</p>
              </div>
              <div className={styles.agendaItem}>
                <p className={styles.agendaLabel}>06 · Change Management &amp; Rollout</p>
                <p className={styles.agendaHint}>Stakeholders, risks, and phased deployment</p>
              </div>
              <div className={styles.agendaItemWide}>
                <p className={styles.agendaLabel}>07 · Final Prototype &amp; reflections</p>
                <p className={styles.agendaHint}>The portal and closing thoughts</p>
              </div>
            </div>
          </section>

          {/* Slide 3: Problem Space */}
          <section>
            <h2>01 | Problem Space &amp; Project Background</h2>
            <div className={styles.sectionBody}>
              <div className={styles.subsection}>
                <h3 className={styles.accentHeading}>The Case</h3>
                <p>
                  The problem was intentionally open-ended. No consensus existed on what transparency
                  should look like, how fairness should be defined, or what role humans should play.
                </p>
              </div>
              <div>
                <h3 className={styles.accentHeading}>Key Tensions We Had to Resolve</h3>
                <ul className={styles.tensionsList}>
                  <li>🔍 Transparency vs. IP protection</li>
                  <li>⚖️ User trust vs. org risk</li>
                  <li>🤝 Fairness vs. algorithm performance</li>
                  <li>📋 Accountability vs. complexity</li>
                  <li>👤 Individual vs. aggregate metrics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Slide 4: Process Overview */}
          <section>
            <h2>02 | Process Overview</h2>
            <div className={styles.processBody}>
              <div className={styles.phaseGrid}>
                <div className={styles.phaseCard}>
                  <p className={styles.phaseTitle}>Phase 1: Problem Definition</p>
                  <p className={styles.phaseBody}>
                    Understood fairness, trust, and transparency concerns from multiple stakeholder
                    perspectives
                  </p>
                </div>
                <div className={styles.phaseCard}>
                  <p className={styles.phaseTitle}>Phase 2: Backlog &amp; Prioritization</p>
                  <p className={styles.phaseBody}>
                    Identified must-have features: plain-language explanations, fairness metrics, and
                    appeal process
                  </p>
                </div>
                <div className={styles.phaseCard}>
                  <p className={styles.phaseTitle}>Phase 3: System Data Design</p>
                  <p className={styles.phaseBody}>
                    Designed backend structure for algorithm decisions, explanations, audits, and
                    appeals
                  </p>
                </div>
                <div className={styles.phaseCard}>
                  <p className={styles.phaseTitle}>Phase 4: Rollout Planning</p>
                  <p className={styles.phaseBody}>
                    Planned phased deployment with stakeholder engagement and risk mitigation
                    strategies
                  </p>
                </div>
              </div>
              <div className={styles.phaseCallout}>
                <p className={styles.phaseTitle}>Phase 5: Usability Validation</p>
                <p className={styles.phaseBody}>
                  Validated prototype with 3 users; achieved 100% completion with clear improvement
                  areas
                </p>
              </div>
              <p className={styles.insightNote}>
                Key insight: Every assignment fed into the next — we were never just building
                deliverables, we were building understanding.
              </p>
            </div>
          </section>

          {/* Slide 5: Data Modeling & Architecture */}
          <section>
            <h2>03 | Data Modeling &amp; Architecture</h2>
            <p className={styles.italicLead}>
              Key Design Decision: Separate system functionality from transparency features
            </p>
            <div className={styles.entityGrid}>
              <div>
                <p className={styles.phaseTitle}>Algorithm Decisions</p>
                <p className={styles.entityBody}>
                  Tracks not just what content is shown, but how and why decisions are made. Exists
                  independently from recommendations.
                </p>
              </div>
              <div>
                <p className={styles.phaseTitle}>Explanations</p>
                <p className={styles.entityBody}>
                  Stores different explanation tiers for user-facing transparency without exposing
                  proprietary algorithm logic.
                </p>
              </div>
              <div>
                <p className={styles.phaseTitle}>Fairness Audits</p>
                <p className={styles.entityBody}>
                  Enables monitoring for bias — especially major-label vs. independent artist
                  visibility disparities.
                </p>
              </div>
              <div>
                <p className={styles.phaseTitle}>Interactions</p>
                <p className={styles.entityBody}>
                  Supports analysis of how engagement-driven algorithms influence recommendation
                  outcomes.
                </p>
              </div>
            </div>
          </section>

          {/* Slide 6: Data Model ERD */}
          <section>
            <h2>04 | Data Model — Entity Relationship Diagram</h2>
            <div className={styles.erdWrap}>
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
            <h2>05 | Prioritized Backlog</h2>
            <div className={styles.backlogBody}>
              <div className={styles.backlogBlock}>
                <p className={styles.backlogHeadP0}>Must Have (P0)</p>
                <ul className={styles.backlogList}>
                  <li>Recommendations Transparency — users understand what content they see and basic why</li>
                  <li>Plain-Language Explanations — avoid technical jargon; explain in natural language</li>
                  <li>Fairness &amp; Oversight — current metrics with targets, real-time monitoring</li>
                  <li>Decision History — users can review log of decisions affecting their experience</li>
                  <li>Appeal &amp; Review Process — structured challenge mechanism with SLA and human review</li>
                </ul>
              </div>
              <div className={styles.backlogBlock}>
                <p className={styles.backlogHeadP1}>Should Have (P1)</p>
                <ul className={styles.backlogListSm}>
                  <li>Detailed Audit Trail — deeper fairness analytics and trend analysis</li>
                  <li>Multi-Tier Explanation Levels — technical/casual/detailed explanation options</li>
                  <li>Appeal History — users can revisit past appeals</li>
                </ul>
              </div>
              <div>
                <p className={styles.backlogHeadP2}>Could Have (P2)</p>
                <ul className={styles.backlogListSm}>
                  <li>Personalized Recommendation Factors — user-specific weight explainers</li>
                  <li>Real-Time Bias Alerts — proactive notification system</li>
                  <li>Community Fairness Voting — users rate perceived fairness</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Slide 8: Prototype Roadmap */}
          <section>
            <h2>06 | Prototype Roadmap</h2>
            <div className={styles.roadmapWrap}>
              <svg
                data-testid="roadmap-timeline"
                viewBox="0 0 800 160"
                className={styles.roadmapSvg}
              >
                <line x1="60" y1="70" x2="740" y2="70" stroke={GREEN} strokeWidth="3" />
                {milestones.map((m, i) => {
                  const cx = 60 + (680 / (milestones.length - 1)) * i;
                  return (
                    <g key={m.version}>
                      {m.current ? (
                        <circle cx={cx} cy={70} r="14" fill={GREEN} stroke={GREEN} strokeWidth="3" />
                      ) : (
                        <circle cx={cx} cy={70} r="10" fill="none" stroke={GREEN} strokeWidth="3" />
                      )}
                      <text x={cx} y={40} textAnchor="middle" className={styles.roadmapVersion}>
                        {m.version}
                      </text>
                      <text x={cx} y={110} textAnchor="middle" className={styles.roadmapDate}>
                        {m.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className={styles.roadmapDetails}>
                <div className={styles.roadmapCard}>
                  <ul className={styles.roadmapList}>
                    <li>Basic recommendation transparency</li>
                    <li>Static fairness metrics</li>
                    <li>Simple appeal form</li>
                  </ul>
                </div>
                <div className={styles.roadmapCard}>
                  <ul className={styles.roadmapList}>
                    <li>Plain-language explanations</li>
                    <li>Improved UI</li>
                    <li>Decision history tab</li>
                  </ul>
                </div>
                <div className={styles.roadmapCard}>
                  <ul className={styles.roadmapList}>
                    <li>Fairness audit dashboard</li>
                    <li>Multi-tier explanations</li>
                    <li>Usability study prep</li>
                  </ul>
                </div>
                <div className={styles.roadmapCardCurrent}>
                  <ul className={styles.roadmapList}>
                    <li>Participant feedback iterations</li>
                    <li>Refined UX</li>
                    <li>Production-ready</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Slide 9: User Testing Protocol */}
          <section>
            <h2>07 | User Testing — Protocol &amp; Participants</h2>
            <div className={styles.protocolGrid}>
              <div>
                <p className={styles.accentHeading}>Test Date</p>
                <p>April 1–3, 2026</p>

                <p className={`${styles.accentHeading} ${styles.mt1}`}>Participant Personas</p>
                <ul className={styles.personaList}>
                  <li>
                    <span className={styles.personaName}>P1 — Power User</span>
                    <br />
                    <span className={styles.personaHint}>highly engaged, wants technical details</span>
                  </li>
                  <li className={styles.mt05}>
                    <span className={styles.personaName}>P2 — Music-Focused</span>
                    <br />
                    <span className={styles.personaHint}>casual, cares about song recommendations</span>
                  </li>
                  <li className={styles.mt05}>
                    <span className={styles.personaName}>P3 — Casual User</span>
                    <br />
                    <span className={styles.personaHint}>minimal engagement, wants simplicity</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className={styles.accentHeading}>Test Tasks</p>
                <ul className={styles.personaList}>
                  <li>
                    <span className={styles.personaName}>Task 1: Orientation</span>
                    <br />
                    <span className={styles.personaHint}>navigate to recommendations section</span>
                  </li>
                  <li className={styles.mt05}>
                    <span className={styles.personaName}>Task 2: Explanation</span>
                    <br />
                    <span className={styles.personaHint}>find why a song appeared</span>
                  </li>
                  <li className={styles.mt05}>
                    <span className={styles.personaName}>Task 3: Fairness</span>
                    <br />
                    <span className={styles.personaHint}>check fairness metrics</span>
                  </li>
                  <li className={styles.mt05}>
                    <span className={styles.personaName}>Task 4: Appeal</span>
                    <br />
                    <span className={styles.personaHint}>file an appeal for unfair treatment</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Slide 10: Results Matrix (heatmap) */}
          <section>
            <h2>08 | Results Matrix</h2>
            <div className={styles.matrixWrap}>
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
              <p className={styles.matrixScale}>
                <span className={styles.subduedLabel}>Scale:</span> 1–5 (5 = task completed easily, 1 = unable to complete)
              </p>
              <div className={styles.matrixFinding}>
                <p className={styles.matrixFindingText}>
                  <span className={styles.bold}>Key Finding:</span> Casual participants (P3) struggled
                  with explanation depth and fairness metric interpretation. Recommend a simplified
                  tier for less-engaged users.
                </p>
              </div>
            </div>
          </section>

          {/* Slide 11: Portal Features */}
          <section>
            <h2>09 | Portal Features — What Made It Into V2.1</h2>
            <div className={styles.featuresBody}>
              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <p className={styles.featureTitle}>🎵 Recommendations Transparency</p>
                  <p className={styles.featureBody}>How &amp; why a song appears in your queue</p>
                  <p className={styles.featureStories}>Stories #1, #2, #3</p>
                </div>
                <div className={styles.featureCard}>
                  <p className={styles.featureTitle}>⚖️ Fairness &amp; Oversight</p>
                  <p className={styles.featureBody}>
                    Current metrics with targets, independent artist visibility monitoring
                  </p>
                  <p className={styles.featureStories}>Stories #4, #8</p>
                </div>
                <div className={styles.featureCard}>
                  <p className={styles.featureTitle}>📋 Decision History</p>
                  <p className={styles.featureBody}>
                    Users can review a log of automated decisions that affected their experience
                  </p>
                  <p className={styles.featureStories}>Story #3 (extension)</p>
                </div>
                <div className={styles.featureCard}>
                  <p className={styles.featureTitle}>✋ Appeal &amp; Review</p>
                  <p className={styles.featureBody}>
                    Structured process: form submission, 5–7 business day SLA, human review
                  </p>
                  <p className={styles.featureStories}>Stories #5, #10</p>
                </div>
              </div>
              <div className={styles.featuresFooter}>
                <p className={styles.featuresFooterText}>
                  Prototype Version 2.1 · Tested April 1–3, 2026
                </p>
              </div>
            </div>
          </section>

          {/* Slide 12: Key Takeaways */}
          <section>
            <h2>Key Takeaways &amp; Reflections</h2>
            <div className={styles.takeawaysGrid}>
              <div className={styles.takeawayCard}>
                <p className={styles.takeawayTitle}>01 Ambiguity is a feature</p>
                <p className={styles.takeawayBody}>
                  The open-ended case forced us to think about the actual problem before jumping to
                  solutions.
                </p>
              </div>
              <div className={styles.takeawayCard}>
                <p className={styles.takeawayTitle}>02 Every assignment built on the last</p>
                <p className={styles.takeawayBody}>
                  Backlog → data model → prototype → testing → rollout planning. Nothing existed in
                  isolation.
                </p>
              </div>
              <div className={styles.takeawayCard}>
                <p className={styles.takeawayTitle}>03 User trust requires specificity</p>
                <p className={styles.takeawayBody}>
                  Vague fairness targets erode credibility. Real numbers and real process beat polished
                  PR language.
                </p>
              </div>
              <div className={styles.takeawayCard}>
                <p className={styles.takeawayTitle}>04 Design for the least-engaged visitor</p>
                <p className={styles.takeawayBody}>
                  Tech-literate users will find their way; the confused person determines if the
                  portal truly works.
                </p>
              </div>
              <div className={styles.takeawayCardWide}>
                <p className={styles.takeawayTitle}>05 Transparency is a product problem</p>
                <p className={styles.takeawayBody}>
                  How information is presented matters as much as what is disclosed.
                </p>
              </div>
            </div>
          </section>

          {/* Slide 13: Thank You */}
          <section>
            <div className={styles.thanksSlide}>
              <h1 className={styles.thanksTitle}>Thank You</h1>
              <p className={styles.thanksPortalLine}>Transparency Portal · Questions &amp; Discussion</p>
              <p className={styles.thanksCourseLine}>Spring 2026 Project Closeout</p>
              <p className={styles.thanksQA}>Questions &amp; Discussion</p>
              <div className={styles.thanksAppendices}>
                <p className={styles.thanksAppendixItem}>📋 Prioritized Product Backlog</p>
                <p className={styles.thanksAppendixItem}>🗄️ Data Model (ERD)</p>
                <p className={styles.thanksAppendixItem}>📊 Usability Test Report</p>
                <p className={styles.thanksAppendixItem}>📣 Rollout &amp; Stakeholder Plan</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
