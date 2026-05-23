export type MovieItem = {
  _id: string;
  title: string;
  description: string;
  genre: string;
  year: number;
  runtime: string;
  director: string;
  cast: string[];
  poster: string;
  backdrop: string;
  trailerUrl: string;
  rating: number;
  featured?: boolean;
};

export const demoMovies: MovieItem[] = [
  {
    _id: "demo-dune-two",
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    genre: "Sci-Fi",
    year: 2024,
    runtime: "2h 46m",
    director: "Denis Villeneuve",
    cast: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson"],
    poster:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    rating: 8.6,
    featured: true,
  },
  {
    _id: "demo-oppenheimer",
    title: "Oppenheimer",
    description:
      "The story of J. Robert Oppenheimer and the creation of the atomic bomb, told through ambition, guilt, and political consequence.",
    genre: "Drama",
    year: 2023,
    runtime: "3h 00m",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
    poster:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    rating: 8.5,
  },
  {
    _id: "demo-spiderverse",
    title: "Spider-Man: Across the Spider-Verse",
    description:
      "Miles Morales catapults across the Multiverse, where he encounters a team charged with protecting its existence.",
    genre: "Animation",
    year: 2023,
    runtime: "2h 20m",
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"],
    poster:
      "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    rating: 8.7,
  },
  {
    _id: "demo-batman",
    title: "The Batman",
    description:
      "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind cryptic clues.",
    genre: "Crime",
    year: 2022,
    runtime: "2h 57m",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoe Kravitz", "Paul Dano"],
    poster:
      "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    rating: 7.8,
  },
  {
    _id: "demo-barbie",
    title: "Barbie",
    description:
      "Barbie and Ken leave Barbieland for the real world, discovering joy, chaos, and what it means to be human.",
    genre: "Comedy",
    year: 2023,
    runtime: "1h 54m",
    director: "Greta Gerwig",
    cast: ["Margot Robbie", "Ryan Gosling", "America Ferrera"],
    poster:
      "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=pBk4NYhWNMM",
    rating: 7.0,
  },
  {
    _id: "demo-top-gun",
    title: "Top Gun: Maverick",
    description:
      "After more than thirty years of service, Maverick trains a new generation of pilots for a mission unlike any other.",
    genre: "Action",
    year: 2022,
    runtime: "2h 11m",
    director: "Joseph Kosinski",
    cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly"],
    poster:
      "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=qSqVVswa420",
    rating: 8.3,
  },
  {
    _id: "demo-everything-everywhere",
    title: "Everything Everywhere All at Once",
    description:
      "A laundromat owner is pulled into a multiverse adventure where she must connect with alternate lives to save her family.",
    genre: "Adventure",
    year: 2022,
    runtime: "2h 20m",
    director: "Daniel Kwan and Daniel Scheinert",
    cast: ["Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu"],
    poster:
      "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
    rating: 7.8,
  },
  {
    _id: "demo-interstellar",
    title: "Interstellar",
    description:
      "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: "Sci-Fi",
    year: 2014,
    runtime: "2h 49m",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    rating: 8.7,
  },
  {
    _id: "demo-knives-out",
    title: "Knives Out",
    description:
      "A detective investigates the death of a wealthy crime novelist after a family gathering turns suspicious.",
    genre: "Mystery",
    year: 2019,
    runtime: "2h 11m",
    director: "Rian Johnson",
    cast: ["Daniel Craig", "Ana de Armas", "Chris Evans"],
    poster:
      "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/4HWAQu28e2yaWrtupFPGFkdNU7V.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=qGqiHJTsRkQ",
    rating: 7.9,
  },
  {
    _id: "demo-arrival",
    title: "Arrival",
    description:
      "A linguist works with the military to communicate with alien visitors after mysterious spacecraft appear around the world.",
    genre: "Sci-Fi",
    year: 2016,
    runtime: "1h 56m",
    director: "Denis Villeneuve",
    cast: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
    poster:
      "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/yIZ1xendyqKvY3FGeeUYUd5X9Mm.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=tFMo3UJ4B4g",
    rating: 7.6,
  },
  {
    _id: "demo-mad-max",
    title: "Mad Max: Fury Road",
    description:
      "In a desert wasteland, Max teams up with Furiosa to flee a tyrant and his army in a brutal road war.",
    genre: "Action",
    year: 2015,
    runtime: "2h 01m",
    director: "George Miller",
    cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
    poster:
      "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/phszHPFVhPHhMZgo0fWTKBDQsJA.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=hEJnMQG9ev8",
    rating: 8.1,
  },
  {
    _id: "demo-parasite",
    title: "Parasite",
    description:
      "A poor family schemes its way into the lives of a wealthy household, triggering a sharp and dangerous social collision.",
    genre: "Thriller",
    year: 2019,
    runtime: "2h 12m",
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Choi Woo-shik", "Park So-dam"],
    poster:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    rating: 8.5,
  },
  {
    _id: "demo-la-la-land",
    title: "La La Land",
    description:
      "A jazz pianist and an aspiring actress fall in love while chasing dreams in Los Angeles.",
    genre: "Romance",
    year: 2016,
    runtime: "2h 08m",
    director: "Damien Chazelle",
    cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
    poster:
      "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/9aRDMlU5Zwpysilm0WCWzU2PCFv.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8",
    rating: 7.9,
  },
  {
    _id: "demo-get-out",
    title: "Get Out",
    description:
      "A young man visits his girlfriend's family estate, where polite hospitality begins to reveal something horrifying.",
    genre: "Horror",
    year: 2017,
    runtime: "1h 44m",
    director: "Jordan Peele",
    cast: ["Daniel Kaluuya", "Allison Williams", "Lil Rel Howery"],
    poster:
      "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/yo1ef57MEPkEE4BDZKTZGH9uDcX.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=DzfpyUB60YY",
    rating: 7.6,
  },
  {
    _id: "demo-john-wick-4",
    title: "John Wick: Chapter 4",
    description:
      "John Wick uncovers a path to defeating the High Table, but first he must face a new enemy with powerful alliances.",
    genre: "Action",
    year: 2023,
    runtime: "2h 49m",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgard"],
    poster:
      "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/h8gHn0OzBoaefsYseUByqsmEDMY.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=qEVUtrk8_B4",
    rating: 7.7,
  },
  {
    _id: "demo-inside-out-2",
    title: "Inside Out 2",
    description:
      "Riley enters her teenage years as new emotions arrive and turn Headquarters into a very crowded place.",
    genre: "Animation",
    year: 2024,
    runtime: "1h 36m",
    director: "Kelsey Mann",
    cast: ["Amy Poehler", "Maya Hawke", "Kensington Tallman"],
    poster:
      "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=LEjhY15eCx0",
    rating: 7.6,
  },
];
