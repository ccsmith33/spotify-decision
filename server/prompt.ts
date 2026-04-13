interface ExplanationInput {
  trackName: string;
  artistName: string;
  userTopGenres?: string[];
  userTopArtists?: string[];
  popularity?: number;
  matchReasons?: string[];
}

export function buildExplanationPrompt(input: ExplanationInput): string {
  const { trackName, artistName, userTopGenres, userTopArtists, popularity, matchReasons } = input;

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

  return `You are Spotify's algorithmic transparency feature. Explain why "${trackName}" by ${artistName} was recommended to this listener.

Provide three tiers of explanation. Respond with ONLY valid JSON — no markdown, no code fences, no extra text. Use this exact structure:

{"basic":"...","detailed":"...","technical":"..."}

Tier rules:
- basic: 1 casual sentence, no numbers or percentages (e.g. "Matches your indie rock taste")
- detailed: 2-3 sentences about listening patterns, artist connections, and genre alignment
- technical: Breakdown with genre overlap analysis, popularity metrics, listening frequency patterns, and artist similarity scoring

Use second person ("you" / "your"). Sound like a knowledgeable music friend, not a robot.
${genreSection}${artistSection}${popularitySection}${reasonSection}

Context: This track has been in the listener's heavy rotation recently, surfaced from their top tracks and recent listening history.

Rules:
- Respond with ONLY the JSON object, nothing else
- Do NOT wrap in markdown code fences
- Do NOT start with "We recommended" or "This track was recommended"
- basic must be under 15 words
- detailed must be under 60 words
- technical must be under 100 words`;
}
