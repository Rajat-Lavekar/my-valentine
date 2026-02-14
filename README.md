# My Valentine 💝

A romantic, scroll-driven cinematic experience built as a Valentine's Day gift. Features a moon-to-sun drag interaction, 8 story slides with poems, floating emojis, and zone-based background music.

## 🚀 Live Site

**https://rajat-lavekar.github.io/my-valentine/**

## 🛠 Tech Stack

- React + Vite
- Framer Motion (animations)
- Web Audio API (background music & SFX)
- GitHub Pages (hosting)

## 📦 Setup

```bash
npm install
npm run dev
```

The project runs at port 5173

## 🎨 Customizing Content

### Story Slides & Poems
**File:** `src/data/slides.js`

Update the `storySlides` array with your own:
- `poemTitle` and `poemLines`
- `beatLabel` (chapter name)
- `grade` (color overlay)

### Slide Backgrounds
**Folder:** `public/assets/slides/`

Replace these images (keep the same filenames):
- `01-slide.jpg` through `08-slide.png` (8 story slides)
- `S1-mv.png` (intro gate background)

### Audio Tracks
**Folder:** `public/assets/audio/`

Replace these files (keep the same filenames):
- `intro_instrumental.mov` (plays during intro + slide 1)
- `slides_music.mov` (plays from slide 2 onwards, no loop)
- `outro-instrumental.mov` (plays on last slide)

**File:** `src/data/slides.js` (lines 7-9)

### Intro Text
**File:** `src/components/IntroGate.jsx` (lines 211-214)

Update the thought cloud messages:
- Before drag: "Gently drag the moon across..."
- After completion: "The sun is awake now..."

### Valentine's Day Message
**File:** `src/components/CinematicSlide.jsx` (lines 153-155)

Update the finale overlay text on the last slide.

## 📁 Project Structure

```
my-valentine/
├── public/
│   └── assets/
│       ├── slides/      # Background images
│       ├── audio/       # Music tracks
│       └── faces/       # Unused, but planned for character overlays
├── src/
│   ├── components/      # React components
│   ├── data/
│   │   ├── slides.js    # Story content & poems
│   │   └── webAssets.js # Asset paths
│   ├── hooks/           # Audio & scroll logic
│   └── styles.css       # Global styles
└── vite.config.js       # Build config (base path)
```

## 🎵 Audio Flow

1. **Intro music** plays during moon drag + slide 1
2. **Slides music** starts on slide 2, plays once (no loop)
3. **Outro music** fades in on the last slide

## 🎭 Features

- Moon-to-sun drag interaction with day/night transition
- 8 cinematic slides with scroll-snap
- Crumpled paper poems that unfold on tap
- Per-slide floating emojis (🌻 🌠 💔 💕 👀 🖤 ✨ ❤️)
- Zone-based background music with smooth crossfades
- Custom sunflower cursor
- Romantic finale with "Happy Valentine's Day" message

## 📝 Notes

- Audio files are `.mov` format (works in all modern browsers)
- Site uses relative paths for GitHub Pages compatibility
- All animations use Framer Motion for smooth 60fps performance
