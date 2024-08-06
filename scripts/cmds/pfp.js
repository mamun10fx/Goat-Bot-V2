const axios = require('axios')
module.exports = {
  config: {
    name: 'pfp',
    version: '1.0',
    author: 'OtinXSandip',
    countDown: 5,
    role: 0,
    shortDescription: { en: 'Get some basic information about a user.' },
    longDescription: { en: 'Get some basic information about a user' },
    category: 'media',
    guide: { en: '{pn} [ blank | reply | uid | mention ]' },
  },
  onStart: async function ({
    api: _0x50d2e2,
    event: _0x36244f,
    args: _0x393d1d,
  }) {
    try {
      const {
        messageReply: _0x593990,
        senderID: _0x3941f2,
        threadID: _0x13b0d6,
        type: _0x42e7f6,
        mentions: _0x1b0808,
      } = _0x36244f
      let _0x2a9222
      if (_0x393d1d.length > 0) {
        _0x2a9222 = _0x393d1d[0]
      } else {
        if (_0x42e7f6 === 'message_reply') {
          _0x2a9222 = _0x593990.senderID
        } else {
          _0x393d1d.join().indexOf('@') !== -1
            ? (_0x2a9222 = Object.keys(_0x1b0808)[0])
            : (_0x2a9222 = _0x3941f2)
        }
      }
      let _0x50c9d4 = await _0x50d2e2.getUserInfo(_0x2a9222),
        {
          profileUrl: _0x776a00,
          name: _0x39b171,
          gender: _0x45c4a8,
        } = _0x50c9d4[_0x2a9222],
        _0x343e55 = ''
      if (_0x45c4a8 === 1) {
        _0x343e55 = 'female'
      } else {
        _0x45c4a8 === 2 ? (_0x343e55 = 'male') : (_0x343e55 = 'unknown')
      }
      const _0x2ee572 =
          'https://graph.facebook.com/' +
          _0x2a9222 +
          '/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662',
        _0x372218 = {
          body:
            '\u274FName: ' +
            _0x39b171 +
            '\n\u274FGender: ' +
            _0x343e55 +
            '\n\u274FUID: ' +
            _0x2a9222 +
            '\n\u274FProfile URL: ' +
            _0x776a00 +
            '\n\u274FProfile Picture:',
          attachment: await global.utils.getStreamFromURL(_0x2ee572),
        }
      return _0x50d2e2.sendMessage(_0x372218, _0x36244f.threadID)
    } catch (_0x579785) {
      console.error(_0x579785)
      _0x50d2e2.sendMessage(
        'Something went wrong, try again later..',
        _0x36244f.threadID
      )
    }
  },
}