export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  isIndependent: boolean;
  genres: string[];
  monthlyListeners: number;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  dominantColor: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  albumId: string;
  durationMs: number;
  popularity: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isAlgorithmic: boolean;
}

export interface AlgorithmDecision {
  id: string;
  type: "playlist_curation" | "song_radio" | "discover_weekly" | "home_feed" | "search_ranking";
  timestamp: string;
  description: string;
  factors: AlgorithmFactor[];
  confidence: number;
  trackIds: string[];
  explanationId: string;
}

export interface AlgorithmFactor {
  name: string;
  weight: number;
  description: string;
}

export interface Explanation {
  id: string;
  decisionId: string;
  basic: string;
  detailed: string;
  technical: string;
  disclosureBoundary: string;
  generatedAt: string;
}

export interface FairnessAudit {
  id: string;
  auditDate: string;
  auditor: string;
  metrics: FairnessMetric[];
  overallScore: number;
  findings: string;
  recommendations: string;
}

export interface FairnessMetric {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: "up" | "down" | "stable";
  previousValue: number;
  lastUpdated: string;
  category: "artist_visibility" | "genre_diversity" | "discovery" | "engagement_fairness";
}

export interface Interaction {
  id: string;
  trackId: string;
  type: "play" | "skip" | "like" | "save" | "share" | "add_to_playlist";
  timestamp: string;
  context: string;
  durationMs?: number;
}

export interface Appeal {
  id: string;
  userId: string;
  decisionId: string;
  status: "submitted" | "under_review" | "resolved" | "escalated";
  submittedAt: string;
  resolvedAt?: string;
  category: "recommendation_quality" | "visibility_bias" | "content_filtering" | "ranking_fairness";
  description: string;
  desiredOutcome: string;
  reviewerNotes?: string;
  resolution?: string;
  resolutionType?: "adjusted" | "no_change" | "escalated" | "policy_update";
}

export interface Recommendation {
  track: Track;
  artist: Artist;
  album: Album;
  decision: AlgorithmDecision;
  explanation: Explanation;
  topFactor: string;
}

export interface AppealFormData {
  category: Appeal["category"];
  description: string;
  desiredOutcome: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  example: string;
}

export type TabId = "demo" | "presentation" | "video" | "appendix";
export type DetailLevel = "basic" | "detailed" | "technical";
