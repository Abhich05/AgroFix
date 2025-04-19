import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [role, setRole] = useState('buyer');
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (form) => {
    setError('');
    if (role === 'admin') {
      try {
        const res = await axios.post('https://agrofix-2-czmk.onrender.com/api/admin/login', form);
        localStorage.setItem('adminToken', res.data.token);
        reset();
        navigate('/admin');
      } catch (err) {
        setError('Invalid admin credentials');
      }
    } else {
      try {
        const res = await axios.post('https://agrofix-2-czmk.onrender.com/api/buyers/login', form);
        localStorage.setItem('buyerToken', res.data.token);
        reset();
        navigate('/buyer-dashboard');
      } catch (err) {
        setError('Invalid buyer credentials');
      }
    }
  };

  return (
    <main className="admin-login-main">
      <h2 className="admin-login-title">{role === 'admin' ? 'Admin Login' : 'Farmer Login'}</h2>
      <div className="admin-login-role-toggle" style={{ display: 'flex', gap: 16, marginBottom: 18, justifyContent: 'center' }}>
        <button
          type="button"
          className={`admin-login-role-btn${role === 'buyer' ? ' selected' : ''}`}
          style={{ padding: '8px 22px', borderRadius: 8, border: role === 'buyer' ? '2px solid #388e3c' : '2px solid #bdbdbd', background: role === 'buyer' ? '#e8f5e9' : '#fff', fontWeight: 700, color: '#222', cursor: 'pointer' }}
          onClick={() => setRole('buyer')}
        >
          👨‍🌾 Farmer
        </button>
        <button
          type="button"
          className={`admin-login-role-btn${role === 'admin' ? ' selected' : ''}`}
          style={{ padding: '8px 22px', borderRadius: 8, border: role === 'admin' ? '2px solid #388e3c' : '2px solid #bdbdbd', background: role === 'admin' ? '#e8f5e9' : '#fff', fontWeight: 700, color: '#222', cursor: 'pointer' }}
          onClick={() => setRole('admin')}
        >
          🛡️ Admin
        </button>
      </div>
      <form className="admin-login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          {role === 'admin' ? 'Admin Email' : 'Phone or Email'}
          <input name="email" placeholder={role === 'admin' ? 'admin@email.com' : 'e.g. 9876543210 or email'} {...register('email')} />
          {errors.email && <div className="admin-login-error">{errors.email.message}</div>}
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Enter your password" {...register('password')} />
          {errors.password && <div className="admin-login-error">{errors.password.message}</div>}
        </label>
        <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: 18, padding: '10px 0', marginTop: 10 }}>{role === 'admin' ? 'Login as Admin' : 'Login as Farmer'}</button>
        {error && <div className="admin-login-error">{role === 'admin' ? 'Please check your admin email and password.' : 'Please check your phone/email and password.'}</div>}
      </form>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        {role === 'buyer' ? (
          <>
            Don't have a farmer account? <a href="/buyer-register">Register</a>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default AdminLoginPage;
