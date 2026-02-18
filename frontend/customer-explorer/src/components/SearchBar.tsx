import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Box } from '@mui/material';
import { fetchInitial } from '../store/customersSlice';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInitial({ pageSize: 20, q: debouncedQuery }));
  }, [debouncedQuery, dispatch]);

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="Search by name or email"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter name or email..."
      />
    </Box>
  );
};

export default SearchBar;