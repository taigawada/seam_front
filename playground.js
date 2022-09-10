// import crypto from 'crypto';
const crypto = require('crypto');
(() => {
  console.log(crypto.randomBytes(128).readUInt32BE());
})();
