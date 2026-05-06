// Edit this file OR data/playlist.json to update the courtside mixtape
export interface Song {
  id: string;
  title: string;
  artist: string;
  spotifyUrl: string;
  spotifyTrackId?: string; // for embed widget
  emoji?: string;
  duration?: string;
}

export const playlist: Song[] = [
  {
    id: "1",
    title: "Started From the Bottom",
    artist: "Drake",
    spotifyUrl: "https://open.spotify.com/track/0z4bntH4sOZxCIBjPgiCFq",
    spotifyTrackId: "0z4bntH4sOZxCIBjPgiCFq",
    emoji: "🏀",
    duration: "3:14",
  },
  {
    id: "2",
    title: "Win",
    artist: "Jay Rock",
    spotifyUrl: "https://open.spotify.com/track/3hARuMBv9yKxKFJrx0sOQq",
    spotifyTrackId: "3hARuMBv9yKxKFJrx0sOQq",
    emoji: "🏆",
    duration: "3:52",
  },
  {
    id: "3",
    title: "All I Do Is Win",
    artist: "DJ Khaled",
    spotifyUrl: "https://open.spotify.com/track/2bJvI42r8EF3wxjOuDav4r",
    spotifyTrackId: "2bJvI42r8EF3wxjOuDav4r",
    emoji: "🔥",
    duration: "3:58",
  },
  {
    id: "4",
    title: "Jumpman",
    artist: "Drake & Future",
    spotifyUrl: "https://open.spotify.com/track/0xOeB1XSm5DFMoHi4GuEMl",
    spotifyTrackId: "0xOeB1XSm5DFMoHi4GuEMl",
    emoji: "⚡",
    duration: "3:07",
  },
  {
    id: "5",
    title: "Power",
    artist: "Kanye West",
    spotifyUrl: "https://open.spotify.com/track/2gZUPNdnz5Y45eiGxpHGSc",
    spotifyTrackId: "2gZUPNdnz5Y45eiGxpHGSc",
    emoji: "💪",
    duration: "4:52",
  },
];
