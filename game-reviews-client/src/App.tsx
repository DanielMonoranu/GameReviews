import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Menu from './Menu';
import routes from './route.config';
import configureValidations from './Validations';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

configureValidations();

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Menu />
      <div className='container'>
        <Switch>
          {routes.map(route =>
            <Route key={route.path} path={route.path} exact={route.exact} >
              <route.component />
            </Route>
          )}
        </Switch>
      </div>
      <footer className='bd-footer py-5 mt-5 bg-light'>
        <div className='container'>Game Reviews {new Date().getFullYear().toString()}</div>
      </footer>


    </BrowserRouter >
  );
}
export default App;
