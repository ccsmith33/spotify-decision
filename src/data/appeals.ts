import type { Appeal } from './types';

export const appeals: Appeal[] = [
  {
    id: 'appeal-1',
    userId: 'user-1',
    decisionId: 'dec-3',
    status: 'resolved',
    submittedAt: '2026-03-15T10:00:00Z',
    resolvedAt: '2026-03-22T14:30:00Z',
    category: 'recommendation_quality',
    description: 'My Discover Weekly has been recommending the same type of pop music for weeks. I listen to a wide range of genres but the algorithm seems stuck on one pattern.',
    desiredOutcome: 'I would like more genre diversity in my weekly recommendations, especially more jazz and electronic music which I also listen to frequently.',
    reviewerNotes: 'Reviewed listening history and confirmed user has significant engagement with jazz and electronic genres. The recommendation model had over-indexed on pop due to higher play counts. Adjustment applied to increase genre diversity weighting.',
    resolution: 'Your Discover Weekly algorithm has been adjusted to better reflect the full range of your listening habits. You should see more genre diversity starting with your next weekly refresh. We also increased the exploration parameter for your profile to surface more varied content.',
    resolutionType: 'adjusted',
  },
  {
    id: 'appeal-2',
    userId: 'user-1',
    decisionId: 'dec-5',
    status: 'under_review',
    submittedAt: '2026-04-08T15:20:00Z',
    category: 'visibility_bias',
    description: 'When I search for "indie rock," the top results are dominated by major-label artists. Independent artists I know and love are buried on the second page or lower.',
    desiredOutcome: 'I want search results to give fair visibility to independent artists, especially when the search term specifically targets an independent genre.',
  },
  {
    id: 'appeal-3',
    userId: 'user-1',
    decisionId: 'dec-4',
    status: 'submitted',
    submittedAt: '2026-04-12T09:45:00Z',
    category: 'ranking_fairness',
    description: 'My Home feed keeps showing me the same 5 artists even though I follow over 50 artists. It feels like the algorithm is only promoting the most popular ones.',
    desiredOutcome: 'I want to see a more diverse set of artists on my Home page, including smaller artists I follow.',
  },
];
