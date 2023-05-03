import React from 'react';
import '../styles/components/Loading.css';

export default function Loading() {
  return (
    <div className="loading">
      <div className="loader" data-testid="loading" />
    </div>
  );
}
