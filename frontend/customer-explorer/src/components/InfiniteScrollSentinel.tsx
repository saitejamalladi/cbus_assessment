import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { fetchMore } from '../store/customersSlice';

const InfiniteScrollSentinel: React.FC = () => {
  const { hasNext, loading, cursor, q } = useSelector((state: RootState) => state.customers);
  const isLoading = loading === 'loading';
  const dispatch = useDispatch<AppDispatch>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoading) {
          dispatch(fetchMore({ cursor, pageSize: 20, q }));
        }
      },
      { threshold: 1.0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasNext, loading, cursor, q, dispatch]);

  return (
    <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      {isLoading && <CircularProgress />}
    </Box>
  );
};

export default InfiniteScrollSentinel;