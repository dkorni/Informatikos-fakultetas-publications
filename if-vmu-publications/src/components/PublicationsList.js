import React from 'react';
import Publication from './Publication';

const PublicationsList = ({ publications, currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div>
      <p>Now showing {((currentPage) * itemsPerPage) + 1} - {Math.min((currentPage+1) * itemsPerPage, totalItems)} of {totalItems}</p>

      {publications.map((pub, index) => (
        <Publication key={index} {...pub} />
      ))}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage < 1}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationsList;
