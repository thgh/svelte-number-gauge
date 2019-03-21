import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  {
    input: 'NumberGauge.html',
    output: [
      { file: pkg.main.replace('.js', '.custom.min.js'), format: 'iife', name: 'NumberGauge' }
    ],
    plugins: [
      resolve(),
      svelte({
        customElement: true,
        tag: 'number-gauge'
      }),
      terser()
    ]
  },
  {
    input: 'NumberGauge.html',
    output: [
      { file: pkg.main.replace('.js', '.min.js'), format: 'iife', name: 'NumberGauge' }
    ],
    plugins: [
      resolve(),
      svelte(),
      terser()
    ]
  },
  {
    input: 'NumberGauge.html',
    output: [
      { file: pkg.module, format: 'esm' }
    ],
    plugins: [
      resolve(),
      svelte()
    ]
  }
]
