/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './node_modules/flowbite-react/lib/esm/**/*.js',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      backgroundColor: {
        'kaito-brand-ash-green': '#3E6765',
      },

      colors: {
        'kaito-brand-ash-green': '#3E6765',
        'kaito-brand-gray': '#D9E2D5',
      },
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}

// const withMT = require("@material-tailwind/react/utils/withMT");

// module.exports = withMT({
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//         'gradient-conic':
//           'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
//       },

//       backgroundColor: {
//         'kaito-brand-ash-green': '#3E6765',
//       },

//       colors: {
//         'kaito-brand-ash-green': '#3E6765',
//         'kaito-brand-gray': '#D9E2D5',
//       },
//     },
//   },
//   plugins: [],
// });
