import css from './SearchBox.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/filtersSlice';

export default function SearchBox() {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.filters);

  return (
    <div className={css['search-box']}>
      <p className={css['search-p']}>Find contacts by name and number</p>
      <input
        className={css['search-input']}
        type="text"
        value={filter}
        onChange={evt => {
          dispatch(setFilter(evt.target.value));
        }}
      />
    </div>
  );
}
