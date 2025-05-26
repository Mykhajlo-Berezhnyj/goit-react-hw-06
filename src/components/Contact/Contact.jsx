import { FaUser, FaPhone } from 'react-icons/fa';
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

export default function Contact({ contact }) {
  const dispatch = useDispatch();
  const editingContactId = useSelector(
    state => state.contacts.editingContactId,
  );
  const [editName, setEditName] = useState(contact.name);
  const [editNumber, setEditNumber] = useState(contact.number);
  const [focusedField, setFocusedField] = useState(null);
  const nameRef = useRef();
  const numberRef = useRef();

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

  const handleSave = () => {
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
              />
              <button type="button" onClick={handleSave}>
                Save
              </button>
            </div>
          ) : (
            <p
              className={css['contact-data']}
              onDoubleClick={evt => handleEditing(evt, 'name')}
            >
              {/* {contact.name}{' '} */}
              {editingContactId === contact.id ? editName : contact.name}
            </p>
          )}
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
              />
              <button type="button" onClick={handleSave}>
                Save
              </button>
            </div>
          ) : (
            <p
              className={css['contact-data']}
              onDoubleClick={evt => handleEditing(evt, 'number')}
            >
              {editingContactId === contact.id ? editNumber : contact.number}
            </p>
          )}
        </div>
      </div>
      {editingContactId === contact.id ? (
        <button
          type="button"
          className={css['btn-cancel']}
          onClick={handleCancel}
        >
          Cancel
        </button>
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
