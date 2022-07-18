module.exports = {

  check(event, callback) {

    if(event && event.keepwarm){

      callback(null, 'success')
      return true

    }

    return false

  }

}
