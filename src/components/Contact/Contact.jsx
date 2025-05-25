import { FaUser, FaPhone } from 'react-icons/fa';
import css from './Contact.module.css';


export default function Contact({ contact: { id, name, number }, onDelete }) {
    return (
        <div className={css.container}>
            <div className={css['container-wrap']}>
                <div className={css['contact-item']}>
                    <FaUser className={css.icon} />
                    <p className={css['contact-data']}>{name}</p>
                </div>
                <div className={css['contact-item']}>
                    <FaPhone className={css.icon} />
                    <p className={css['contact-data']}>{number}</p>
                </div>
            </div>
            <button type='button' className={css['btn-delete']} onClick={() => {onDelete(id)}}>Delete</button>
        </div>
    );
};