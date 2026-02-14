import { motion } from 'framer-motion';

const MOON_PATH =
  'M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z';

const RAYS = Array.from({ length: 10 }, (_, index) => index * 36);

export default function MoonSunMorph({ progress }) {
  const sun = Math.max(0, Math.min(1, progress));
  const moon = 1 - sun;

  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: -16 + sun * 16 }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <defs>
        <radialGradient id="sun-core" cx="35%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFF4CC" />
          <stop offset="60%" stopColor="#FFD773" />
          <stop offset="100%" stopColor="#F4A84A" />
        </radialGradient>
      </defs>

      <motion.circle
        cx="12"
        cy="12"
        r="6.6"
        fill="url(#sun-core)"
        animate={{ opacity: 0.2 + sun * 0.82, scale: 0.68 + sun * 0.35 }}
        transition={{ duration: 0.32 }}
      />

      <motion.g
        animate={{ opacity: sun, scale: 0.55 + sun * 0.45, rotate: sun * 28 }}
        transition={{ duration: 0.32 }}
      >
        {RAYS.map((angle) => (
          <line
            key={angle}
            x1="12"
            y1="1.5"
            x2="12"
            y2="4.2"
            stroke="#FFD982"
            strokeWidth="1.4"
            strokeLinecap="round"
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
      </motion.g>

      <motion.path
        d={MOON_PATH}
        stroke="#D9E1F8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: moon, scale: 0.52 + moon * 0.48 }}
        transition={{ duration: 0.32 }}
      />

      <motion.g animate={{ opacity: moon, scale: 0.7 + moon * 0.3 }} transition={{ duration: 0.28 }}>
        <circle cx="8.5" cy="9.2" r="0.7" fill="#B4BFD8" />
        <circle cx="10.9" cy="13.4" r="0.55" fill="#B4BFD8" />
      </motion.g>

      <motion.g animate={{ opacity: moon * 0.9 }} transition={{ duration: 0.26 }}>
        <circle cx="4" cy="5" r="0.8" fill="#EEF3FF" />
        <circle cx="19.4" cy="4.4" r="0.6" fill="#EEF3FF" />
      </motion.g>
    </motion.svg>
  );
}
