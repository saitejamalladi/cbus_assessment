import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import type { RootState } from '../store';
import { fetchMore } from '../store/customersSlice';

const InfiniteScrollSentinel: React.FC = () => {
  const { hasNext, loading, cursor, q } = useSelector((state: RootState) => state.customers);
  const dispatch = useDispatch();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
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
      {loading && <CircularProgress />}
    </Box>
  );
};

export default InfiniteScrollSentinel;