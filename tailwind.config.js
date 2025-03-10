module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  webpack: (config) => {
    config.optimization.runtimeChunk = false;
    return config;
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
