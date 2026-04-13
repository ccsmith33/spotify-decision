import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import type { DetailLevel, AppealFormData, AlgorithmDecision, Explanation } from '../../data/types';
import { decisions as mockDecisions, explanations as mockExplanations } from '../../data/decisions';
import { fairnessAudits } from '../../data/fairness';
import { appeals } from '../../data/appeals';
import { glossaryTerms } from '../../data/glossary';
import { useSpotify } from '../../context/SpotifyContext';
import { HeroSection } from './HeroSection';
import { GlossaryPanel } from './GlossaryPanel';
import { DecisionCard } from './DecisionCard';
import { RecommendationList } from './RecommendationList';
import { TransparencyControls } from './TransparencyControls';
import { FairnessSection } from './FairnessSection';
import { DecisionHistory } from './DecisionHistory';
import { AppealSection } from './AppealSection';
import styles from './DemoPage.module.css';

interface DemoPageProps {
  detailLevel: DetailLevel;
  onDetailLevelChange: (level: DetailLevel) => void;
}

export function DemoPage({ detailLevel, onDetailLevelChange }: DemoPageProps) {
  const [glossaryExpanded, setGlossaryExpanded] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { recommendations, isLoading, isRefreshing, isAuthenticated, refreshData, topArtists, topTracks, recentlyPlayed } = useSpotify();

  const liveDecisionCards = useMemo(() => {
    if (!isAuthenticated || topArtists.length === 0) return null;

    // Compute genre percentages from top artists
    const genreCounts: Record<string, number> = {};
    for (const artist of topArtists) {
      for (const genre of artist.genres) {
        genreCounts[genre] = (genreCounts[genre] ?? 0) + 1;
      }
    }
    const totalGenreMentions = Object.values(genreCounts).reduce((s, c) => s + c, 0) || 1;
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topArtistNames = topArtists.slice(0, 5).map(a => a.name);

    // Card 1: Your Top Mix
    const card1Decision: AlgorithmDecision = {
      id: 'live-dec-top-mix',
      type: 'playlist_curation',
      timestamp: new Date().toISOString(),
      description: `Your Top Mix is built around ${topArtistNames.slice(0, 3).join(', ')} and similar artists.`,
      factors: topGenres.slice(0, 5).map(([genre, count]) => ({
        name: genre,
        weight: count / totalGenreMentions,
        description: `${Math.round((count / totalGenreMentions) * 100)}% of your top artists are in this genre.`,
      })),
      confidence: 0.92,
      trackIds: topTracks.slice(0, 5).map(t => t.id),
      explanationId: 'live-exp-top-mix',
    };
    const card1Explanation: Explanation = {
      id: 'live-exp-top-mix',
      decisionId: 'live-dec-top-mix',
      basic: `These artists dominate your feed because you play them most often.`,
      detailed: `Your Top Mix draws heavily from ${topArtistNames.slice(0, 3).join(', ')}. Your listening is concentrated in ${topGenres.slice(0, 2).map(([g]) => g).join(' and ')}, which shapes 80% of what the algorithm surfaces for you.`,
      technical: `Playlist curation uses artist-affinity scores from your 30-day play history. ${topArtistNames[0]} has the highest affinity score. Genre distribution: ${topGenres.slice(0, 3).map(([g, c]) => `${g} ${Math.round((c / totalGenreMentions) * 100)}%`).join(', ')}. Collaborative filtering fills remaining slots.`,
      disclosureBoundary: 'Exact affinity scores and collaborative filtering weights are proprietary.',
      generatedAt: new Date().toISOString(),
    };

    // Card 2: Recently Discovered
    const recentArtistIds = new Set(recentlyPlayed.map(rp => rp.track.artistId));
    const topArtistIds = new Set(topArtists.map(a => a.id));
    const newArtistCount = [...recentArtistIds].filter(id => !topArtistIds.has(id)).length;

    const card2Decision: AlgorithmDecision = {
      id: 'live-dec-discovery',
      type: 'discover_weekly',
      timestamp: new Date().toISOString(),
      description: `Recently you've explored ${newArtistCount} artist${newArtistCount !== 1 ? 's' : ''} outside your usual rotation.`,
      factors: [
        { name: 'New Artists', weight: 0.35, description: `${newArtistCount} artists not in your top rotation` },
        { name: 'Genre Exploration', weight: 0.30, description: 'Tracks from genres outside your core taste' },
        { name: 'Collaborative Signals', weight: 0.20, description: 'What similar listeners also discovered' },
        { name: 'Audio Similarity', weight: 0.15, description: 'Sonically related to your favorites' },
      ],
      confidence: 0.85,
      trackIds: recentlyPlayed.slice(0, 5).map(rp => rp.track.id),
      explanationId: 'live-exp-discovery',
    };
    const card2Explanation: Explanation = {
      id: 'live-exp-discovery',
      decisionId: 'live-dec-discovery',
      basic: `These are tracks from artists you don't usually listen to -- the algorithm is expanding your horizons.`,
      detailed: `Out of your recent plays, ${newArtistCount} came from artists outside your top rotation. The algorithm balances familiar content with discovery picks to keep your listening fresh.`,
      technical: `Discovery candidates are injected using an epsilon-greedy exploration strategy. ${newArtistCount} unique artist IDs in recent-played are absent from the top-artist affinity matrix, indicating successful exploration.`,
      disclosureBoundary: 'Exploration rate parameters and candidate selection thresholds are proprietary.',
      generatedAt: new Date().toISOString(),
    };

    // Card 3: On Repeat
    const trackPlayCounts: Record<string, { track: typeof topTracks[0]; count: number }> = {};
    for (const rp of recentlyPlayed) {
      const key = rp.track.id;
      if (!trackPlayCounts[key]) {
        trackPlayCounts[key] = { track: rp.track, count: 0 };
      }
      trackPlayCounts[key].count++;
    }
    const repeatedTracks = Object.values(trackPlayCounts)
      .filter(e => e.count > 1)
      .sort((a, b) => b.count - a.count);
    const repeatDescription = repeatedTracks.length > 0
      ? `"${repeatedTracks[0].track.title}" has been on repeat ${repeatedTracks[0].count} times recently.`
      : `Your top tracks like "${topTracks[0]?.title ?? 'your favorites'}" keep coming back in your feed.`;

    const card3Decision: AlgorithmDecision = {
      id: 'live-dec-repeat',
      type: 'home_feed',
      timestamp: new Date().toISOString(),
      description: repeatDescription,
      factors: [
        { name: 'Play Frequency', weight: 0.40, description: 'Tracks you replay get boosted in rankings' },
        { name: 'Recency', weight: 0.25, description: 'Recent plays weigh more than older ones' },
        { name: 'Session Context', weight: 0.20, description: 'Time of day and session length patterns' },
        { name: 'Completion Rate', weight: 0.15, description: 'Tracks you finish get a stronger signal' },
      ],
      confidence: 0.94,
      trackIds: repeatedTracks.slice(0, 5).map(e => e.track.id),
      explanationId: 'live-exp-repeat',
    };
    const card3Explanation: Explanation = {
      id: 'live-exp-repeat',
      decisionId: 'live-dec-repeat',
      basic: `These tracks keep showing up because you play them over and over.`,
      detailed: `The algorithm detects tracks with high replay frequency and boosts them in your Home Feed and mixes. ${repeatedTracks.length > 0 ? `"${repeatedTracks[0].track.title}" has been played ${repeatedTracks[0].count} times recently.` : 'Your top tracks consistently receive positive engagement signals.'}`,
      technical: `On-repeat detection uses implicit feedback scoring: play count * completion rate * recency decay. Tracks exceeding a replay threshold are promoted in home-feed ranking. ${repeatedTracks.length > 0 ? `Top track "${repeatedTracks[0].track.title}" replay count: ${repeatedTracks[0].count}.` : ''}`,
      disclosureBoundary: 'Exact replay thresholds and scoring formula are proprietary.',
      generatedAt: new Date().toISOString(),
    };

    return [
      { decision: card1Decision, explanation: card1Explanation },
      { decision: card2Decision, explanation: card2Explanation },
      { decision: card3Decision, explanation: card3Explanation },
    ];
  }, [isAuthenticated, topArtists, topTracks, recentlyPlayed]);

  const decisionCardData = liveDecisionCards ?? [
    { decision: mockDecisions[0], explanation: mockExplanations[0] },
    { decision: mockDecisions[1], explanation: mockExplanations[1] },
    { decision: mockDecisions[2], explanation: mockExplanations[2] },
  ];

  // Build live decision history from recently played
  const liveDecisionHistory = useMemo(() => {
    if (!isAuthenticated || recentlyPlayed.length === 0) return null;

    return recentlyPlayed.slice(0, 10).map((rp, i): { decision: AlgorithmDecision; explanation: Explanation } => {
      const playedDate = new Date(rp.playedAt);
      const artistName = topArtists.find(a => a.id === rp.track.artistId)?.name ?? 'an artist';
      const isTopArtist = topArtists.some(a => a.id === rp.track.artistId);
      const context = isTopArtist
        ? `Surfaced because ${artistName} is in your top artists`
        : 'Appeared in your feed as a discovery pick';

      const decision: AlgorithmDecision = {
        id: `live-history-${i}`,
        type: 'home_feed',
        timestamp: rp.playedAt,
        description: `Played "${rp.track.title}" by ${artistName} -- ${context}`,
        factors: [
          { name: 'Listening History', weight: 0.40, description: isTopArtist ? `${artistName} is one of your most-played artists` : 'Related to your listening patterns' },
          { name: 'Recency', weight: 0.25, description: 'Recently active in your session' },
          { name: 'Collaborative Filtering', weight: 0.20, description: 'Similar listeners also played this' },
          { name: 'Audio Features', weight: 0.15, description: 'Matches your preferred audio profile' },
        ],
        confidence: isTopArtist ? 0.93 : 0.78,
        trackIds: [rp.track.id],
        explanationId: `live-history-exp-${i}`,
      };
      const explanation: Explanation = {
        id: `live-history-exp-${i}`,
        decisionId: `live-history-${i}`,
        basic: isTopArtist
          ? `You played this because ${artistName} is one of your favorites.`
          : `This track appeared in your feed as a new discovery.`,
        detailed: `"${rp.track.title}" ${isTopArtist ? `was surfaced because ${artistName} ranks highly in your artist affinity scores` : 'was recommended as an exploration pick based on collaborative filtering from similar listeners'}.`,
        technical: `Track "${rp.track.title}" played at ${playedDate.toISOString()}. ${isTopArtist ? 'High artist-affinity score triggered direct recommendation.' : 'Exploration candidate via epsilon-greedy strategy in home-feed ranking model.'}`,
        disclosureBoundary: 'Session-level ranking details and real-time scoring are proprietary.',
        generatedAt: rp.playedAt,
      };
      return { decision, explanation };
    });
  }, [isAuthenticated, recentlyPlayed, topArtists]);

  const handleAppealSubmit = (_data: AppealFormData) => {
    // Mock submission - handled in AppealSection
  };

  return (
    <div className={styles.page}>
      <HeroSection />

      {isAuthenticated && (
        <div className={styles.refreshContainer}>
          <button
            className={styles.refreshButton}
            onClick={refreshData}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh recommendations"
          >
            <RefreshCw size={16} className={isRefreshing ? styles.refreshSpinning : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Recommendations'}
          </button>
        </div>
      )}

      <GlossaryPanel
        terms={glossaryTerms}
        isExpanded={glossaryExpanded}
        onToggle={() => setGlossaryExpanded(prev => !prev)}
      />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>How Your Recommendations Work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-base)' }}>
          {decisionCardData.map(({ decision, explanation }) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              explanation={explanation}
              detailLevel={detailLevel}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Your Recent Recommendations
          {isAuthenticated && isLoading && (
            <span className={styles.loadingIndicator}> Loading your music data...</span>
          )}
        </h2>
        {isAuthenticated && isLoading ? (
          <div className={styles.skeletonContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skeletonRow}>
                <div className={styles.skeletonArt} />
                <div className={styles.skeletonText}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineShort} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <RecommendationList recommendations={recommendations} detailLevel={detailLevel} />
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Transparency Controls</h2>
        <TransparencyControls
          detailLevel={detailLevel}
          onDetailLevelChange={onDetailLevelChange}
          notificationsEnabled={notificationsEnabled}
          onNotificationsToggle={() => setNotificationsEnabled(prev => !prev)}
        />
      </div>

      <div className={styles.section}>
        <FairnessSection audits={fairnessAudits} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Decision History</h2>
        {liveDecisionHistory ? (
          <DecisionHistory
            decisions={liveDecisionHistory.map(d => d.decision)}
            liveExplanations={liveDecisionHistory.map(d => d.explanation)}
            detailLevel={detailLevel}
          />
        ) : (
          <DecisionHistory decisions={mockDecisions} detailLevel={detailLevel} />
        )}
      </div>

      <div className={styles.section} id="appeal-section">
        <h2 className={styles.sectionTitle}>Challenge a Decision</h2>
        <AppealSection existingAppeals={appeals} onSubmit={handleAppealSubmit} />
      </div>
    </div>
  );
}
