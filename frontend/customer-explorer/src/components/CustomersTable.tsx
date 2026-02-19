import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { fetchMore } from '../store/customersSlice';

const CustomersTable: React.FC = () => {
  const { data, loading, error, hasNext, cursor, q } = useSelector((state: RootState) => state.customers);
  const isLoading = loading === 'loading';
  const dispatch = useDispatch<AppDispatch>();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleLoadMore = () => {
    if (hasNext && !isLoading) {
      dispatch(fetchMore({ cursor, pageSize: 20, q }));
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ width: '100%', mt: 0 }}>
      <Table aria-label="customers table" sx={{ minWidth: 650, width: '100%', tableLayout: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 280 }}>ID</TableCell>
            <TableCell sx={{ minWidth: 180 }}>Full Name</TableCell>
            <TableCell sx={{ minWidth: 240 }}>Email</TableCell>
            <TableCell sx={{ minWidth: 170 }}>Registration Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No customers found. Try adjusting your search criteria.
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {data.map((customer, index) => (
            <TableRow
              key={customer.id}
              sx={{
                bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
                '&:hover': {
                  transform: 'scale(1.01)',
                  transition: 'transform 0.2s ease-in-out',
                  boxShadow: 1,
                },
              }}
            >
              <TableCell sx={{ minWidth: 280, wordBreak: 'break-all' }}>{customer.id}</TableCell>
              <TableCell>{customer.fullName}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{formatDate(customer.registrationDate)}</TableCell>
            </TableRow>
          ))}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  <Typography>Loading...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {hasNext && !isLoading && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            Load More
          </Button>
        </Box>
      )}
    </TableContainer>
  );
};

export default CustomersTable;