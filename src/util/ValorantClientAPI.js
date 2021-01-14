import axios from 'axios';

const { net } = window.require('electron').remote;

class ValorantClientAPI {
  static login(username, password) {
    async function getTemplates() {
      const data = {
        client_id: 'play-valorant-web-prod',
        nonce: '1',
        redirect_uri: 'https://playvalorant.com/opt_in',
        response_type: 'token id_token',
        scope: 'account openid',
        withCredentials: true,
      };
      const res = await axios.post('https://auth.riotgames.com/api/v1/authorization', data);
    }
    getTemplates();
    return username + password;
  }
}

document.axios = axios;
document.net = net;
document.valorant = ValorantClientAPI;

export default ValorantClientAPI;
