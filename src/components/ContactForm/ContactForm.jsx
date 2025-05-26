import { useId } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';
import css from './ContactForm.module.css';
import { useDispatch } from 'react-redux';
import { addContact, updateContact } from '../../redux/contactsSlice';
import { useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-hot-toast';
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

export default function ContactForm() {
  const nameFieldId = useId();
  const numberFieldId = useId();
  const contacts = useSelector(state => state.contacts.items);
  const dispatch = useDispatch();

  const handleSubmit = (values, actions) => {
    const normalize = str => str.replace(/[-*/.,!?;:()]/g, '');
    const normalizedInputNumber = normalize(values.number);
    const existingContact = contacts.find(
      contact => normalize(contact.number) === normalizedInputNumber,
    );
    if (!existingContact) {
      dispatch(
        addContact({
          id: nanoid(),
          name: values.name,
          number: values.number,
        }),
      );
      actions.resetForm();
    } else if (existingContact.name !== values.name) {
      confirmAlert({
        title: 'Confirm Update contact',
        message: `Contact with this number already exists under name: "${existingContact.name}". Do you want to update the name?`,
        buttons: [
          {
            label: 'Yes',
            onClick: () =>
              dispatch(
                updateContact({
                  id: existingContact.id,
                  name: values.name,
                  number: values.number,
                }),
              ),
          },
          {
            label: 'No',
          },
        ],
      });
    } else {
      toast.error(
        `Contact with this number already exists: ${existingContact.name}`,
      );
    }
    return;
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
