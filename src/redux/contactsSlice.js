import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'contacts',
  initialState: {
    items: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459 - 12 - 56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443 - 89 - 12' },
      { id: 'id-3', name: 'Eden Clements', number: '645 - 17 - 79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227 - 91 - 26' },
    ],
    editingContactId: null,
  },
  reducers: {
    addContact(state, action) {
      state.items.push(action.payload);
    },
    deleteContact(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateContact(state, action) {
      const { id, name, number } = action.payload;
      const contact = state.items.find(item => item.id === id);
      if (contact) {
        contact.name = name;
        contact.number = number;
      }
    },
    startEditing(state, action) {
      state.editingContactId = action.payload;
    },
    stopEditing(state) {
      state.editingContactId = null;
    },
  },
});

export const {
  addContact,
  deleteContact,
  updateContact,
  startEditing,
  stopEditing,
} = slice.actions;
export default slice.reducer;
