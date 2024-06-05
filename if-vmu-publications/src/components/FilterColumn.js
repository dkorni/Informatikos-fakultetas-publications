import React, { useState, useEffect } from 'react';
import getFilterQueryParams from '../functions/GetFilterQueryParams';
import EnTranslations from '../locals/en.7070e6680ecb66edd184a7460d47054a.json'

const urlToReplace = "https://portalcris.vdu.lt/server/api/discover/";
const baseURL = "https://localhost:7165/fetch";

const FilterColumn = ({ filters, onFilterChange }) => {
  const [filterDetails, setFilterDetails] = useState({});
  const [selectedFilterDetails, setSelectedFilterDetails] = useState({});
  const [collapsedFilters, setCollapsedFilters] = useState({});
  const [searchTerms, setSearchTerms] = useState({});


  useEffect(() => {
    filters.forEach(filter => {
      fetchFilterDetails(filter);
    });
  }, [filters]);

  const fetchFilterDetails = async (filter) => {

    var href = filter._links.self.href;
    href = href.replace(urlToReplace, "") + "?page=0&size={size}&configuration=RELATION.OrgUnit.publications&scope=f3a15186-d000-4e14-a914-98581cb2db52{filter}";
    href = href.replace("{size}", filter.facetLimit);

    var flt = getFilterQueryParams(selectedFilterDetails);

    href = href.replace("{filter}", flt)

    href = encodeURI(href);

    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'query': href
      },
    });
    const data = await response.json();
    setFilterDetails(prevDetails => ({
      ...prevDetails,
      [filter.name]: data._embedded.values,
    }));
  };

  const handleCheckboxChange = (filterName, value, isChecked) => {
    const updatedFilters = { ...selectedFilterDetails };
    if (isChecked) {
      if (!updatedFilters[filterName]) {
        updatedFilters[filterName] = [];
      }
      updatedFilters[filterName].push(value);
    } else {
      updatedFilters[filterName] = updatedFilters[filterName].filter(item => item !== value);
    }
    setSelectedFilterDetails(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleCollapse = (filterName) => {
    setCollapsedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleSearchChange = async (filter, event) => {
    
    const value = event.target.value.toLowerCase();

    var href = filter._links.self.href;
    href = href.replace(urlToReplace, "") + "?prefix={prefix}&page=0&size={size}&configuration=RELATION.OrgUnit.publications&scope=f3a15186-d000-4e14-a914-98581cb2db52";
    href = href.replace("{size}", filter.facetLimit).replace("{prefix}", value);

    var flt = getFilterQueryParams(selectedFilterDetails);

    href = href.replace("{filter}", flt)

    href = encodeURI(href);

    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'query': href
      },
    });
    
    const data = await response.json();

    setSearchTerms(prev => ({ ...prev, [filter.Name]: value }));

    setFilterDetails(prevDetails => ({
        ...prevDetails,
        [filter.name]: data._embedded.values,
      }));
    
  };

  return (
    <div>
    <h4>Filters</h4>
    {filters.map((filter, index) => (
      <div key={index}>
        <h5 style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {EnTranslations["search.filters.applied.f."+filter.name] != null ? EnTranslations["search.filters.applied.f."+filter.name] : EnTranslations["search.filters.filter."+filter.name+".head"]}
          <button onClick={() => toggleCollapse(filter.name)} style={{ border: 'none', background: 'none' }}>
            {!collapsedFilters[filter.name] ? '+' : '-'}
          </button>
        </h5>
        {(collapsedFilters[filter.name]) && (
          <div>
            <input
              type="text"
              placeholder={`Search ${filter.name}`}
              value={searchTerms[filter.name]}
              onChange={(e) => handleSearchChange(filter, e)}
            />
            {filterDetails[filter.name]?.map(detail => (
              <div key={detail.label}>
                <input
                  type="checkbox"
                  id={`${filter.name}-${detail.label}`}
                  value={detail.label}
                  onChange={(e) => handleCheckboxChange(filter.name, detail.label, e.target.checked)}
                  checked={selectedFilterDetails[filter.name] && selectedFilterDetails[filter.name].includes(detail.label)}
                />
                <label htmlFor={`${filter.name}-${detail.label}`}>{detail.label} ({detail.count})</label>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
  );
};

export default FilterColumn;