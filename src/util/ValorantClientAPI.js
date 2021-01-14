const { net, session } = window.require('electron').remote;

class ValorantClientAPI {
  static async request(ses, method, url, headers, data) {
    return new Promise((res, rej) => {
      const dataString = JSON.stringify(data);
      const newHeaders = { 'Content-Type': 'application/json', ...headers };
      const req = net.request({
        method,
        headers: newHeaders,
        url,
        session: ses,
        useSessionCookies: true,
      });
      let body = '';
      req.on('response', (response) => {
        response.on('end', () => {
          const result = {
            data: JSON.parse(body),
            headers: response.headers,
            status: response.statusCode,
          };
          res(result);
        });

        response.on('data', (chunk) => {
          body += chunk.toString();
        });

        response.on('error', (error) => {
          rej(error);
        });
      });
      req.write(dataString);
      req.end();
    });
  }

  static async login(username, password, region) {
    const data = {
      client_id: 'play-valorant-web-prod',
      nonce: '1',
      redirect_uri: 'https://playvalorant.com/opt_in',
      response_type: 'token id_token',
      scope: 'account openid',
    };

    const ses = session.fromPartition(`${region}#${username}`);
    ses.clearStorageData();
    const result = await this.request(ses, 'POST', 'https://auth.riotgames.com/api/v1/authorization', {}, data);
    if (result.data.type === 'auth') {
      const data2 = {
        type: 'auth',
        username,
        password,
      };
      const result2 = await this.request(ses, 'PUT', 'https://auth.riotgames.com/api/v1/authorization', {}, data2);
      const urlRegex = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;

      const reMatch = result2.data.response.parameters.uri.match(urlRegex);
      const accessToken = reMatch[1];
      const idToken = reMatch[2];
      const expiresIn = reMatch[3];

      const authHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
      const result3 = await this.request(ses, 'POST', 'https://entitlements.auth.riotgames.com/api/token/v1', authHeaders, {});
      const entitlementsToken = result3.data.entitlements_token;

      authHeaders['X-Riot-Entitlements-JWT'] = entitlementsToken;

      const result4 = await this.request(ses, 'POST', 'https://auth.riotgames.com/userinfo', authHeaders, {});
      return {
        accessToken,
        idToken,
        expiresIn,
        entitlementsToken,
        userId: result4.data.sub,
      };
    }
    throw new Error();
  }
}

export default ValorantClientAPI;
