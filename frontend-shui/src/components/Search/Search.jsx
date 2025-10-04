//import "./searchform.css";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

function SearchForm() {
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const userInput = event.target.userInput.value.trim();
    
    // Kontrollera att användaren faktiskt har skrivit något
    if (userInput) {
      navigate(`/search/${encodeURIComponent(userInput)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search__form">
      <div className="search__container">
        <IoSearch className="search-icon" />
        <label htmlFor="search" className="sr-only">
          Sök i anteckningar
        </label>      
        <input 
          id="search" 
          type="text" 
          name="userInput" 
          className="search__input" 
          placeholder="Vad letar du efter?" 
          required
        />
      </div>
    </form>
  );
}

export default SearchForm;