import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
	query Login($username: String!, $password: String!) {
		login(username: $username, password: $password)
	}
`;

export const REGISTER_USER = gql`
	query Register($username: String!, $password: String!) {
		register(username: $username, password: $password) {
			id
			username
		}
	}
`;

export const CHECK_USER_NAME = gql`
query checkUsername($username: String!) {
    test: usernameExists(username: $username)
    user: usernameExists(username: $username)
  }
 `;
