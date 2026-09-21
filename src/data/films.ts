export interface Credit {
  role: string;
  names: string[];
}

export interface Film {
  slug: string;
  title: string;
  originalTitle: string;
  displayTitle: string;
  category: string;
  year: string;
  duration?: string;
  format: string;
  synopsis: string;
  thumbnail: string;
  stills: string[];
  credits: Credit[];
}

export const films: Film[] = [
  {
    slug: 'a-tale-of-king-kong',
    title: 'a tale of King Kong',
    originalTitle: 'sự tích con khỉ',
    displayTitle: 'a tale of King Kong | sự tích con khỉ',
    category: 'essay film',
    year: '2027 - in developing',
    duration: "15'",
    format: "Essay film | 15' | 2027 | Vietnam",
    synopsis: 'Inspired by the Hollywood blockbuster "Kong: Skull Island" (2017), which was filmed at famous natural landmarks in Vietnam. This short film returns to the filming locations after 10 years, where theme parks capitalizing on the image of King Kong have emerged. While tracing the memories of local residents who once played the silent indigenous tribe in the movie, the work explores the gaze of "First Cinema" toward "Third World" nations and indigenous communities, amidst personal reflections on the figure of King Kong as a symbol of "The Other" in cinematic history and popular culture.',
    thumbnail: '/images/thumbnails/thumb-king-kong.png',
    stills: [
      '/images/films/a-tale-of-king-kong/still-01.png',
      '/images/films/a-tale-of-king-kong/still-02.png',
      '/images/films/a-tale-of-king-kong/still-03.png',
      '/images/films/a-tale-of-king-kong/still-04.png',
      '/images/films/a-tale-of-king-kong/still-05.png',
      '/images/films/a-tale-of-king-kong/still-06.png'
    ],
    credits: [
      { role: 'Directed by', names: ['Cầm Đức Hiệp'] }
    ]
  },
  {
    slug: 'utopia',
    title: 'utopia',
    originalTitle: 'miền đất hứa',
    displayTitle: 'utopia | miền đất hứa',
    category: 'hybrid',
    year: '2026',
    duration: "15'",
    format: "Hybrid | 15' | 2026 | DCP 2K | 7.1 | Color | Vietnam, South Korea",
    synopsis: 'In a mountainous region of Northern Vietnam, different timelines collide clumsily. Inside a sci-fi hotel reminiscent of Hollywood B-movies, a film crew is shooting a space-themed fresh milk commercial. Outside, in an ancient village of the Thai and Hmong people, a documentary crew wanders, capturing the echoes of indigenous life. Between these two narratives, a mysterious aura begins to take hold, an invisible yet omnipresent UFO. When the pristine landscape and futuristic visions blend, the film invites reflections on the process of image-making and the way a land is represented.',
    thumbnail: '/images/thumbnails/thumb-utopia.png',
    stills: [
      '/images/films/utopia/still-01.png',
      '/images/films/utopia/still-02.png',
      '/images/films/utopia/still-03.png',
      '/images/films/utopia/still-04.png',
      '/images/films/utopia/still-05.png',
      '/images/films/utopia/still-06.png',
      '/images/films/utopia/still-07.png',
      '/images/films/utopia/still-08.png',
      '/images/films/utopia/still-09.png'
    ],
    credits: [
      { role: 'Supported by', names: ['CJ Short Film Project'] },
      { role: 'Written and directed by', names: ['Cầm Đức Hiệp'] },
      { role: 'Produced by', names: ['Châu Thúy An'] },
      { role: 'Supervised by', names: ['Trần Thị Bích Ngọc'] },
      { role: 'Director of Photography', names: ['Hoàng Thảo'] },
      { role: 'Edited by', names: ['Linh DN'] },
      { role: 'Production design by', names: ['Đặng Thùy Anh'] },
      { role: 'Assistant director', names: ['Cao Việt Nga'] },
      { role: 'Costume design by', names: ['Trần Quỳnh Nhi'] },
      { role: 'Additional cinematography', names: ['Nguyễn Hồ Bảo Nghi'] },
      { role: 'Sound post-production', names: ['Sigon Sound Production'] },
      { role: 'Colorist', names: ['Đặng Quốc Anh'] }
    ]
  },
  {
    slug: 'lover-for-rent',
    title: 'lover for rent',
    originalTitle: 'người tình cho thuê',
    displayTitle: 'lover for rent | người tình cho thuê',
    category: 'documentary',
    year: '2025',
    duration: "24'",
    format: "Documentary | 24' | 2025 | Vietnam",
    synopsis: 'Vinamost is the first company in Vietnam to offer people-rental services for organizing fake weddings, catering to women with unintended pregnancies or the queer community. When a Christian bride uses the service, she is left with no choice but to take a false vow before the altar of God. Portraying them as an acting troupe, the film explores their bustling stages on the fine line between reality and fiction, between deception, faith, and humanity.',
    thumbnail: '/images/thumbnails/thumb-lover-for-rent.png',
    stills: [
      '/images/films/lover-for-rent/still-01.png',
      '/images/films/lover-for-rent/still-02.png',
      '/images/films/lover-for-rent/still-03.png',
      '/images/films/lover-for-rent/still-04.png',
      '/images/films/lover-for-rent/still-05.png'
    ],
    credits: [
      { role: 'Produced by', names: ['Varan Vietnam'] },
      { role: 'Directed by', names: ['Cầm Đức Hiệp'] },
      { role: 'Filmed by', names: ['Cầm Đức Hiệp', 'Nguyễn Hồ Bảo Nghi'] },
      { role: 'Edited by', names: ['Sylvie Gadmer Tiến', 'Phạm Thị Hảo'] },
      { role: 'Sound by', names: ['Nhâm Ngọc Hà', 'Nguyễn Hồ Bảo Nghi', 'Nguyễn Văn Thanh'] },
      { role: 'Instructors', names: ['Trần Phương Thảo', 'Swann Dubus', 'Sylvie Gadmer Tiến', 'Aurelie Ricard'] }
    ]
  },
  {
    slug: 'thanh-pho-muoi',
    title: 'thành phố muối',
    originalTitle: 'city of salt',
    displayTitle: 'thành phố muối | city of salt',
    category: 'fiction',
    year: '2024 - in post production',
    duration: "15'",
    format: "Fiction | 15' | 2024 | Vietnam",
    synopsis: 'Set against the backdrop of Thinh Long, Nam Dinh - a coastal town abandoned, cleared, and ultimately erased following the devastation of storms and the Covid-19 pandemic - this film in form as a fictional biography of a place that no longer exists. It explores the poetic intersection of memory and oblivion.',
    thumbnail: '/images/thumbnails/thumb-thanh-pho-muoi.png',
    stills: [
      '/images/films/thanh-pho-muoi/still-01.png',
      '/images/films/thanh-pho-muoi/still-02.png',
      '/images/films/thanh-pho-muoi/still-03.png',
      '/images/films/thanh-pho-muoi/still-04.png'
    ],
    credits: [
      { role: 'Produced by', names: ['Thục Võ'] },
      { role: 'Written and directed by', names: ['Cầm Đức Hiệp'] },
      { role: 'Director of Photography', names: ['Hoàng Thảo'] },
      { role: 'Production design by', names: ['Cao Việt Nga'] },
      { role: 'Assistant director', names: ['Châu Thúy An', 'Mai Ngọc Ngân Giang'] },
      { role: 'Colorist', names: ['Đặng Quốc Anh'] }
    ]
  },
  {
    slug: 'thu-thu',
    title: 'thư - thư',
    originalTitle: 'letter - letter',
    displayTitle: 'thư - thư | letter - letter',
    category: 'experimental',
    year: '2024 - in post production',
    duration: "7'",
    format: "Documentary | 7' | 2024 | Vietnam",
    synopsis: "The work is a two-part film, structured as a sent letter and a letter received in return. The first part unfolds within the cramped, jolting space of a long-distance bus—the very vehicles that carried me away from my hometown to a larger city for my studies. Amidst this stifling atmosphere, a small TV on the bus transforms the interior into a mobile cinema, broadcasting 'Thúy Nga Paris by Night.' This overseas Vietnamese variety show, though officially banned in Vietnam, continues to circulate through bootleg channels.\n\nThe second part shifts into a music video format, reimagining songs from the 'New Wave' movement of the Vietnamese diaspora in the United States during the 1980s. These melodies, which may seem repetitive or nonsensical, represent an effort to soothe the trauma of migration and the lingering echoes of war.\n\nThrough this re-enactment, I strive to connect with a distant community, isolated by history and geography, through a shared sense of loneliness and nostalgia. The film is a journey seeking personal connection within collective memories that transcend the boundaries of space, time, and censorship.",
    thumbnail: '/images/thumbnails/thumb-thu-thu.png',
    stills: [
      '/images/films/thu-thu/still-01.png'
    ],
    credits: [
      { role: 'Filmed and Edited by', names: ['Cầm Đức Hiệp'] },
      { role: 'Film letter workshop Instructor', names: ['Trương Quế Chi'] }
    ]
  }
];
