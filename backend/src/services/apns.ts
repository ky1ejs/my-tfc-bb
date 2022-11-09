import jwt from 'jsonwebtoken'
import http2 from 'http2'
import { PushToken, TokenEnv } from '@prisma/client'

/*
Read p8 file. Assumes p8 file to be in same directory
*/
const KEY = process.env.PUSH_P3

export function sendPush(message: string, deviceToken: PushToken): Promise<void> {
  const path = `/3/device/${deviceToken}`
  const bearerToken = createBearerToken()
  const body = {
    aps: {
        alert: message
    }
  }
const headers = {
    ':method': 'POST',
    'apns-topic': 'dev.kylejs.My-TFC-BB', //your application bundle ID
    ':scheme': 'https',
    ':path': path,
    'authorization': `bearer ${bearerToken}`
}

  return new Promise((resolve, reject) => {
    const client = http2.connect(getHostForEnv(deviceToken.env));
    client.on('error', (err) => reject(err));
    const request = client.request(headers);
    request.on('response', (headers, flags) => {
      for (const name in headers) {
          console.log(`${name}: ${headers[name]}`);
      }
  });
  
  request.setEncoding('utf8');
  let data = ''
  request.on('data', (chunk) => { data += chunk; });
  request.write(JSON.stringify(body))
  request.on('end', () => {
      console.log(`\n${data}`);
      resolve()
      client.close();
  });
  request.end();
  })
}


//"iat" should not be older than 1 hr from current time or will get rejected
function createBearerToken(): string {
  if (!KEY) throw new Error("No push key")

  return jwt.sign(
    {
        iss: "X2TBSUCASC", //"team ID" of your developer account
        iat: Math.floor(new Date().getTime() / 1000) //Replace with current unix epoch time [Not in milliseconds, frustated me :D]
    },
    KEY,
    {
        header: {
            alg: "ES256",
            kid: "5W6SH6ZZ4Q", //issuer key which is "key ID" of your p8 file
        }
    }
)
  }


function getHostForEnv(env: TokenEnv): string {
  switch (env) {
    case TokenEnv.STAGING: return 'https://api.sandbox.push.apple.com'
    case TokenEnv.PRODUCTION: return 'https://api.push.apple.com'
  }
}
/* 
  Use '' for production build
*/




