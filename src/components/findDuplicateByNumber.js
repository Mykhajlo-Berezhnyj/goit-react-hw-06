export function findDuplicateByNumber(contacts, newNumber, currentId = null) {
  const normalize = str => str.replace(/[-*/.,!?;:()\s]/g, '');
  const normalizedInputNumber = normalize(newNumber);
  return contacts.find(
    contact =>
      contact.id !== currentId &&
      normalize(contact.number).slice(-9) === normalizedInputNumber.slice(-9),
  );
}
