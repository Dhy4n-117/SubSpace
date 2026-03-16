import { NhostClient } from '@nhost/react';
import { gql } from '@apollo/client';

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN || 'wovzonztpgwcblmdbdlk';
const region = import.meta.env.VITE_NHOST_REGION || 'ap-south-1';

console.log('Nhost Initialization:', { subdomain, region });

export const nhost = new NhostClient({
  authUrl: `https://${subdomain}.auth.${region}.nhost.run/v1`,
  graphqlUrl: `https://${subdomain}.graphql.${region}.nhost.run/v1`,
  storageUrl: `https://${subdomain}.storage.${region}.nhost.run/v1`,
  functionsUrl: `https://${subdomain}.functions.${region}.nhost.run/v1`,
});



export const GET_TODOS = gql`
  query GetTodos {
    todos(order_by: { created_at: desc }) {
      id
      title
      is_completed
      created_at
    }
  }
`;

export const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    insert_todos_one(object: { title: $title }) {
      id
      title
      is_completed
    }
  }
`;

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: uuid!, $is_completed: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { is_completed: $is_completed }) {
      id
      is_completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`;
