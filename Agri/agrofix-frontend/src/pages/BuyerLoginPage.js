import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './BuyerAuth.module.css';

const loginSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function BuyerLoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
  });
  const [error, setError] = React.useState('');

  const onSubmit = async (form) => {
    setError('');
    try {
      const res = await axios.post('/api/buyers/login', form);
      localStorage.setItem('buyerToken', res.data.token);
      reset();
      navigate('/'); // Go to home or buyer dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className={styles['buyer-auth-main']}>
      <h2 className={styles['buyer-auth-title']}>Buyer Login</h2>
      <form className={styles['buyer-auth-form']} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Email
          <input {...register('email')} />
          {errors.email && <div className={styles['buyer-auth-error']}>{errors.email.message}</div>}
        </label>
        <label>Password
          <input type="password" {...register('password')} />
          {errors.password && <div className={styles['buyer-auth-error']}>{errors.password.message}</div>}
        </label>
        <button type="submit" className={styles['buyer-auth-btn']}>Login</button>
        {error && <div className={styles['buyer-auth-error']}>{error}</div>}
      </form>
      <div className={styles['buyer-auth-link']}>
        Don't have an account? <a href="/buyer-register">Register</a>
      </div>
    </main>
  );
}
