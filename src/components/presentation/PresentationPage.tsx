import { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import styles from './PresentationPage.module.css';

export function PresentationPage() {
  const deckRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const revealInstance = useRef<any>(null);

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
    revealInstance.current = deck;

    return () => {
      deck.destroy();
      revealInstance.current = null;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className="reveal" ref={deckRef}>
        <div className="slides">
          <section>
            <h1>Decision Transparency Portal</h1>
            <h3>Algorithmic Fairness & Transparency for Music Streaming</h3>
            <p className="subtitle">MIS 430 Final Project | Spring 2026</p>
          </section>

          <section>
            <h2>Problem & Context</h2>
            <p>Music streaming platforms use complex algorithms to recommend content, but users have limited understanding of how these decisions are made.</p>
            <ul>
              <li>Lack of transparency in recommendation algorithms</li>
              <li>Potential bias in artist visibility (major vs. independent)</li>
              <li>No mechanism for users to challenge automated decisions</li>
            </ul>
          </section>

          <section>
            <h2>Key Stakeholders</h2>
            <ul>
              <li><span className="accent">Privacy Advocates</span> -- Demand accountability</li>
              <li><span className="accent">Independent Artists</span> -- Need fair visibility</li>
              <li><span className="accent">Engineering Teams</span> -- Protect proprietary logic</li>
              <li><span className="accent">Executive Leadership</span> -- Build competitive trust</li>
            </ul>
          </section>

          <section>
            <h2>Our Approach</h2>
            <p>A Decision Transparency Portal embedded within the existing Spotify experience:</p>
            <ul>
              <li>Three-tier explanation system (Basic / Detailed / Technical)</li>
              <li>Fairness metrics with current values and targets</li>
              <li>Human-in-the-loop appeal mechanism</li>
              <li>User-controlled transparency preferences</li>
            </ul>
          </section>

          <section>
            <h2>User Testing Insights</h2>
            <ul>
              <li>3 participants across power, discovery, and casual user profiles</li>
              <li>100% task completion rate, 3.92 avg confidence</li>
              <li>Key finding: casual users need simpler terminology</li>
              <li>All participants wanted actual metrics alongside targets</li>
            </ul>
          </section>

          <section>
            <h2>Demo Highlights</h2>
            <ul>
              <li>Pixel-perfect Spotify UI shell</li>
              <li>Algorithm decision explanations with factor breakdowns</li>
              <li>Interactive transparency controls</li>
              <li>Real-time fairness metrics dashboard</li>
              <li>Complete appeal submission and tracking</li>
            </ul>
          </section>

          <section>
            <h2>Data Model</h2>
            <p>Five key entities designed for transparency:</p>
            <ul>
              <li><span className="accent">Algorithm Decision</span> -- What, how, and why</li>
              <li><span className="accent">Explanation</span> -- Multi-tier user-facing content</li>
              <li><span className="accent">Fairness Audit</span> -- Bias monitoring metrics</li>
              <li><span className="accent">Interaction</span> -- User engagement data</li>
              <li><span className="accent">Appeal</span> -- Human review process</li>
            </ul>
          </section>

          <section>
            <h2>Key Findings</h2>
            <ul>
              <li>Transparency increases trust without requiring full disclosure</li>
              <li>Aggregate metrics need explicit explanation vs. individual guarantees</li>
              <li>A visible appeal process makes accountability concrete</li>
              <li>Different user types need different levels of detail</li>
            </ul>
          </section>

          <section>
            <h2>Recommendations</h2>
            <ul>
              <li>Implement glossary for technical terminology</li>
              <li>Always show current metrics alongside targets</li>
              <li>Add post-appeal outcome details</li>
              <li>Design for the casual user first, then layer complexity</li>
            </ul>
          </section>

          <section>
            <h1>Q&A</h1>
            <p>Thank you for your attention.</p>
            <p className="subtitle">Switch to the Demo tab to see the portal in action.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
