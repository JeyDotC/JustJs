import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/justjs.js',
      format: 'iife',
      name: 'justjs'
    },
    {
      file: 'dist/justjs.min.js',
      format: 'iife',
      name: 'justjs',
      plugins: [terser()]
    }
  ]
};