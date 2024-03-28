import { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  }

  const [state, dispatch] = useReducer(githubReducer, initialState)

  // Get single user
  const getUser = async (login) => {
    setLoading()

    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      header: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })

    if (response.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await response.json()

      dispatch({
        type: 'GET_USER',
        payload: data,
      })
    }
  }

  // Get user repos
  const getUserRepos = async (login) => {
    setLoading()

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10,
    })

    const response = await fetch(
      `${GITHUB_URL}/users/${login}/repos?${params}`,
      {
        header: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    )
    const data = await response.json()

    dispatch({
      type: 'GET_REPOS',
      payload: data,
    })
  }

  // Set loading
  const setLoading = () =>
    dispatch({
      type: 'SET_LOADING',
    })

  // Clear users
  const clearUsers = () => {
    dispatch({
      type: 'CLEAR_USERS',
    })
  }

  return (
    <GithubContext.Provider
      value={{
        ...state, // spread operator spreads around the state values
        dispatch, // Since I want to dispatch from the components
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
