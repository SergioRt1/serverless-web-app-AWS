import appSyncConfig from './aws-exports';
import AWSAppSyncClient from "aws-appsync";
import {onCreatePost, onUpdateUserCount} from "./graphql/subscriptions";
import {getUserCount, listPosts} from "./graphql/queries";
import gql from 'graphql-tag';
import {createPost, updateUserCount} from "./graphql/mutations";

class AppSyncAPI {
  static initClient = new AWSAppSyncClient({
    url: appSyncConfig.aws_appsync_graphqlEndpoint,
    region: appSyncConfig.aws_appsync_region,
    auth: {
      type: appSyncConfig.aws_appsync_authenticationType,
      apiKey: appSyncConfig.aws_appsync_apiKey,
    }
  });

  cancel = () => {
    if (this.postListener) {
      this.postListener.unsubscribe()
    }
    if (this.userListener) {
      this.userListener.unsubscribe()
    }
  }

  static createPost = async (post) => {
    const client = await AppSyncAPI.initClient.hydrated();

    return await AppSyncAPI.createAsync(client, post);
  }

  static async createAsync(client, newPost) {
    const result = await client.mutate({
      mutation: gql(createPost),
      fetchPolicy: "no-cache",
      variables: {input: newPost}
    });
    if (!result.errors)
      return result.data.createPost
    else
      throw result.errors
  }

  listenAppSync = async (countCallback, postCallback) => {
    const client = await AppSyncAPI.initClient.hydrated();

    [this.postListener, this.userListener] = await Promise.all([
      this.listenPosts(client, postCallback),
      this.listenUserCount(client, countCallback),
    ]);
  }

  loadPosts = async (callback) => {
    const client = await AppSyncAPI.initClient.hydrated();
    const initialPosts = await client.query({query: gql(listPosts), fetchPolicy: "network-only"});
    if (!initialPosts.errors) {
      callback(initialPosts.data.listPosts.items);
    } else {
      console.error(initialPosts.errors)
    }
  }

  loadUserCount = async (callback) => {
    const client = await AppSyncAPI.initClient.hydrated();
    const count = await client.query({
      query: gql(getUserCount),
      fetchPolicy: "network-only",
      variables: {id: "unic_count"},
    })
    if (!count.errors) {
      callback(count.data.getUserCount.count);
    } else {
      console.error(count.errors);
    }
  }

  increaseUserCountBy = async (number) => {
    const client = await AppSyncAPI.initClient.hydrated();
    const count = await client.query({
      query: gql(getUserCount),
      fetchPolicy: "network-only",
      variables: {id: "unic_count"},
    });
    if (!count.errors) {
      const current = count.data.getUserCount
      console.log("Received GraphQL data: ", count.data)
      const newCount = await client.mutate({
        mutation: gql(updateUserCount),
        fetchPolicy: "no-cache",
        variables: {input: {id: current.id, count: current.count + number, _version: current._version}},
      });
      console.log("Received GraphQL data: ", newCount)
    }
  }

  listenPosts = async (client, callback) => {
    const observablePosts = client.subscribe({query: gql(onCreatePost), fetchPolicy: "network-only"})
    observablePosts.subscribe({
      next(value) {
        console.log("Received subscription GraphQL: post", value)
        callback(value.data.onCreatePost)
      },
      error(errorValue) {
        console.error("Error subscription", errorValue)
      }
    })

    return observablePosts;
  }

  listenUserCount = async (client, callback) => {
    const observableUserCount = client.subscribe({query: gql(onUpdateUserCount), fetchPolicy: "network-only"})
    observableUserCount.subscribe({
      next(value) {
        console.log("Received subscription GraphQL count: ", value)
        callback(value.data.onUpdateUserCount.count)
      },
      error(errorValue) {
        console.error("Error subscription", errorValue)
      }
    })

    return observableUserCount;
  }
}

export default AppSyncAPI;
