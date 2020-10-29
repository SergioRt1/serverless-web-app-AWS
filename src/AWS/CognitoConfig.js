import {CognitoUserPool} from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'us-east-1_DcPkwh4UR',
  ClientId: '2rcajrs9vrdclol9g6bm9s2cjb',
}

export default new CognitoUserPool(poolData);
