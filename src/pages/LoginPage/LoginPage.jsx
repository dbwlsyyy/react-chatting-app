import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../../firebase';

const LoginPage = () => {
    const auth = getAuth(app);
    const [loading, setLoading] = useState(false);
    const [errorFromSubmit, seterrorFromSubmit] = useState('');

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            await signInWithEmailAndPassword(auth, data.email, data.password);
        } catch (error) {
            console.log(error);
            seterrorFromSubmit(error.message);
            setTimeout(() => {
                seterrorFromSubmit('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div style={{ textAlign: 'center' }}>
                <h3>Login</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email</label>
                <input
                    name="email"
                    type="email"
                    id="email"
                    {...register('email', {
                        required: true,
                        pattern: /^\S+@\S+$/i,
                    })}
                />
                {errors.email && <p>This email field is required</p>}

                <label htmlFor="password">Password</label>
                <input
                    name="password"
                    type="password"
                    id="password"
                    {...register('password', {
                        required: true,
                        minLength: 6,
                    })}
                />
                {errors.password && errors.password.type === 'required' && (
                    <p>This password field is required</p>
                )}
                {errors.password && errors.password.type === 'minLength' && (
                    <p>Password must have at least 6 characters</p>
                )}

                {errorFromSubmit && <p>{errorFromSubmit}</p>}
                <input type="submit" disabled={loading} />
                <Link
                    style={{ color: 'gray', textDecoration: 'none' }}
                    to={'/register'}
                >
                    회원가입
                </Link>
            </form>
        </div>
    );
};

export default LoginPage;
