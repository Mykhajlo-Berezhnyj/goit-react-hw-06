import css from './ContactList.module.css';
import Contact from '../Contact/Contact';
import { useSelector } from 'react-redux';

export default function ContactList() {
  const { name, mode } = useSelector(state => state.filters);
  const contacts = useSelector(state => state.contacts.items || []);

  const normalize = str => str.replace(/[-*/.,!?;:()\s]/g, '');
  const isNumeric = Number.isFinite(Number(normalize(name)));

  const filteredContacts = contacts.filter(contact => {
    const query = name.toLowerCase();
    switch (mode) {
      case 'name':
        return contact.name.toLowerCase().includes(query);
      case 'number':
        return normalize(contact.number).includes(normalize(name));
      case 'all':
      default:
        return (
          contact.name.toLowerCase().includes(query) ||
          (isNumeric && normalize(contact.number).includes(normalize(name)))
        );
    }
  });

  return (
    <div>
      {name ? (
        <p className={css.infoQuery}>
          Found {filteredContacts.length}{' '}
          {filteredContacts.length === 1 ? 'contact' : 'contacts'}
        </p>
      ) : (
        <p className={css.infoQuery}>Enter a search query to find a contact</p>
      )}
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
