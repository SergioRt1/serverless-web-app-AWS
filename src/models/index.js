// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Post, Users } = initSchema(schema);

export {
  Post,
  Users
};