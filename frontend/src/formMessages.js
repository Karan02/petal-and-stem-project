import {defineMessages} from 'react-intl'

export default defineMessages({
  required: {
    id: 'form.required',
    defaultMessage: 'The field is required.',
  },
  emailInvalid: {
    id: 'form.emailInvalid',
    defaultMessage: 'The email is invalid.',
  },
  invalid: {
    id: 'form.invalid',
    defaultMessage: 'The field is invalid.',
  },
  maxLength: {
    id: 'form.maxLength',
    defaultMessage: 'Max length is {length} characters.',
  },
  passwordPattern: {
    id: 'form.passwordPattern',
    defaultMessage: 'Passwords must be <ul><li>at least 8 characters long</li><li>contain Uppercase characters (A-Z)</li><li>contain Lowercase characters (a-z)</li><li>Numbers (0-9)</li></ul>',
  },
  passwordDoesNotMatch: {
    id: 'form.passwordDoesNotMatch',
    defaultMessage: 'Password does not match the confirm password.',
  },
})
