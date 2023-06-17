import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Menu from './Menu';
import routes from './route.config';
import configureValidations from './Validations';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { claim } from './Auth/auth.models';
import AuthenticationContext from './Auth/AuthenticationContext';
import { getClaims } from './Auth/JWTHandler';
import configureInterceptor from './Utilities/HttpInterceptors';

configureValidations();
configureInterceptor();

function App() {

  const [claims, setClaims] = useState<claim[]>([
    //de aici pun claimurile
    // { name: "email", value: "email@email.com" },  ////!!!!!!!!!!!!!!!!
    //{ name: "role", value: "admin" },  ////!!!!!!!!!!!!!!!!
  ]);

  useEffect(() => {
    setClaims(getClaims());
  }, [])

  const isAdmin = () => {
    return claims.findIndex(claim => claim.name === 'role' &&
      claim.value === 'admin') > -1;
  }
  const isUser = () => {
    return claims.findIndex(claim => claim.name === 'type' &&
      claim.value === 'User') > -1;
  }

  const isAuthenticated = () => {
    return claims.length === 0;
  }

  return (
    <BrowserRouter>

      <AuthenticationContext.Provider value={{ claims, update: setClaims }}>

        <ToastContainer />
        <Menu />
        <div className='container'>
          <Switch>
            {routes.map(route =>
              <Route key={route.path} path={route.path} exact={route.exact} >
                {route.isAdmin && !isAdmin() ? <h1>Not authorized to see this page</h1> :
                  route.isAuthenticated && isAuthenticated() ? <h1>Not authorized to see this page</h1> :
                    route.isUser &&
                      !isUser() && !isAdmin() ? <h1>Not authorized to see this page</h1> :
                      <route.component />}
              </Route>
            )}
          </Switch>
        </div>
        <footer className='bd-footer py-5 mt-5 bg-light'>
          <div className='container'>Game Reviews {new Date().getFullYear().toString()}</div>
        </footer>

      </AuthenticationContext.Provider>
    </BrowserRouter >
  );
}
export default App;
