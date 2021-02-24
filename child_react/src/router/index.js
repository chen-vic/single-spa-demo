import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import App from '@/App';

function RouterConfig() {
  return (
    <div>
      <BrowserRouter basename="/react">
        <div>
          <Link to="/">react home page</Link> | 
          <Link to="/about">react about page </Link>
        </div>

        <Switch>
          <Route exact path="/" component={App} />
          <Route
            exact
            path="/about"
            render={() => <h1>react about page</h1>}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default RouterConfig;
