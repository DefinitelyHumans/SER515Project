//Validators for user email and password in login/signup form
const userValidator = {
  email: {
    rules: [
      {
        test: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Email is incorrect (Hover for hints)',
      }
    ],
    errors: [],
    valid: false,
    state: '',
  },
  password: {
    rules: [
      {
        test: (value) => {
          return value.length >= 8;
        },
        message: 'Password too short',
      },
    ],
    errors: [],
    valid: false,
    state: ''
  },
};

export default userValidator;