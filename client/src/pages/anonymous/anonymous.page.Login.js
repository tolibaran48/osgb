import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from '../../GraphQL/Mutations/user/user';
import Isg_img from '../../images/logins.jpg';
import './anonymous.page.Login.scss'


const Login = () => {
  const [SignInValues, setSignIn] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const context = useContext(AuthContext);



  const [signIn] = useMutation(SIGN_IN, {
    variables: { email: SignInValues.email, password: SignInValues.password },
    update(proxy, { data: { signIn: values } }) {
      context.signIn(values);
      setSignIn({
        email: '',
        password: ''
      });
      navigate("/");
    },
    onError() {
      context.loading(false)
    }
  });

  const onFormSubmit = async e => {
    e.preventDefault();
    signIn()
  }

  return (
    <div className='login-container bg-nav-top'>
      <div className="login-section" style={{ background: 'linear-gradient(117deg, rgb(8, 51, 64) 0%, rgb(11, 70, 88) 27%, rgb(21, 108, 134) 53%, rgb(47, 150, 184) 70%, rgb(82, 191, 226) 84%, rgb(128, 221, 252) 100%)' }}>
        <div className="login-wrapper mx-auto my-auto" >
          <h1 className="login-title roboto.md" style={{ color: 'rgb(255, 89, 28)' }}>Giriş</h1>
          <form onSubmit={onFormSubmit} id='loginForm' style={{ background: 'none' }}>
            <div>
              <label htmlFor='email' className='mb-0 roboto-md' style={{ color: 'rgb(255, 89, 28)' }}>Kullanıcı Adı</label>
              <input
                className='mb-2 form-control roboto-lg'
                type='text'
                autoComplete='off'
                name='email'
                id='email'
                placeholder='Email veya Telefon Numaranız'
                style={{ borderBottomColor: 'rgb(255, 89, 28)', background: 'none', color: 'white' }}
                value={SignInValues.email}
                onChange={(e) => setSignIn({ ...SignInValues, email: e.target.value })}
              />
              <label htmlFor='password' className='mb-0 ' style={{ color: 'rgb(255, 89, 28)' }}>Şifre</label>
              <input
                className='mb-2 form-control roboto-lg'
                type='text'
                autoComplete='off'
                name='password'
                id='password'
                placeholder='Şifre'
                style={{ borderBottomColor: 'rgb(255, 89, 28)', background: 'none', color: 'white' }}
                value={SignInValues.password}
                onChange={(e) => setSignIn({ ...SignInValues, password: e.target.value })}
              />
            </div>
            <button type='submit' className='w-100 button btn-lg bg-logo' style={{ marginTop: '25px' }} form='loginForm'>Giriş Yap</button>
          </form>
          <div className='forgot-password'><a href="#!" className="forgot-password-link" style={{ color: 'whitesmoke', textDecoration: 'none' }}>Şifremi unuttum</a></div>
        </div>
      </div>
      <div className='image-section'>
        <img src={Isg_img} alt='' style={{ height: '100%', fit: 'cover' }} />
      </div>
    </div>
  );
}

export default Login;