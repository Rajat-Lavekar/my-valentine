import { WEB_ASSETS } from './webAssets';

export const INTRO_AUDIO = '/assets/audio/intro-instrumental.mp3';
export const INTRO_CUE_AUDIO = '/assets/audio/intro-cue.mp3';
export const PAPER_AUDIO = '/assets/audio/paper-unfold.mp3';

export const storySlides = [
  {
    id: 'slide-1',
    beatLabel: 'Beginning',
    mediaType: 'image',
    background: WEB_ASSETS.sunflowerField,
    audio: '/assets/audio/01-sunflower-field.mp3',
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
    background: WEB_ASSETS.slideTwoFrame,
    audio: '/assets/audio/02-falling-star.mp3',
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
    background: '/assets/slides/03-flower-rejection.jpg',
    audio: '/assets/audio/03-flower-rejection.mp3',
    grade: 'linear-gradient(115deg, rgba(46, 20, 18, 0.62), rgba(210, 148, 88, 0.25))',
    poemTitle: 'sad, then smiling',
    poemLines: [
      'I offered a flower and received a lesson in timing.',
      'My heart hurt, but somehow it still laughed with me.',
      'Even that no became part of our yes.'
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
    background: '/assets/slides/04-below-house.jpg',
    audio: '/assets/audio/04-below-house.mp3',
    grade: 'linear-gradient(115deg, rgba(7, 10, 19, 0.72), rgba(130, 88, 43, 0.3))',
    poemTitle: 'restraint',
    poemLines: [
      'I waited beneath your window with patient footsteps.',
      'Longing taught me discipline, not distance.',
      'Some nights, devotion is simply staying.'
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
    background: '/assets/slides/05-classroom.jpg',
    audio: '/assets/audio/05-classroom.mp3',
    grade: 'linear-gradient(110deg, rgba(23, 18, 10, 0.55), rgba(180, 130, 69, 0.2))',
    poemTitle: 'mutual awareness',
    poemLines: [
      'Across old desks and unfinished notes, our eyes kept meeting.',
      'The room was full, yet it felt like a secret corridor.',
      'We were no longer strangers pretending.'
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
    background: '/assets/slides/06-dream-black-white.jpg',
    audio: '/assets/audio/06-dream.mp3',
    grade: 'linear-gradient(110deg, rgba(12, 12, 12, 0.72), rgba(198, 184, 151, 0.18))',
    poemTitle: 'yearning',
    poemLines: [
      'In black and white dreams, your face stayed in color.',
      'I wished for ordinary moments: tea, rain, your shoulder near mine.',
      'Desire became gentle, then true.'
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
    background: '/assets/slides/07-firecrackers.jpg',
    audio: '/assets/audio/07-firecrackers.mp3',
    grade: 'linear-gradient(120deg, rgba(32, 12, 8, 0.58), rgba(235, 144, 79, 0.22))',
    poemTitle: 'present & future',
    poemLines: [
      'Now sparks bloom above us, and we do not flinch.',
      'I hold your hand and the future stops feeling abstract.',
      'Hope has your voice in it.'
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
    background: '/assets/slides/08-shoulder-rest.jpg',
    audio: '/assets/audio/08-outro-instrumental.mp3',
    grade: 'linear-gradient(115deg, rgba(11, 8, 7, 0.62), rgba(198, 151, 98, 0.2))',
    poemTitle: 'contentment',
    poemLines: [
      'Your shoulder became home before I noticed.',
      'The world softened, and we stayed.',
      'This is not an ending, only a quiet next chapter.'
    ],
    crinkle: 0.1,
    faces: [
      { id: 'author', src: '/assets/faces/author.png', top: '35%', left: '44%', width: '14%', rotation: -1 },
      { id: 'partner', src: '/assets/faces/partner.png', top: '34%', left: '58%', width: '14%', rotation: 2 }
    ]
  }
];
