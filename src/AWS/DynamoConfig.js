const AWS = require('aws-sdk');
const DynamoDBStream = require('dynamodb-stream')

class Dynamo {
  constructor(table, consumer) {
    this.table = table;
    this.db = new AWS.DynamoDB.DocumentClient();
    this.stream = new DynamoDBStream(new AWS.DynamoDBStreams(), 'arn:aws:dynamodb:us-east-1:579873381819:table/SociallyPosts/stream/2020-10-29T01:45:45.469');
    this.consumer = consumer
  }

  subscribe = () => {
    this.stream.fetchStreamRecords(this.consumer);
  }

  getInitialRecords = (callback) => {
    this.db.scan({tableName: this.table}, callback);
  }

  recordItem = (item) => {
    return this.db.put({
      TableName: this.table,
      Item: {
        ...item,
        RequestTime: new Date().toISOString(),
      },
    }).promise();
  }
}

function toUrlString(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default Dynamo;


