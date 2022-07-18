const getFromToken = (event) => {

  let token
  let id

  if(event.headers){

    if(event.headers.Authorization){
      token = event.headers.Authorization
    } else if(event.headers.authorization){
      token = event.headers.authorization
    }

  }

  let session_key

  if(token){

    token = token.replace('Bearer ', '')
    token = token.replace(/"/g, '')

    const token_arr = token.split('|')

    if(token_arr.length === 3){
      session_key = token_arr[0]
    }

  }

  return session_key

}

const getFromContext = (context) => {

  let id

  if(context.authorizer && context.authorizer.principalId){

    id = context.authorizer.principalId

  }

  return id

}

module.exports = (event, context) => {

  let principalId = event.principalId

  if(!principalId || principalId === 'null' || principalId === 'offlineContext_authorizer_principalId'){

    principalId = null

    if(process.env.ENV !== 'prod'){
      principalId = getFromToken(event)
    }

  }

  if(!principalId || principalId === 'null'){

    principalId = getFromContext(context)

  }

  return principalId



}
