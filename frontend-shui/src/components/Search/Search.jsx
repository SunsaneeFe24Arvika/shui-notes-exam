import "./searchform.css";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

function SearchForm() {
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const userInput = event.target.userInput.value;
    navigate(`/search/${encodeURIComponent(userInput)}`);
  };

  return (
    <form onSubmit={handleSearch} className="search__form">
      <label htmlFor="search" className="sr-only">
      <IoSearch className="search-icon" />
      </label>      
      <input id="search" type="text" name={"userInput"} className="search__input" placeholder="Vad letar du efter?" />
            
    </form>
  );
}

export default SearchForm;