import backIcon from '../../assets/left.png';
//import './search.css';

const Search = ({ date, setDate, notes, setFilteredNotes }) => {
  
  const clearDate = () => {
    setDate("");
    setFilteredNotes(notes); // Visa alla notes när datum rensas
  };

  const handleDateChange = (e) => {
  const selectedDate = e.target.value;
  setDate(selectedDate);
  
  if (selectedDate) {
    const filtered = notes.filter(note => {
      const createdAt = note.createdAt || note.attributes?.createdAt;
      
      // Kontrollera att createdAt finns och är giltigt
      if (!createdAt) return false;
      
      const noteDate = new Date(createdAt);
      
      // Kontrollera att datumet är giltigt
      if (isNaN(noteDate.getTime())) return false;
      
      const noteDateString = noteDate.toISOString().split('T')[0];
      return noteDateString === selectedDate;
    });
    setFilteredNotes(filtered);
  } else {
    setFilteredNotes(notes);
  }
};

  return (
    <section className="date-container">
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="date-filter"
      />
      {date && (
        <button onClick={clearDate} className="date-reset__button">
          <img src={backIcon} alt="Back" className="goBack-btn" />
        </button>
      )}
    </section>
  );
};

export default Search;
