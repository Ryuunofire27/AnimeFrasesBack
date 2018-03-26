const crypto = require('crypto');

const hmac = crypto.createHmac('sha256', 'afErChCoWa');

hmac.update('ayasetan27');
console.log(hmac.digest('hex'));