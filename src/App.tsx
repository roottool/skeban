import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import GlobalStyles from './GlobalStyles'
import Board from './components/Board'
import Home from './components/Home'

const App: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/board/:boardId" component={Board} />
        <Redirect to="/" />
      </Switch>
    </div>
  )
}
export default App
