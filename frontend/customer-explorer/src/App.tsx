import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { fetchInitial } from './store/customersSlice';
import SearchBar from './components/SearchBar';
import CustomersTable from './components/CustomersTable';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInitial({ pageSize: 20 }));
  }, [dispatch]);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CBUS Full Stack Assessment
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', px: 0, py: 2, justifyContent: 'flex-start' }}>
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{ fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.2 }}
          >
            Customer Data Explorer
          </Typography>
        </Box>

        <Box sx={{ px: 2 }}>
          <SearchBar />
        </Box>
        <Box sx={{ flex: 1, mt: 2, width: '100%' }}>
          <CustomersTable />
        </Box>
      </Box>
    </Box>
  );
}
