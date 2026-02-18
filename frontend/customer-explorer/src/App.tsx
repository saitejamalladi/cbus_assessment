import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Typography } from '@mui/material';
import { fetchInitial } from './store/customersSlice';
import SearchBar from './components/SearchBar';
import CustomersTable from './components/CustomersTable';
import InfiniteScrollSentinel from './components/InfiniteScrollSentinel';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInitial({ pageSize: 20 }));
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Data Explorer
      </Typography>
      <SearchBar />
      <CustomersTable />
      <InfiniteScrollSentinel />
    </Container>
  );
}
