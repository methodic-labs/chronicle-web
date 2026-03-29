module.exports = {
  plugins: [
    '@babel/plugin-transform-runtime',
    'babel-plugin-styled-components',
  ],
  presets: [
    ['@babel/preset-env', {
      corejs: '3.25',
      useBuiltIns: 'entry',
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
    }],
    '@babel/preset-flow',
  ],
};
