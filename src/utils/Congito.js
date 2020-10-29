import {CognitoUser} from "amazon-cognito-identity-js";
import UserPool from "../AWS/CognitoConfig";

class CognitoUtils {
  static toUsername(email) {
    return email.replace('@', '-at-');
  }
  static getUser(email) {
    return new CognitoUser({
      Username: CognitoUtils.toUsername(email),
      Pool: UserPool
    })
  }
}

export default CognitoUtils;
