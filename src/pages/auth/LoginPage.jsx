import { Helmet } from 'react-helmet-async';
// sections
import Login from '../../sections/auth/Login';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <head>
        <title> Login | Minimal UI</title>
      </head>

      <Login />
    </>
  );
}
