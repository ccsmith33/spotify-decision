export interface ExplanationInput {
  trackName: string;
  artistName: string;
  userTopGenres?: string[];
  userTopArtists?: string[];
  popularity?: number;
  matchReasons?: string[];
  position?: number;
  source?: 'top_tracks' | 'recently_played' | 'mixed';
  artistRank?: number;
}

export function buildExplanationPrompt(input: ExplanationInput): string {
  const {
    trackName, artistName, userTopGenres, userTopArtists,
    popularity, matchReasons, position, source, artistRank,
  } = input;

  let genreSection = '';
  if (userTopGenres && userTopGenres.length > 0) {
    genreSection = `\nYour most-listened genres: ${userTopGenres.slice(0, 5).join(', ')}`;
  }

  let artistSection = '';
  if (userTopArtists && userTopArtists.length > 0) {
    artistSection = `\nYour top artists: ${userTopArtists.slice(0, 5).join(', ')}`;
  }

  let popularitySection = '';
  if (popularity !== undefined) {
    popularitySection = `\nTrack popularity score: ${popularity}/100`;
  }

  let reasonSection = '';
  if (matchReasons && matchReasons.length > 0) {
    reasonSection = `\nMatch signals: ${matchReasons.join('; ')}`;
  }

  let positionSection = '';
  if (position !== undefined) {
    positionSection = `\nThis track is #${position + 1} in the listener's recommendation list.`;
  }

  let sourceSection = '';
  if (source === 'top_tracks') {
    sourceSection = '\nThis track comes from the listener\'s top tracks (a confirmed favorite).';
  } else if (source === 'recently_played') {
    sourceSection = '\nThis track comes from the listener\'s recently played (current rotation).';
  }

  let artistRankSection = '';
  if (artistRank !== undefined) {
    artistRankSection = `\n${artistName} is #${artistRank + 1} in the listener's top artists.`;
  }

  return `You are Spotify's algorithmic transparency feature. Explain why "${trackName}" by ${artistName} was recommended to this listener.

Provide three tiers of explanation AND custom factor categories. Respond with ONLY valid JSON — no markdown, no code fences, no extra text. Use this exact structure:

{"basic":"...","detailed":"...","technical":"...","factors":[{"name":"...","weight":0.35},{"name":"...","weight":0.30},{"name":"...","weight":0.20},{"name":"...","weight":0.15}]}

Tier rules:
- basic: 1 casual sentence, no numbers or percentages. Mention "${trackName}" or "${artistName}" by name.
- detailed: 2-3 sentences about listening patterns, artist connections, and genre alignment. Reference "${trackName}" and "${artistName}" specifically.
- technical: Breakdown with genre overlap analysis, popularity metrics, listening frequency patterns, and artist similarity scoring

Factor rules:
- Choose 4-5 factor categories that are SPECIFIC to this track and listener
- Do NOT use generic names like "Genre Match" or "Artist Similarity"
- Use names that tell a story: "Indie Rock Affinity", "Late Night Listening Pattern", "Artist Loyalty Score", "Acoustic Preference", "Mood Matching", etc.
- Make the factor names reflect the actual connection between this track and this listener's taste
- Weights must sum to 1.0
- Each weight must be between 0.05 and 0.50

Each explanation must be UNIQUE. Do NOT use phrases like "fits right in", "matches your taste", or "right up your alley". Instead, reference SPECIFIC details about THIS track and THIS artist. Mention the track name and artist by name. Be conversational and specific.

Vary your sentence structure:
- Some should start with the artist name
- Some should start with a listening pattern observation
- Some should start with a genre reference
- Never start two explanations the same way

Use second person ("you" / "your"). Sound like a knowledgeable music friend, not a robot.
${genreSection}${artistSection}${popularitySection}${reasonSection}${positionSection}${sourceSection}${artistRankSection}

Rules:
- Respond with ONLY the JSON object, nothing else
- Do NOT wrap in markdown code fences
- Do NOT start with "We recommended" or "This track was recommended"
- basic must be under 15 words
- detailed must be under 60 words
- technical must be under 100 words`;
}
