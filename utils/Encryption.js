import crypto from 'crypto'

const algorithm = 'aes-256-ctr'

module.exports = {

  encrypt(text, password) {

    const cipher = crypto.createCipher(algorithm, password)

    let crypted = cipher.update(text, 'utf8', 'hex')

    crypted += cipher.final('hex')

    return crypted;

  },

  decrypt(text, password) {

    const decipher = crypto.createDecipher(algorithm, password)

    let dec = decipher.update(text, 'hex', 'utf8')

    dec += decipher.final('utf8');

    return dec;


  }

}
