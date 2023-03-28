import * as Yup from 'yup';

export const authSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is a required field')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is a required field')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    .matches(/[a-z]+/, 'Password must contain lowercase character')
    .matches(/\d+/, 'Password must contain number'),
});

export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Name must be at least 1 characters')
    .max(16, 'Name mustn`t be more than 16 characters')
    .required('Name is a required field'),
  surname: Yup.string()
    .min(1, 'Surnema must be at least 1 characters')
    .max(20, 'Surname mustn`t be more than 20 characters '),
});
