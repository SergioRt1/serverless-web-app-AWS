// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Post, UserCount } = initSchema(schema);

export {
  Post,
  UserCount
};