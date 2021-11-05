import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import { minify } from "terser";

function transformImports(content) {
  return content.toString()
    .replace('"./el"', '"./el.js"')
    .replace('"./state"', '"./state.js"')
    .replace('"./html"', '"./html.js"');
}

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
        { src: ['src/el.js', 'src/state.js', 'src/index.js', 'src/html.js'], dest: 'dist/browser', transform: transformImports },
        // Browser-minified
        { src: ['src/el.js', 'src/state.js', 'src/index.js', 'src/html.js'], dest: 'dist/browser-min', transform: async (content) => {
            const importsTransformed = transformImports(content);
            const result = await minify(importsTransformed);
            return result.code;
          }
        },
        { src: "dist-README.md", rename: "README.md", dest: "dist" }
      ]
    })
  ],
};