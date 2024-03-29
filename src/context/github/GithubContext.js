import { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer'

const GithubContext = createContext()

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  }

  const [state, dispatch] = useReducer(githubReducer, initialState)

  return (
    <GithubContext.Provider
      value={{
        ...state, // spread operator spreads around the state values
        dispatch, // Since I want to dispatch from the components
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
