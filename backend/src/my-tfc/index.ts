import { Tokens, LoginCredentials } from "@models";
import {
  authenticate,
  exchangeCodeForToken,
  getCode,
  getConfig,
} from "./login";

export default class TFC {
  login(creds: LoginCredentials): Promise<Tokens> {
    return getConfig()
      .then((config) => authenticate(config, creds))
      .then(getCode)
      .then(exchangeCodeForToken);
  }
}
