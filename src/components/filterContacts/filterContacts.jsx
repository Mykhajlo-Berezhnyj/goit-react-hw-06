export default function filterContacts(contacts, filter) {
    const normalizedName = filter.toLowerCase().trim();
    const normalizedDigits = filter.replace(/\D/g, '');
    if (!filter.trim()) return contacts;
    return contacts.filter(({ name, number }) => {
        const numberMatch = number.replace(/\D/g, '').includes(normalizedDigits);
        const nameMatch = name.toLowerCase().includes(normalizedName);
        return nameMatch || numberMatch;
    });
 }