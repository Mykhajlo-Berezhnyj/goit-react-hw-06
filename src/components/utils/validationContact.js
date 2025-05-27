import { isValidPhoneNumber } from 'libphonenumber-js';

export const validationContact = ({ name, number }) => {
  const newErrors = {};
  if (!name.trim()) {
    newErrors.name = 'Name is required';
  } else if (name.trim().length < 3) {
    newErrors.name = 'Name is too short';
  } else if (name.trim().length > 50) {
    newErrors.name = 'Name is too long';
  }
  if (!isValidPhoneNumber(number, 'UA')) {
    newErrors.number = 'Invalid phone number';
  }
  return newErrors;
};
