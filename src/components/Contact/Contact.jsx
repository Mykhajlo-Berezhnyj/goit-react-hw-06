import { FaUser, FaPhone } from 'react-icons/fa';
import css from './Contact.module.css';
import { useDispatch } from 'react-redux';
import { deleteContact } from '../../redux/contactsSlice';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Contact({ contact }) {
  const dispatch = useDispatch();

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

  return (
    <div className={css.container}>
      <div className={css['container-wrap']}>
        <div className={css['contact-item']}>
          <FaUser className={css.icon} />
          <p className={css['contact-data']}>{contact.name}</p>
        </div>
        <div className={css['contact-item']}>
          <FaPhone className={css.icon} />
          <p className={css['contact-data']}>{contact.number}</p>
        </div>
      </div>
      <button
        type="button"
        className={css['btn-delete']}
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}
