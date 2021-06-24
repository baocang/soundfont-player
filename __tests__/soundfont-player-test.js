/* global describe it AudioContext */
require('web-audio-test-api')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var load = require('@baocang/audio-loader')
var Soundfont = require('..')

var piano = fs.readFileSync(path.join(__dirname, '../examples/assets/acoustic_grand_piano-ogg.js'))

load.fetch = function (url) {
  load.fetch.url = url
  return Promise.resolve(piano.toString())
}

describe('Soundfont player', () => {
  describe('Load instruments', () => {
    it('returns a promise', () => {
      var ac = new AudioContext()
      assert.strictEqual(typeof Soundfont.instrument(ac, 'acoustic_grand_piano').then, 'function')
    })
    it('loads mp3 by default', () => {
      var ac = new AudioContext()
      return Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
        assert.strictEqual(piano.url,
          'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3.js')
      })
    })
    it('the promise resolve to an instrument', () => {
      var ac = new AudioContext()
      return Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
        assert.ok(piano)
        assert.strictEqual(piano.name, 'acoustic_grand_piano')
        assert.strictEqual(typeof piano.play, 'function')
      })
    })
    it('options.nameToUrl', () => {
      var ac = new AudioContext()
      var toUrl = function (name) { return 'URL:' + name + '.js' }
      return Soundfont.instrument(ac, 'acoustic_grand_piano', { nameToUrl: toUrl }).then(function (piano) {
        assert.strictEqual(piano.url, 'URL:acoustic_grand_piano.js')
      }).catch(function (err) {
        assert.strictEqual(err.path, 'URL:acoustic_grand_piano.js')
      })
    })
  })
  describe('Build urls', () => {
    it('get default url', () => {
      assert.strictEqual(Soundfont.nameToUrl('marimba'),
        'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/marimba-mp3.js')
    })
    it('get MusyngKite url', () => {
      assert.strictEqual(Soundfont.nameToUrl('marimba', 'FluidR3_GM'),
        'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/marimba-mp3.js')
    })
    it('accepts ogg', () => {
      assert.strictEqual(Soundfont.nameToUrl('marimba', null, 'ogg'),
        'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/marimba-ogg.js')
    })
  })
})
