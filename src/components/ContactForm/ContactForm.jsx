import { useId } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';
import css from './ContactForm.module.css';
// import 'yup-phone-lite';

const initialValues = {
  name: '',
  number: '',
};

const contactsFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  number: Yup.string()
    .test('is-valid-phone', 'Invalid phone number', value =>
      isValidPhoneNumber(value || '', 'UA'),
    )
    .required('A phone number is required'),
});

export default function ContactForm({ onContact }) {
  const nameFieldId = useId();
  const numberFieldId = useId();

  const handleSubmit = (values, actions) => {
    onContact({
      id: nanoid(),
      name: values.name,
      number: values.number,
    });
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={contactsFormSchema}
    >
      <Form className={css.form}>
        <div className={css.wrap}>
          <label className={css.label} htmlFor={nameFieldId}>
            Name
          </label>
          <Field
            className={css.field}
            type="text"
            name="name"
            id={nameFieldId}
          />
          <ErrorMessage className={css.error} name="name" component="span" />
        </div>
        <div className={css.wrap}>
          <label className={css.label} htmlFor={numberFieldId}>
            Number
          </label>
          <Field
            className={css.field}
            type="text"
            name="number"
            id={numberFieldId}
          />
          <ErrorMessage className={css.error} name="number" component="span" />
        </div>
        <button className={css.btn} type="submit">
          Add contact
        </button>
      </Form>
    </Formik>
  );
}
