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

  return `You are Spotify's algorithmic transparency feature. Write a brief, friendly explanation (3-4 sentences) of why "${trackName}" by ${artistName} was recommended to this listener.

Reference specific audio characteristics and listening patterns in your explanation. Sound like a knowledgeable music friend, not a robot. Use second person ("you" / "your").
${audioSection}${genreSection}${reasonSection}

Rules:
- Do NOT use markdown, bullet points, or headers
- Do NOT start with "We recommended" or "This track was recommended"
- DO start with a concrete observation about the music or the listener's taste
- Keep it under 60 words
- Sound like it belongs in the Spotify app`;
}
