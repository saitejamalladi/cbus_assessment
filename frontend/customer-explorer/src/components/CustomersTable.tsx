import React from 'react';
import { useSelector } from 'react-redux';
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
} from '@mui/material';
import type { RootState } from '../store';

const CustomersTable: React.FC = () => {
  const { data, loading, error } = useSelector((state: RootState) => state.customers);
  const isLoading = loading === 'loading';

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customers table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Registration Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.fullName}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {new Date(customer.registrationDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomersTable;