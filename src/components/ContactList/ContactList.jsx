import css from './ContactList.module.css';
import Contact from '../Contact/Contact';

export default function ContactList({ contacts, onDelete }) {
    return (
        <div>
            <ul className={css.list}>
                {contacts.map((contact) => (
                    <li className={css.item} key={contact.id}>
                        <Contact contact={contact} onDelete={onDelete} />
                    </li>
                 )
                )}
            </ul>
        </div>
    );
};