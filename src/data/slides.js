import { WEB_ASSETS } from './webAssets';

// ── Audio tracks (zone-based) ────────────────────────────────────────────────
// Zone 1 – intro: plays during the moon-to-sun drag and through slides 1-2
// Zone 2 – story: starts on slide 3, loops continuously until the last slide
// Zone 3 – outro: fades in on the final slide
export const INTRO_AUDIO = '/assets/audio/intro_instrumental.mov';
export const SLIDES_AUDIO = '/assets/audio/slides_music.mov';
export const OUTRO_AUDIO = '/assets/audio/outro-instrumental.mov';

// ── Story slides ─────────────────────────────────────────────────────────────
export const storySlides = [
  {
    id: 'slide-1',
    beatLabel: 'Beginning',
    mediaType: 'image',
    background: WEB_ASSETS.slide1Frame,
    grade: 'linear-gradient(120deg, rgba(53, 30, 12, 0.55), rgba(220, 163, 75, 0.22))',
    poemTitle: 'for a reason',
    poemLines: [
      'In that field of yellow light, I learned to look for you.',
      'Hope did not arrive loudly, it stood beside me and smiled.',
      'Even silence felt warm when your name crossed my mind.'
    ],
    crinkle: 1,
    faces: [
      { id: 'author', src: '/assets/faces/author.png', top: '30%', left: '38%', width: '16%', rotation: -2 },
      { id: 'partner', src: '/assets/faces/partner.png', top: '29%', left: '56%', width: '15%', rotation: 3 }
    ]
  },
  {
    id: 'slide-2',
    beatLabel: 'Falling Star',
    mediaType: 'image',
    background: WEB_ASSETS.slide2Frame,
    grade: 'linear-gradient(120deg, rgba(10, 8, 16, 0.7), rgba(131, 99, 56, 0.22))',
    poemTitle: 'quiet admiration',
    poemLines: [
      'I watched from far away, careful not to disturb your sky.',
      'A falling star crossed and I only wished for your laughter.',
      'Love began as a prayer I kept to myself.'
    ],
    crinkle: 0.9,
    faces: [
      { id: 'partner', src: '/assets/faces/partner.png', top: '34%', left: '56%', width: '14%', rotation: -1 }
    ]
  },
  {
    id: 'slide-3',
    beatLabel: 'Rejection',
    mediaType: 'image',
    background: WEB_ASSETS.slide3Frame,
    grade: 'linear-gradient(115deg, rgba(46, 20, 18, 0.62), rgba(210, 148, 88, 0.25))',
    poemTitle: 'sad, then smiling',
    poemLines: [
      'I offered a letter and received a lesson in timing.',
      'My heart hurt, but somehow it still laughed with me.',
      'Even this no became a part of my yes.'
    ],
    crinkle: 0.82,
    faces: [
      { id: 'author', src: '/assets/faces/author.png', top: '36%', left: '39%', width: '14%', rotation: -4 },
      { id: 'partner', src: '/assets/faces/partner.png', top: '35%', left: '59%', width: '13%', rotation: 5 }
    ]
  },
  {
    id: 'slide-4',
    beatLabel: 'Waiting',
    mediaType: 'image',
    background: WEB_ASSETS.slide4Frame,
    grade: 'linear-gradient(115deg, rgba(7, 10, 19, 0.72), rgba(130, 88, 43, 0.3))',
    poemTitle: 'restraint',
    poemLines: [
      'I waited beneath your window with patient footsteps.',
      'Longing taught me discipline, not distance.',
      'I stayed because I could already see our laughter, our home, and our forever.'
    ],
    crinkle: 0.7,
    faces: [
      { id: 'author', src: '/assets/faces/author.png', top: '42%', left: '44%', width: '14%', rotation: -3 }
    ]
  },
  {
    id: 'slide-5',
    beatLabel: 'Classroom Glance',
    mediaType: 'image',
    background: WEB_ASSETS.slide5Frame,
    grade: 'linear-gradient(110deg, rgba(23, 18, 10, 0.55), rgba(180, 130, 69, 0.2))',
    poemTitle: 'mutual awareness',
    poemLines: [
      'Across old desks and unfinished notes, my eyes kept meeting yours.',
      'The room was full, yet it felt like a secret corridor.',
      'We were not friends yet, but we were not strangers either.'
    ],
    crinkle: 0.58,
    faces: [
      { id: 'author', src: '/assets/faces/author.png', top: '33%', left: '41%', width: '14%', rotation: -1 },
      { id: 'partner', src: '/assets/faces/partner.png', top: '32%', left: '57%', width: '14%', rotation: 2 }
    ]
  },
  {
    id: 'slide-6',
    beatLabel: 'Dream',
    mediaType: 'image',
    background: WEB_ASSETS.slide6Frame,
    grade: 'linear-gradient(110deg, rgba(12, 12, 12, 0.72), rgba(198, 184, 151, 0.18))',
    poemTitle: 'yearning',
    poemLines: [
      'In my black and white dreams, your face stayed in color.',
      'I wished for ordinary moments: tea, rain, your shoulder near mine.',
      'I could only see two lovers, side by side, for ever.'
    ],
    crinkle: 0.42,
    faces: [
      { id: 'partner', src: '/assets/faces/partner.png', top: '34%', left: '55%', width: '15%', rotation: 1 }
    ]
  },
  {
    id: 'slide-7',
    beatLabel: 'Firecrackers',
    mediaType: 'image',
    background: WEB_ASSETS.slide7Frame,
    grade: 'linear-gradient(120deg, rgba(32, 12, 8, 0.58), rgba(235, 144, 79, 0.22))',
    poemTitle: 'present & future',
    poemLines: [
      'Scenes cuto to now: sparks bloom above us, and we do not flinch.',
      'I hold your hand and the future stops feeling abstract.',
      'I finally see my hope, and my hope has your voice in it.'
    ],
    crinkle: 0.25,
    faces: [
      { id: 'author', src: '/assets/faces/author.png', top: '36%', left: '42%', width: '14%', rotation: -2 },
      { id: 'partner', src: '/assets/faces/partner.png', top: '35%', left: '56%', width: '14%', rotation: 2 }
    ]
  },
  {
    id: 'slide-8',
    beatLabel: 'To Be Continued',
    mediaType: 'image',
    background: WEB_ASSETS.slide8Frame,
    grade: 'linear-gradient(115deg, rgba(11, 8, 7, 0.52), rgba(198, 151, 98, 0.18))',
    poemTitle: 'contentment',
    poemLines: [
      'Your shoulder became home before I noticed.',
      'The world softened, and we stayed.',
      'This is not an ending, we are only beginning.'
    ],
    crinkle: 0.1,
    faces: [
      { id: 'author', src: '/assets/faces/author.png', top: '35%', left: '44%', width: '14%', rotation: -1 },
      { id: 'partner', src: '/assets/faces/partner.png', top: '34%', left: '58%', width: '14%', rotation: 2 }
    ]
  }
];
