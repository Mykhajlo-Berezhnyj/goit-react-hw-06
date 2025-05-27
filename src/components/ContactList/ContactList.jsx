import css from './ContactList.module.css';
import Contact from '../Contact/Contact';
import { useSelector } from 'react-redux';

export default function ContactList() {
  const filter = useSelector(state => state.filters);
  const contacts = useSelector(state => state.contacts.items || []);

  const normalize = str => str.replace(/[-*/.,!?;:()\s]/g, '');
  const isNumeric = Number.isFinite(Number(normalize(filter)));

  const filteredContacts = contacts.filter(
    contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      (isNumeric && normalize(contact.number).includes(normalize(filter))),
  );

  return (
    <div>
      <ul className={css.list}>
        {filteredContacts.map(contact => (
          <li className={css.item} key={contact.id}>
            <Contact contact={contact} />
          </li>
        ))}
      </ul>
    </div>
  );
}
