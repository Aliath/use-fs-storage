import typescript from '@rollup/plugin-typescript';
import packageData from './package.json';

export default [
  // CommonJS
  {
    input: 'src/main.ts',
    output: {
      dir: './dist',
      entryFileNames: packageData.main.replace('dist/', ''),
      format: 'cjs',
    },
    plugins: [
      typescript({
        declaration: true,
        declarationDir: './dist/types/',
        exclude: 'test/**.*',
        rootDir: '.',
      }),
    ]
  },

  // ES
  {
    input: 'src/main.ts',
    output: {
      file: packageData.module,
      format: 'es'
    },
    plugins: [
      typescript(),
    ]
  },
]