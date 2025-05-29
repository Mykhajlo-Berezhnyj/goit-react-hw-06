import { useId, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';
import css from './ContactForm.module.css';
import { useDispatch } from 'react-redux';
import { addContact, updateContact } from '../../redux/contactsSlice';
import { useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-hot-toast';
import { findDuplicateByNumber } from '../findDuplicateByNumber';
import { FaUserPlus, FaTimes } from 'react-icons/fa';
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

// function FormActions({ setIsModal }) {
//   const { resetForm } = useFormikContext();

//   const handleClearClick = () => {
//     confirmAlert({
//       title: 'Clear form?',
//       message: 'Are you sure you want to clear the form?',
//       buttons: [
//         {
//           label: 'Yes',
//           onClick: () => {
//             resetForm();
//           },
//         },
//         {
//           label: 'No',
//         },
//       ],
//     });
//   };

//   return (
//     <>
//       <button type="button" className={css.btnClear} onClick={handleClearClick}>
//         Clear form
//       </button>

//       <button
//         type="button"
//         className={css.btnClose}
//         onClick={() => {
//           setIsModal(false);
//         }}
//       >
//         <FaTimes size={16} />
//       </button>
//     </>
//   );
// }

export default function ContactForm() {
  const nameFieldId = useId();
  const numberFieldId = useId();
  const contacts = useSelector(state => state.contacts.items);
  const dispatch = useDispatch();
  const [isModal, setIsModal] = useState(false);

  const handleModal = (values, actions) => {
    if (values.name !== '' || values.number !== '') {
      confirmAlert({
        title: 'Clear or continue editing?',
        message: `You have incomplete contact. Do you want to clear the form or continue editing?`,
        buttons: [
          {
            label: 'Continue editing',
            onClick: () => {
              setIsModal(true);
            },
          },
          {
            label: 'Clear form',
            onClick: () => {
              actions.resetForm();
              setIsModal(true);
            },
          },
        ],
      });
    } else {
      setIsModal(true);
    }
  };

  const handleSubmit = (values, actions) => {
    const existinContact = findDuplicateByNumber(contacts, values.number, null);

    if (!existinContact) {
      dispatch(
        addContact({
          id: nanoid(),
          name: values.name,
          number: values.number,
        }),
      );
      actions.resetForm();
      setIsModal(false);
    } else if (existinContact.name !== values.name) {
      confirmAlert({
        title: 'Confirm Update contact',
        message: `Contact with this number already exists under name: "${existinContact.name}". Do you want to update the name?`,
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              dispatch(
                updateContact({
                  id: existinContact.id,
                  name: values.name,
                  number: values.number,
                }),
              ),
                setIsModal(false);
            },
          },
          {
            label: 'No',
          },
        ],
      });
    } else {
      toast.error(
        `Contact with this number and ${existinContact.name} already exists: `,
      );
    }
    return;
  };

  return (
    <div className={css.containerForm}>
      <p className={css.allContact}>
        Total number of contacts: {contacts.length}
      </p>
      <div
        className={isModal ? css['modal-overlay'] : ''}
        onClick={evt => evt.target === evt.currentTarget && setIsModal(false)}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={contactsFormSchema}
        >
          {({ values, setFieldValue, ...actions }) => (
            <Form
              className={isModal ? css.formModal : css.form}
              onClick={
                !isModal
                  ? e => {
                      e.stopPropagation();
                      handleModal(values, actions);
                    }
                  : undefined
              }
            >
              <div className={css.addWrap}>
                <FaUserPlus className={css.addIcons} />
                <p className={css.addNew}>Add new contact</p>
                <button
                  type="button"
                  className={css.btnClose}
                  onClick={() => {
                    setIsModal(false);
                  }}
                >
                  <FaTimes className="" size={16} />
                </button>
              </div>
              <div className={css.iconClose}>
                <label className={css.label} htmlFor={nameFieldId}>
                  Name
                </label>
                <Field
                  className={css.field}
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  arial-label="Enter name"
                  id={nameFieldId}
                />
                {values.name && (
                  <FaTimes
                    className={css.clearIcon}
                    onClick={() => setFieldValue('name', '')}
                  />
                )}
                <ErrorMessage
                  className={css.error}
                  name="name"
                  component="span"
                />
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
                {values.number && (
                  <FaTimes
                    className={css.clearIcon}
                    onClick={() => setFieldValue('number', '')}
                  />
                )}
                <ErrorMessage
                  className={css.error}
                  name="number"
                  component="span"
                />
              </div>
              <button className={css.btn} type="submit">
                Add contact
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
