interface ExplanationInput {
  trackName: string;
  artistName: string;
  audioFeatures?: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
    instrumentalness: number;
  };
  userTopGenres?: string[];
  matchReasons?: string[];
}

export function buildExplanationPrompt(input: ExplanationInput): string {
  const { trackName, artistName, audioFeatures, userTopGenres, matchReasons } = input;

  let audioSection = '';
  if (audioFeatures) {
    audioSection = `
Audio profile of this track:
- Danceability: ${(audioFeatures.danceability * 100).toFixed(0)}%
- Energy: ${(audioFeatures.energy * 100).toFixed(0)}%
- Positivity (valence): ${(audioFeatures.valence * 100).toFixed(0)}%
- Tempo: ${audioFeatures.tempo.toFixed(0)} BPM
- Acousticness: ${(audioFeatures.acousticness * 100).toFixed(0)}%
- Instrumentalness: ${(audioFeatures.instrumentalness * 100).toFixed(0)}%`;
  }

  let genreSection = '';
  if (userTopGenres && userTopGenres.length > 0) {
    genreSection = `\nYour most-listened genres: ${userTopGenres.slice(0, 5).join(', ')}`;
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
- detailed: 2-3 sentences referencing specific factors and genres from the data below
- technical: Full breakdown with audio feature percentages, BPM, genre overlap scores from the data below

Use second person ("you" / "your"). Sound like a knowledgeable music friend, not a robot.
${audioSection}${genreSection}${reasonSection}

Rules:
- Respond with ONLY the JSON object, nothing else
- Do NOT wrap in markdown code fences
- Do NOT start with "We recommended" or "This track was recommended"
- basic must be under 15 words
- detailed must be under 60 words
- technical must be under 100 words`;
}
