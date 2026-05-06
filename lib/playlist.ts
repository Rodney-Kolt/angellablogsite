// Edit this file to update the sidebar playlist
export interface Song {
  title: string;
  artist: string;
  spotifyUrl: string;
  emoji?: string;
}

export const playlist: Song[] = [
  {
    title: "Lavender Haze",
    artist: "Taylor Swift",
    spotifyUrl: "https://open.spotify.com/track/5jQI2r1RDBLrf2zwG3NqqW",
    emoji: "💜",
  },
  {
    title: "Espresso",
    artist: "Sabrina Carpenter",
    spotifyUrl: "https://open.spotify.com/track/2qSkIjg1o9h3YT9RAgYN75",
    emoji: "☕",
  },
  {
    title: "Feather",
    artist: "Sabrina Carpenter",
    spotifyUrl: "https://open.spotify.com/track/4Dvkj6JhhA12EX05fT7y2e",
    emoji: "🪶",
  },
  {
    title: "Stick Season",
    artist: "Noah Kahan",
    spotifyUrl: "https://open.spotify.com/track/0mflMxspEfB0VbI1kyLiAv",
    emoji: "🍂",
  },
  {
    title: "Softly",
    artist: "Clairo",
    spotifyUrl: "https://open.spotify.com/track/3yfqSUWxFvZELEM4PmlwIR",
    emoji: "🌸",
  },
];
