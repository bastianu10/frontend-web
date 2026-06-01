import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export const register = async (name: string, email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  const token = await cred.user.getIdToken();
  localStorage.setItem('token', token);
  return token;
};
