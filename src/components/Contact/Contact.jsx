import { FaUser, FaPhone, FaEdit } from 'react-icons/fa';
import css from './Contact.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteContact,
  updateContact,
  startEditing,
  stopEditing,
} from '../../redux/contactsSlice';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useEffect, useState, useRef } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';

export default function Contact({ contact }) {
  const dispatch = useDispatch();
  const editingContactId = useSelector(
    state => state.contacts.editingContactId,
  );
  const [editName, setEditName] = useState(contact.name);
  const [editNumber, setEditNumber] = useState(contact.number);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState({ name: '', number: '' });
  const nameRef = useRef();
  const numberRef = useRef();

  const validationContact = ({ name, number }) => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is too required';
      nameRef.current.focus();
      return newErrors;
    }
    if (name.trim().length < 3) {
      newErrors.name = 'Name is too shoot';
      nameRef.current.focus();
      return newErrors;
    }
    if (name.trim().length > 50) {
      newErrors.name = 'Name is long';
      nameRef.current.focus();
      return newErrors;
    }
    if (!isValidPhoneNumber(number)) {
      newErrors.number = 'Invalid phone number';
      numberRef.current.focus();
      return newErrors;
    }

    setFocusedField(null);
  };

  const canSwitchField = () => {
    const errors = validationContact({
      name: editName,
      number: editNumber,
    });
    setError(errors);

    if (focusedField === 'name' && errors.name) {
      setTimeout(() => nameRef.current?.focus(), 0);
      return false;
    }

    if (focusedField === 'number' && errors.number) {
      setTimeout(() => numberRef.current?.focus(), 0);
      return false;
    }

    return true;
  };

  const handleBlurValidation = field => {
    const errors = validationContact({
      name: editName,
      number: editNumber,
    });
    setError(errors);
  };

  // const handleBlurValidation = field => {
  //   const validationErrors = validationContact({
  //     name: editName,
  //     number: editNumber,
  //   });
  //   setError(validationErrors);
  //   if (field === 'name' && validationErrors.name) {
  //     nameRef.current.focus();
  //     return;
  //   }
  //   if (field === 'number' && validationErrors.number) {
  //     numberRef.current.focus();
  //     return;
  //   }
  // };

  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'You confirm delete this contact?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dispatch(deleteContact(contact.id)),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const confirmSave = () => {
    confirmAlert({
      title: 'Confirm Change',
      message: 'You confirm change this contact?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            handleSave();
          },
        },
        {
          label: 'No',
          onClick: () => {
            handleCancel();
          },
        },
      ],
    });
  };

  const handleEditing = (evt, field) => {
    if (focusedField && !canSwitchField()) {
      return;
    }
    setFocusedField(field);
    dispatch(startEditing(contact.id));
    setTimeout(() => {
      if (field === 'name' && nameRef.current) {
        nameRef.current.focus();
      } else if (field === 'number' && numberRef.current) {
        numberRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (editingContactId !== contact.id) {
      setFocusedField(null);
      setError({ name: '', number: '' });
    }
  }, [editingContactId, contact.id]);

  const handleSave = () => {
    const validationErrors = validationContact({
      name: editName,
      number: editNumber,
    });

    if (
      validationErrors &&
      (validationErrors.name || validationErrors.number)
    ) {
      setError(validationErrors);
      return;
    }

    dispatch(
      updateContact({
        id: contact.id,
        name: editName.trim(),
        number: editNumber.trim(),
      }),
    );
    dispatch(stopEditing());
  };

  const handleCancel = () => {
    setEditName(contact.name);
    setEditNumber(contact.number);
    setError({ name: '', number: '' });
    setFocusedField(null);
    dispatch(stopEditing());
  };

  const handleKey = evt => {
    if (evt.key === 'Enter') {
      handleSave();
    }
    if (evt.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={css.container}>
      <div className={css['container-wrap']}>
        <div className={css['contact-item']}>
          <FaUser className={css.icon} />
          {editingContactId === contact.id && focusedField === 'name' ? (
            <div className={css.editContact}>
              <input
                ref={nameRef}
                type="text"
                name=""
                aria-label="Edit contact name"
                value={editName}
                onChange={evt => setEditName(evt.target.value)}
                onKeyDown={handleKey}
                onBlur={() => handleBlurValidation('name')}
                className={error.name ? css.inputError : css.input}
              />
              {error.name && <p className={css.error}>{error.name}</p>}
            </div>
          ) : (
            <p
              className={css['contact-data']}
              onDoubleClick={evt => handleEditing(evt, 'name')}
            >
              {/* {contact.name}{' '} */}
              {editingContactId === contact.id ? editName : contact.name}
            </p>
          )}{' '}
          <FaEdit className={css.editIcon} />
        </div>
        <div className={css['contact-item']}>
          <FaPhone className={css.icon} />
          {editingContactId === contact.id && focusedField === 'number' ? (
            <div className={css.editContact}>
              <input
                ref={numberRef}
                type="text"
                name="contact-number"
                aria-label="Edit contact namber"
                value={editNumber}
                onChange={evt => setEditNumber(evt.target.value)}
                onKeyDown={handleKey}
                onBlur={() => handleBlurValidation('number')}
                className={error.number ? css.inputError : css.input}
              />
              {error.number && <p className={css.error}>{error.number}</p>}
            </div>
          ) : (
            <p
              className={css['contact-data']}
              onDoubleClick={evt => handleEditing(evt, 'number')}
            >
              {editingContactId === contact.id ? editNumber : contact.number}
            </p>
          )}
          <FaEdit className={css.editIcon} />
        </div>
      </div>
      {editingContactId === contact.id ? (
        <div className={css.btnEdit}>
          <button
            type="button"
            className={css.btnSaveEdit}
            onClick={handleSave}
            disabled={!!error.name || !!error.number}
          >
            Save
          </button>
          <button
            type="button"
            className={css['btn-cancel']}
            aria-label="cancel edit contact"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={css['btn-delete']}
          onClick={handleDelete}
        >
          Delete
        </button>
      )}
    </div>
  );
}
