import css from './SearchBox.module.css';

export default function SearchBox({value, onFilterChange}) {
    return (
        <div className={css['search-box']}>
            <p className={css['search-p']}>Find contacts by name and number</p>
            <input className={css['search-input']} type="text" value={value} onChange={(evt) => {onFilterChange(evt.target.value)}} />
        </div>
    );
};