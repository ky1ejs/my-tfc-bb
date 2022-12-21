import { Tokens, LoginConfig, LoginCredentials } from "@models";
import axios, { AxiosResponse } from "axios";
import { JSDOM } from "jsdom";
import { stringify } from "querystring";
import myTfcEndpoints from "./endpoints";
import { TfcApiError } from "./TfcApiError";

export function getConfig(): Promise<LoginConfig> {
  return axios
    .get(
      myTfcEndpoints.authConfig,
      {
        params: {
          client_id: "my-tfc",
          redirect_uri: "https://my.tfc.com/",
          response_mode: "fragment",
          response_type: "code",
          scope: "openid",
          nonce: "f9c25d08-9bf1-4006-bf44-2b7e56a98275",
        },
        withCredentials: true,
      }
    )
    .then(parseConfig);
}

export function parseConfig(response: AxiosResponse): LoginConfig {
  const dom = new JSDOM(response.data);
  const loginForm = dom.window.document.getElementById("kc-form-login");
  const loginUrl = loginForm?.getAttribute("action");
  const cookies = response.headers["set-cookie"];
  if (!loginForm || !loginUrl || !cookies) {
    throw new Error("couldn't find the form and/or url");
  }
  return { loginUrl, cookies };
}

export function authenticate(
  { cookies, loginUrl }: LoginConfig,
  { username, password }: LoginCredentials
): Promise<AxiosResponse> {
  const logInDetails = { username: username, password: password };
  return axios
    .post(loginUrl, stringify(logInDetails), {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
    })
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 502) {
          return Promise.reject(TfcApiError.badGateway());
        }

        if (error.response.status === 400) {
          const dom = new JSDOM(error.response.data);
          const errorContainer =
            dom.window.document.getElementById("kc-error-message");
          const errorTextElement =
            errorContainer?.getElementsByClassName("instruction");
          const errorText = errorTextElement?.[0].textContent;
          if (errorText === "Invalid username or password.") {
            return Promise.reject(TfcApiError.invalidPassword());
          }
        }
      }

      return Promise.reject(error);
    });
}

export function getCode(response: AxiosResponse): string {
  const url = new URL(response.request.res.responseUrl);
  const code = url.hash
    .replace("#", "")
    .split("&")
    .map((s) => s.split("="))
    .reduce((map, kv) => {
      map.set(kv[0], kv[1]);
      return map;
    }, new Map<string, string>())
    .get("code");

  if (!code) {
    throw new Error("did not get a code");
  }
  return code;
}

export function exchangeCodeForToken(code: string): Promise<Tokens> {
  const form = {
    grant_type: "authorization_code",
    client_id: "my-tfc",
    code: code,
    redirect_uri: "https://my.tfc.com/",
  };
  return axios
    .post(
      myTfcEndpoints.token,
      stringify(form),
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((res) => res.data);
}
