import React from 'react';

const Publication = ({ authors, title, journal, year, volume, issue, doi }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <p className="card-text">
          {authors} {title} <em>{journal}.</em> {year}; {volume}{issue != "" ? "("+issue+")" : ""} <a href={doi} target="_blank" rel="noopener noreferrer">{doi}</a>
        </p>
      </div>
    </div>
  );
};

export default Publication;
