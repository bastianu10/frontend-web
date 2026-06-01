import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const login = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const token = await cred.user.getIdToken();
  localStorage.setItem('token', token);
  return token;
};
