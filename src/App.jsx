import { useEffect, useState } from 'react';
import initionalContacts from './contactList.json';
import ContactList from './components/ContactList/ContactList';
import SearchBox from './components/SearchBox/SearchBox';
import ContactForm from './components/ContactForm/ContactForm';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './App.css';

function App() {
  const [contacts, setContacts] = useState(() => {
    const savedPhoneBooks = window.localStorage.getItem('saved-phonebook');
    if (savedPhoneBooks !== null) {
      return JSON.parse(savedPhoneBooks);
    }
    return initionalContacts;
  });
  useEffect(() => {
    window.localStorage.setItem('saved-phonebook', JSON.stringify(contacts));
  }, [contacts]);

  const [filter, setFilter] = useState('');

  const normalize = str => str.replace(/[-*/.,!?;:()]/g, '');
  const isNumeric = Number.isFinite(Number(normalize(filter)));
  const filteredContacts = contacts.filter(
    contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      (isNumeric && normalize(contact.number).includes(normalize(filter))),
  );

  const addContact = newContact => {
    setContacts(prev => {
      return [...prev, newContact];
    });
  };

  const deleteContact = deleteId => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'You confirm delete this contact?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            setContacts(prev =>
              prev.filter(contact => contact.id !== deleteId),
            ),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  return (
    <div className="container">
      <h1>Phonebook</h1>
      <ContactForm onContact={addContact} />
      <SearchBox value={filter} onFilterChange={setFilter} />
      <ContactList contacts={filteredContacts} onDelete={deleteContact} />
    </div>
  );
}

export default App;
