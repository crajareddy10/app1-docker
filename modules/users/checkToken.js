/*

URL: /users/checkToken
METHOD: get
INPUTS: token (through auth)
OUTPUT: user_id

*/

module.exports = (initialState) => {

  initialState.response = {
    userId: initialState.logged_in_user_id
  }

  return initialState


}
