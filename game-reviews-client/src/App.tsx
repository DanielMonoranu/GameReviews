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

import css from './All.module.css';
import { cyan } from '@mui/material/colors';

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


        <div className={css.background}>
          <ToastContainer />
          <Menu />

          {/* <div style={{ color: ' white ' }}  > */}
          <div>

            <Switch>
              {routes.map(route =>
                <Route key={route.path} path={route.path} exact={route.exact} >
                  {route.isAdmin && !isAdmin() ?
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <h1>Not authorized to see this page</h1>
                    </div>
                    :
                    route.isAuthenticated && isAuthenticated() ?
                      <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <h1>Not authorized to see this page</h1>
                      </div> :

                      route.isUser &&
                        !isUser() && !isAdmin() ?
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                          <h1>Not authorized to see this page</h1>
                        </div>
                        :
                        <route.component />}
                </Route>
              )}
            </Switch>
          </div>


          <footer style={{ marginTop: 'auto', borderTop: '3px' }} className='bd-footer navbar-expand-lg py-2 bg-dark'  >
            <div className='container-fluid text-white'>Starry Reviews {new Date().getFullYear().toString()}</div>
          </footer>
        </div>
      </AuthenticationContext.Provider>
    </BrowserRouter >
  );
}
export default App;
