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

export default function ContactForm() {
  const nameFieldId = useId();
  const numberFieldId = useId();
  const contacts = useSelector(state => state.contacts.items);
  const dispatch = useDispatch();
  const [isModal, setIsModal] = useState(false);
  const [exitAnim, setExitAnim] = useState(false);

  const handleModal = (values, actions) => {
    setIsModal(true);
    if (values.name !== '' || values.number !== '') {
      confirmAlert({
        title: 'Clear or continue editing?',
        message:
          'You have incomplete contact. Do you want to clear the form or continue editing?',
        buttons: [
          {
            label: 'Continue editing',
            className: css['alert-green'],
            onClick: () => {
              setIsModal(true);
            },
          },
          {
            label: 'Clear form',
            className: css['alert-red'],
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
      handleCloseModal();
    } else if (existinContact.name !== values.name) {
      confirmAlert({
        title: 'Confirm Update contact',
        message: `Contact with this number already exists under name: "${existinContact.name}". Do you want to update the name?`,
        buttons: [
          {
            label: 'Yes',
            className: css['alert-green'],
            onClick: () => {
              dispatch(
                updateContact({
                  id: existinContact.id,
                  name: values.name,
                  number: values.number,
                }),
              ),
                handleCloseModal();
            },
          },
          {
            label: 'No ',
            className: css['alert-red'],
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

  const handleCloseModal = () => {
    setExitAnim(true);
    setTimeout(() => {
      setIsModal(false);
      setExitAnim(false);
    }, 300);
  };

  return (
    <div className={css.containerForm}>
      <p className={css.allContact}>
        Total number of contacts: {contacts.length}
      </p>
      <div
        className={isModal ? css['modal-overlay'] : css.overlay}
        onClick={evt => evt.target === evt.currentTarget && handleCloseModal()}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={contactsFormSchema}
        >
          {({ values, setFieldValue, ...actions }) => (
            <Form
              className={
                isModal
                  ? `${css.formModal} ${exitAnim ? css['formModal-exit'] : ''}`
                  : css.form
              }
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
                {isModal && (
                  <button
                    type="button"
                    className={css.btnClose}
                    onClick={() => handleCloseModal()}
                  >
                    <FaTimes className={css.iconClose} size={16} />
                  </button>
                )}
              </div>
              <div className={css.wrap}>
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
                  placeholder="Enter number"
                  arial-label="Enter number"
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
