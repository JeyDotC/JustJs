import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/justjs.js',
      format: 'iife',
      name: 'justjs',
    },
    {
      file: 'dist/justjs.min.js',
      format: 'iife',
      name: 'justjs',
      plugins: [terser()]
    },
  ],
  plugins: [
    copy({
      targets: [
        { src: 'src/el.js', dest: 'dist/browser' },
        { src: 'src/state.js', dest: 'dist/browser' },
        { src: 'src/html.js', dest: 'dist/browser', transform: (content) => content.toString().replace('"./el"', '"./el.js"') },
        {
          src: 'src/index.js',
          dest: 'dist/browser',
          transform: (content) => content.toString()
            .replace('"./el"', '"./el.js"')
            .replace('"./state"', '"./state.js"')
            .replace('"./html"', '"./html.js"')
        },
      ]
    })
  ],
};