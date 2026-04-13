import type { GlossaryTerm } from './types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Algorithm',
    definition: 'A set of rules that a computer follows to make decisions. On a music platform, algorithms decide which songs to recommend, how to order search results, and what appears on your home page.',
    example: 'When Spotify creates your Discover Weekly playlist, an algorithm picks songs it predicts you will enjoy based on your listening habits.',
  },
  {
    term: 'Algorithmic Weight',
    definition: 'How much influence a specific factor has on a decision. A higher weight means that factor matters more in the final result.',
    example: 'If "Listening History" has a weight of 35%, it means your past plays are the single biggest factor in choosing your recommendations -- more important than, say, what is trending globally.',
  },
  {
    term: 'Aggregate Monitoring',
    definition: 'Tracking outcomes across the entire platform rather than for individual users. Aggregate metrics show overall patterns and trends, not personal guarantees.',
    example: 'When we say "independent artists receive 12% of recommendation slots," that is a platform-wide average. Your personal recommendations may have more or fewer independent artists depending on your taste.',
  },
  {
    term: 'Collaborative Filtering',
    definition: 'A method of making recommendations by finding people with similar taste and suggesting what they listen to. The idea is that if you and another listener both love the same 10 artists, you might enjoy their 11th favorite too.',
    example: 'If thousands of Phoebe Bridgers fans also listen to Japanese Breakfast, the algorithm may recommend Japanese Breakfast to you after you play Phoebe Bridgers.',
  },
  {
    term: 'Fairness Audit',
    definition: 'A regular check on whether the algorithm is treating different groups equitably. Audits measure things like whether independent artists get fair visibility compared to major-label artists.',
    example: 'Our monthly fairness audit checks whether independent artists appear in recommendations at a rate proportional to their share of new releases, currently targeting at least 15% exposure.',
  },
  {
    term: 'Proprietary Logic',
    definition: 'The specific technical details of how an algorithm works internally. Companies protect this information because it represents significant investment and competitive advantage. Transparency means explaining what factors matter and why, without revealing the exact formula.',
    example: 'We can tell you that your listening history is the biggest factor in your Discover Weekly, but we do not share the exact mathematical formula that calculates the final ranking -- that is proprietary.',
  },
  {
    term: 'Recommendation Signal',
    definition: 'A piece of information the algorithm uses to make a decision. Signals can come from your behavior (what you play, skip, or save), from the music itself (tempo, energy, genre), or from other listeners (collaborative patterns).',
    example: 'Saving a song to your library is a strong positive signal that tells the algorithm you want more music like it. Skipping a song within the first 10 seconds is a negative signal.',
  },
  {
    term: 'Transparency',
    definition: 'Making the workings of automated systems understandable to the people they affect. In music streaming, this means explaining how recommendations are made, what data is used, and how fairness is monitored -- without requiring technical expertise to understand.',
    example: 'This portal is an example of transparency: instead of hiding how recommendations work, we explain the factors involved, show our fairness metrics, and give you a way to challenge decisions you disagree with.',
  },
];
