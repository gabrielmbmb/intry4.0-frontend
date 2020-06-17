import axios, { AxiosResponse, AxiosError } from 'axios';
import qs from 'query-string';

const BASE_URL = process.env.VUE_APP_BACKEND_HOST;
const GRANT_TYPE = process.env.VUE_APP_BACKEND_GRANT_TYPE;
const CLIENT_ID = process.env.VUE_APP_BACKEND_CLIENT_ID;
const CLIENT_SECRET = process.env.VUE_APP_BACKEND_CLIENT_SECRET;

class BackendService {
  public doLogin(mail: string, password: string) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const payload = {
        grant_type: GRANT_TYPE,
        client_secret: CLIENT_SECRET,
        client_id: CLIENT_ID,
        username: mail,
        password,
      };

      axios
        .post(`${BASE_URL}/o/token/`, qs.stringify(payload), { headers })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }

  public doLogout(token: string) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const payload = {
        client_secret: CLIENT_SECRET,
        client_id: CLIENT_ID,
        token,
      };

      axios
        .post(`${BASE_URL}/o/revoke_token/`, qs.stringify(payload), { headers })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }

  public getUserInfo(token: string) {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`${BASE_URL}/o/user_info/`, { headers })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }

  public getUsers(token: string) {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`${BASE_URL}/api/v1/users/`, { headers })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }

  public createUser(
    user: {
      email: string;
      username: string;
      name: string;
      lastname: string;
      password: string;
      password2: string;
    },
    token: string
  ) {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .post(`${BASE_URL}/api/v1/users/`, user, { headers })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }

  public updateUser(payload: object, id: number, token: string) {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .patch(`${BASE_URL}/api/v1/users/${id}/`, payload, { headers })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }

  public updatePassword(
    passwords: { old_password: string; password: string; password2: string },
    token: string
  ) {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .post(`${BASE_URL}/api/v1/users/update_password/`, passwords, {
          headers,
        })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }

  public deleteUser(id: number, token: string) {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .delete(`${BASE_URL}/api/v1/users/${id}/`, {
          headers,
        })
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: AxiosError) => reject(err));
    });
  }
}

export default new BackendService();
