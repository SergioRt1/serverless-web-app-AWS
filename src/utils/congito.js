class CognitoUtils {
  static toUsername(email) {
    return email.replace('@', '-at-');
  }
}

export default CognitoUtils;
