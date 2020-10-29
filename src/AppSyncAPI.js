import appSyncConfig from './aws-exports';
import AWSAppSyncClient from "aws-appsync";
import {onCreatePost, onUpdateUserCount} from "./graphql/subscriptions";
import {getUserCount, listPosts} from "./graphql/queries";
import gql from 'graphql-tag';
import {DataStore} from "@aws-amplify/datastore";
import {Post} from "./models";
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
    const newPost = await DataStore.save(post);
    await AppSyncAPI.createAsync(client, newPost);

    return newPost;
  }

  static async createAsync(client, newPost) {
    await client.query({query: gql(createPost), fetchPolicy: "network-only", variables: {input: newPost}});
  }

  listenAppSync = async (countCallback) => {
    const client = await AppSyncAPI.initClient.hydrated();

    [this.postListener, this.userListener] = await Promise.all([
      this.listenPosts(client),
      this.listenUserCount(client, countCallback),
    ]);
  }

  listenPosts = async (client) => {
    try {
      const [initialPosts, currentPosts] = await Promise.all([
        client.query({query: gql(listPosts), fetchPolicy: "network-only"}),
        DataStore.query(Post),
      ]);
      if (!initialPosts.errors) {
        this.synchronizePosts(currentPosts, initialPosts, client);

        const observablePosts = client.subscribe({query: gql(onCreatePost), fetchPolicy: "network-only"})
        observablePosts.subscribe({
          next(value) {
            console.log("Received subscription GraphQL: ", value)
            //DataStore.save(post);
          },
          error(errorValue) {
            console.error("Error subscription", errorValue)
          }
        })

        return observablePosts;
      }
    } catch (e) {
      console.error(e);
    }
  }

  synchronizePosts(currentPosts, initialPosts, client) {
    const currentIds = new Map(currentPosts.map((post) => [post.id, post]));
    const areOnline = new Map(currentPosts.map((post) => [post.id, false]));
    initialPosts.data.listPosts.items.forEach((post) => {
      console.log("Received GraphQL: ", post)
      if (!currentIds.has(post.id)) {
        areOnline[post.id] = true;
        DataStore.save(new Post({
          "id": post.id,
          "title": post.title,
          "content": post.content,
          "owner": post.owner,
        }));
      }
    })
    areOnline.forEach((v, k) => {
      if (!v) {
        AppSyncAPI.createAsync(client, currentIds[k]);
      }
    });
  }

  listenUserCount = async (client, callback) => {
    const count = await client.query({
      query: gql(getUserCount),
      fetchPolicy: "network-only",
      variables: {input: {id: "unic_count"}}
    })
    if (!count.errors) {
      console.log("Received GraphQL data: ", count.data)
      client.query({
        query: gql(updateUserCount),
        fetchPolicy: "network-only",
        variables: {input: {id: "unic_count", count: count.data.getUserCount.count + 1}},
      });
      const observableUserCount = client.subscribe({query: gql(onUpdateUserCount), fetchPolicy: "network-only"})
      observableUserCount.subscribe({
        next(value) {
          //callback(value)
          console.log("Received subscription GraphQL count: ", value)
        },
        error(errorValue) {
          console.error("Error subscription", errorValue)
        }
      })

      return observableUserCount;
    }
  }
}

export default AppSyncAPI;
