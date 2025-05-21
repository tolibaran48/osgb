import React, { useEffect, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext } from './context/authContext';
import AnonymousPage from './pages/anonymous/anonymous.routes';
import NotFound from './pages/notFound';
import PublicPage from './pages/halkla-iliskiler/publicRelation.routes';
import FinancePage from './pages/mali-isler/finance.routes';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from "react-google-recaptcha-v3";



import { useLazyQuery } from '@apollo/client';
import { GET_ACTIVE_USER } from './GraphQL/Queries/user/user';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/tr';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import './toast.css'
import './App.scss'

const App = () => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(customParseFormat)
  dayjs.locale('tr')
  const context = useContext(AuthContext);

  const [getActiveUser, { loading }] = useLazyQuery(GET_ACTIVE_USER, {
    onCompleted: (data) => {
      context.loadUser(data);
    },
    onError() {
      context.loading(false);
    }
  });

  useEffect(() => {
    getActiveUser();
  }, [])

  useEffect(() => {
    loading && context.loading(loading);
  }, [loading])

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.REACT_APP_CAPSITE}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >

      <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path='/hata' element={<NotFound />}></Route>
          <Route path='/halkla-iliskiler/*' element={<PublicPage />} />
          <Route path='/mali-isler/*' element={<FinancePage />} />
          <Route path='/yonetim-paneli/*' element={<AnonymousPage />} />
          <Route path='/*' element={<AnonymousPage />} />
        </Routes>
      </div>
    </GoogleReCaptchaProvider>
  );
}

export default App;
