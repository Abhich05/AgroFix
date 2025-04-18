import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './BuyerAuth.module.css';

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  contact: yup.string().matches(/^[0-9+\-() ]{8,20}$/, 'Enter a valid contact number').required('Contact is required'),
});

export default function BuyerRegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onTouched',
  });
  const [error, setError] = React.useState('');

  const onSubmit = async (form) => {
    setError('');
    try {
      await axios.post('/api/buyers/register', form);
      reset();
      navigate('/buyer-login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className={styles['buyer-auth-main']}>
      <h2 className={styles['buyer-auth-title']}>Buyer Registration</h2>
      <form className={styles['buyer-auth-form']} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Name
          <input {...register('name')} />
          {errors.name && <div className={styles['buyer-auth-error']}>{errors.name.message}</div>}
        </label>
        <label>Email
          <input {...register('email')} />
          {errors.email && <div className={styles['buyer-auth-error']}>{errors.email.message}</div>}
        </label>
        <label>Password
          <input type="password" {...register('password')} />
          {errors.password && <div className={styles['buyer-auth-error']}>{errors.password.message}</div>}
        </label>
        <label>Contact
          <input {...register('contact')} />
          {errors.contact && <div className={styles['buyer-auth-error']}>{errors.contact.message}</div>}
        </label>
        <button type="submit" className={styles['buyer-auth-btn']}>Register</button>
        {error && <div className={styles['buyer-auth-error']}>{error}</div>}
      </form>
      <div className={styles['buyer-auth-link']}>
        Already have an account? <a href="/buyer-login">Login</a>
      </div>
    </main>
  );
}
