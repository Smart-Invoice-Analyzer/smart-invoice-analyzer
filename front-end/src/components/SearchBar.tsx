import { IconButton } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField/TextField";
import SearchIcon from '@mui/icons-material/Search';
import { useDarkMode } from "../DarkMode/DarkModeContext";

interface SearchBarProps {
  onSearch: (query: string) => void;
}


const SearchBarr : React.FC<SearchBarProps> = ({ onSearch }) => {

  const { darkMode } = useDarkMode(); 

  return (
    <><TextField
    placeholder="Search invoice"
    variant="outlined"
    onChange={(e) => onSearch(e.target.value)}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton>
            <SearchIcon sx={{ color: darkMode ? 'gray' : '#000' }}/>
          </IconButton>
        </InputAdornment>
      ),
      sx: {
        backgroundColor: '#fff',
        borderRadius: '50px',
        width: { xs: '100%', sm: '400px' },
        input: {
          color: darkMode ? 'gray' : '#000', // Metin rengi
        },
      },
      
    }}
  /></>
  )
}

export default SearchBarr;