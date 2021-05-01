Realization of login method:
```js
const jwt = require('json-web-token')
const {verifyAccessToken} = require('./middleware')
const {ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE = 120, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE = 86400} = process.env;

app.post('/login', (req, res) => {
  // check that user exists and pass is ok

	//create the access token with the shorter lifespan
	let accessToken = jwt.sign({username: req.body.username}, ACCESS_TOKEN_SECRET, {
		algorithm: "HS256",
		expiresIn: ACCESS_TOKEN_LIFE
	})

	//create the refresh token with the longer lifespan
	let refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
		algorithm: "HS256",
		expiresIn: REFRESH_TOKEN_LIFE
	})

	//store the refresh token in the BD and hash it or anywhere else safe place
	users[username].refreshToken = refreshToken

	//send the access token to the client inside a cookie
	res.cookie("jwt", accessToken, {secure: true, httpOnly: true})
	res.send()
})

app.post('/refresh_token', verifyAccessToken, routeHandler)
app.get('/do_some_as_a_user', verifyAccessToken, routeHandler)
```

Realization of JWT verification:
```js
const jwt = require('json-web-token')
exports.verifyAccessToken = function(req, res, next){
  	// NOTE!: To get the cookies - you need cookie-parser middleware app.use(require('cookie-parser')())
    let accessToken = req.cookies.jwt
    //if there is no token stored in cookies, the request is unauthorized
    if (!accessToken){
        return res.status(403).send()
    }
    let payload
    try{
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        next()
    }
    catch(e){
        //if an error occured return request unauthorized error
        return res.status(401).send()
    }
}
```

Realization of getting the new access token, if refresh token is still alive:
```js
const {verifyAccessToken} = require('./middleware')
app.post('/refresh_token', (req, res) => {
    //retrieve the refresh token from your safe place
    let refreshToken = users[payload.username].refreshToken

    //verify the refresh token
    try{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    }
    catch(e){
        return res.status(401).send()
    }

    let newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,
    {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_LIFE
    })

    res.cookie("jwt", newToken, {secure: true, httpOnly: true})
    res.send()
}
```
