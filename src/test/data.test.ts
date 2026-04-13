import { describe, it, expect } from 'vitest';
import { artists, albums, tracks, getArtist, getAlbum, getTrack } from '../data/tracks';
import { playlists } from '../data/playlists';
import { decisions, explanations, getDecision, getExplanation } from '../data/decisions';
import { fairnessAudits, fairnessMetrics } from '../data/fairness';
import { interactions } from '../data/interactions';
import { appeals } from '../data/appeals';
import { recommendations } from '../data/recommendations';
import { glossaryTerms } from '../data/glossary';

describe('Mock Data Integrity', () => {
  describe('tracks.ts', () => {
    it('has non-empty artist array', () => {
      expect(artists.length).toBeGreaterThan(0);
    });

    it('has non-empty album array', () => {
      expect(albums.length).toBeGreaterThan(0);
    });

    it('has non-empty track array', () => {
      expect(tracks.length).toBeGreaterThan(0);
    });

    it('all tracks reference valid artists', () => {
      for (const track of tracks) {
        expect(artists.find(a => a.id === track.artistId)).toBeDefined();
      }
    });

    it('all tracks reference valid albums', () => {
      for (const track of tracks) {
        expect(albums.find(a => a.id === track.albumId)).toBeDefined();
      }
    });

    it('all albums reference valid artists', () => {
      for (const album of albums) {
        expect(artists.find(a => a.id === album.artistId)).toBeDefined();
      }
    });

    it('includes mix of independent and major-label artists', () => {
      const indie = artists.filter(a => a.isIndependent);
      const major = artists.filter(a => !a.isIndependent);
      expect(indie.length).toBeGreaterThan(0);
      expect(major.length).toBeGreaterThan(0);
    });

    it('getArtist returns correct artist', () => {
      expect(getArtist('artist-1').name).toBe('Taylor Swift');
    });

    it('getAlbum returns correct album', () => {
      expect(getAlbum('album-1').title).toBe('Midnights');
    });

    it('getTrack returns correct track', () => {
      expect(getTrack('track-1').title).toBe('Anti-Hero');
    });
  });

  describe('playlists.ts', () => {
    it('has non-empty playlist array', () => {
      expect(playlists.length).toBeGreaterThan(0);
    });

    it('includes both algorithmic and user-created playlists', () => {
      const algo = playlists.filter(p => p.isAlgorithmic);
      const user = playlists.filter(p => !p.isAlgorithmic);
      expect(algo.length).toBeGreaterThan(0);
      expect(user.length).toBeGreaterThan(0);
    });

    it('all playlist trackIds reference valid tracks', () => {
      for (const playlist of playlists) {
        for (const trackId of playlist.trackIds) {
          expect(tracks.find(t => t.id === trackId)).toBeDefined();
        }
      }
    });
  });

  describe('decisions.ts', () => {
    it('has non-empty decisions array', () => {
      expect(decisions.length).toBeGreaterThan(0);
    });

    it('has matching explanations for all decisions', () => {
      for (const decision of decisions) {
        const explanation = explanations.find(e => e.decisionId === decision.id);
        expect(explanation).toBeDefined();
      }
    });

    it('explanations have all three detail tiers', () => {
      for (const explanation of explanations) {
        expect(explanation.basic).toBeTruthy();
        expect(explanation.detailed).toBeTruthy();
        expect(explanation.technical).toBeTruthy();
      }
    });

    it('decision factors weights sum to approximately 1', () => {
      for (const decision of decisions) {
        const sum = decision.factors.reduce((s, f) => s + f.weight, 0);
        expect(sum).toBeCloseTo(1, 1);
      }
    });

    it('getDecision returns correct decision', () => {
      expect(getDecision('dec-1').type).toBe('playlist_curation');
    });

    it('getExplanation returns correct explanation', () => {
      expect(getExplanation('dec-1').basic).toBeTruthy();
    });
  });

  describe('fairness.ts', () => {
    it('has non-empty fairness metrics', () => {
      expect(fairnessMetrics.length).toBeGreaterThan(0);
    });

    it('has non-empty fairness audits', () => {
      expect(fairnessAudits.length).toBeGreaterThan(0);
    });

    it('all metrics have currentValue and targetValue', () => {
      for (const metric of fairnessMetrics) {
        expect(metric.currentValue).toBeGreaterThanOrEqual(0);
        expect(metric.targetValue).toBeGreaterThan(0);
      }
    });

    it('metrics have valid trend values', () => {
      for (const metric of fairnessMetrics) {
        expect(['up', 'down', 'stable']).toContain(metric.trend);
      }
    });
  });

  describe('interactions.ts', () => {
    it('has non-empty interactions array', () => {
      expect(interactions.length).toBeGreaterThan(0);
    });

    it('all interactions reference valid tracks', () => {
      for (const interaction of interactions) {
        expect(tracks.find(t => t.id === interaction.trackId)).toBeDefined();
      }
    });
  });

  describe('appeals.ts', () => {
    it('has non-empty appeals array', () => {
      expect(appeals.length).toBeGreaterThan(0);
    });

    it('includes appeals in different statuses', () => {
      const statuses = new Set(appeals.map(a => a.status));
      expect(statuses.size).toBeGreaterThan(1);
    });
  });

  describe('recommendations.ts', () => {
    it('has non-empty recommendations array', () => {
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('each recommendation has all required fields', () => {
      for (const rec of recommendations) {
        expect(rec.track).toBeDefined();
        expect(rec.artist).toBeDefined();
        expect(rec.album).toBeDefined();
        expect(rec.decision).toBeDefined();
        expect(rec.explanation).toBeDefined();
        expect(rec.topFactor).toBeTruthy();
      }
    });
  });

  describe('glossary.ts', () => {
    it('has non-empty glossary terms', () => {
      expect(glossaryTerms.length).toBeGreaterThan(0);
    });

    it('each term has definition and example', () => {
      for (const term of glossaryTerms) {
        expect(term.term).toBeTruthy();
        expect(term.definition).toBeTruthy();
        expect(term.example).toBeTruthy();
      }
    });
  });
});
