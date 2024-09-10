const fs = require('fs')

const secrets = JSON.parse(fs.readFileSync('./secrets.json'))

const myHeaders = new Headers()
myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

const urlencoded = new URLSearchParams()
urlencoded.append("grant_type", "client_credentials")
urlencoded.append("scope", "api://8d11a908-64b2-4c3e-9b9d-e8b5b2935351/.default")
urlencoded.append("client_id", "b69ff622-0c2e-41ba-a91e-278af7b5f635")
urlencoded.append("client_secret", secrets.secret)

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: urlencoded,
  redirect: "follow"
}

fetch("https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/v2.0/token", requestOptions)
  .then((response) => response.text())
  .then((result) =>
    {
        secrets.token = JSON.parse(result).access_token
        fs.writeFileSync('./secrets.json', JSON.stringify(secrets, null, 4))
        console.log('(⌐■_■)')
    })
  .catch((error) => console.error(error))