import eslintConfigNext from 'eslint-config-next'

export default [
  ...eslintConfigNext,
  {
    ignores: ['node_modules', '.next', 'out', 'public', 'postcss.config.js', 'tailwind.config.js'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off'
    }
  }
]
