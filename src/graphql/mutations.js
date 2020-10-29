/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      title
      content
      owner
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      title
      content
      owner
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      title
      content
      owner
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createUserCount = /* GraphQL */ `
  mutation CreateUserCount(
    $input: CreateUserCountInput!
    $condition: ModelUserCountConditionInput
  ) {
    createUserCount(input: $input, condition: $condition) {
      id
      count
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateUserCount = /* GraphQL */ `
  mutation UpdateUserCount(
    $input: UpdateUserCountInput!
    $condition: ModelUserCountConditionInput
  ) {
    updateUserCount(input: $input, condition: $condition) {
      id
      count
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserCount = /* GraphQL */ `
  mutation DeleteUserCount(
    $input: DeleteUserCountInput!
    $condition: ModelUserCountConditionInput
  ) {
    deleteUserCount(input: $input, condition: $condition) {
      id
      count
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
