module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    // Transform: Remove project reference for plain JS files
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Transformiere Fehler in Warnungen, wo sinnvoll
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // Erlaube explizite any in bestimmten Kontexten
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    
    // Code-Qualität
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'prefer-const': 'warn',
    'no-var': 'error',
    
    // React-spezifisch - Transform: Make unescaped entities a warning
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'warn',
    
    // Next.js-spezifisch
    '@next/next/no-html-link-for-pages': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    'build/',
    '.nvm/',
    'scripts/',
    '*.config.js',
    '*.config.mjs',
    '*.config.cjs'
  ],
  overrides: [
    {
      // Transform: Disable type-aware linting for plain JS files
      files: ['*.js', '*.jsx'],
      extends: ['eslint:recommended'],
      parserOptions: {
        project: null
      }
    }
  ]
};
