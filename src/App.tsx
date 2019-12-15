import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { remote } from 'electron'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Board from './components/Board'
import Home from './components/Home'
import GlobalStyles from './GlobalStyles'

const App: React.FC = () => {
  const { shouldUseDarkColors } = remote.nativeTheme
  const theme = createMuiTheme({
    palette: {
      type: shouldUseDarkColors ? 'dark' : 'light'
    }
  })

  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <GlobalStyles />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/board/:boardId" component={Board} />
          <Redirect to="/" />
        </Switch>
      </div>
    </MuiThemeProvider>
  )
}
export default App
