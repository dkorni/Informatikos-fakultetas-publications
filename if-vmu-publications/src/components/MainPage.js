import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PublicationsList from './PublicationsList';
import FilterColumn from './FilterColumn';
import PublicationModel from '../models/PublicationModel';
import getFilterQueryParams from '../functions/GetFilterQueryParams';

const baseURL = "https://localhost:7165/fetch";
const defaultSearcUrl = "search/objects?sort=dc.date.issued,DESC&page={page}&size={size}&configuration=RELATION.OrgUnit.publications&scope=f3a15186-d000-4e14-a914-98581cb2db52{filter}&embed=thumbnail&embed=item%2Fthumbnail&embed=item%2Fthumbnail%2FaccessStatus";
const getFiltersURL = "facets?&configuration=RELATION.OrgUnit.publications&scope=f3a15186-d000-4e14-a914-98581cb2db52{filter}";

const MainPage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    fetchFilters();
    handleSearch(searchQuery);
    console.log("Use effect");
  }, [currentPage, selectedFilters]);

  const fetchFilters = async () => {

    var flt = getFilterQueryParams(selectedFilters);

    var query = getFiltersURL;

    query = query.replace("{filter}", flt)

    query = encodeURI(query);

    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'query': query
      },
    });
    const data = await response.json();
    setFilters(data._embedded.facets);
  };



  const handleSearch = async (query) => {
   
    var publicationsList = [];

    var query = defaultSearcUrl.replace("{page}", currentPage).replace("{size}", itemsPerPage);

    var flt = getFilterQueryParams(selectedFilters);

    query = query.replace("{filter}", flt)

    query = encodeURI(query);

    var response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'query':query
      },
    });
  

    var body = await response.json()
        
    var page = body._embedded.searchResult.page;
    setTotalItems(page.totalElements);

    setitemsPerPage(page.size);

    var objects = body._embedded.searchResult._embedded.objects;

    for(var i = 0; i<objects.length; i++){
      var publication = objects[i]._embedded.indexableObject;
      var authorsSet = publication.metadata["dc.contributor.author"];
      
      var authors = authorsSet?.map(author => {
        
        var fullname = author.value.split(',');

        let lastName = fullname[0]?.trim();
        let firstName = fullname[1]?.trim()[0];
      
        return lastName + " " + firstName;
      }).join(', ');

      var title = publication.name;

      var doi = publication.metadata["dc.identifier.uri"][0].value;
      var journal = ""; 
      
      if('dc.relation.ispartof' in publication.metadata && Object.keys(publication.metadata["dc.relation.ispartof"]).length > 0 ){
        journal = publication.metadata["dc.relation.ispartof"][0].value;
      }

      else if ('dc.relation.publication' in publication.metadata && Object.keys(publication.metadata["dc.relation.publication"]).length > 0){
        journal = publication.metadata["dc.relation.publication"][0].value;
      }

      var year = "";

      if('dc.date.issued' in publication.metadata && Object.keys(publication.metadata["dc.date.issued"]).length > 0 ){
        year = publication.metadata["dc.date.issued"][0].value;
      }

      var volume = "";

      if('oaire.citation.volume' in publication.metadata && Object.keys(publication.metadata["oaire.citation.volume"]).length > 0 ){
        volume = publication.metadata["oaire.citation.volume"][0].value;
      }
      else if('oaire.citation.startPage' in publication.metadata && Object.keys(publication.metadata["oaire.citation.startPage"]).length > 0
              && 'oaire.citation.endPage' in publication.metadata && Object.keys(publication.metadata["oaire.citation.endPage"]).length > 0)
              {
                var startPage = Number( publication.metadata["oaire.citation.startPage"][0].value);
                var endPage = Number( publication.metadata["oaire.citation.endPage"][0].value);
                volume = endPage - startPage + 1;
              }

      var issue = "";
      
      if('oaire.citation.issue' in publication.metadata && Object.keys(publication.metadata["oaire.citation.issue"]).length > 0 ){
        issue = publication.metadata["oaire.citation.issue"][0].value;
      }

      


      //var year = publication.metadata["localcerif.wos.year"][0].value;

      var publicationModel = new PublicationModel(
          authors,
          title,
          journal,
          year,
          volume,
          issue,
          doi
        )

      publicationsList.push(publicationModel);
    }

    setSearchQuery(query);
    setPublications(publicationsList);
  };

  const UpdatePage = (page) =>{
    console.log(currentPage);
    setCurrentPage(page);
    console.log(currentPage);
  }

  const handleFilterChange = (updatedFilters) => {
    setSelectedFilters(updatedFilters);
  };

  return (
    <div className="container">
      <h1 className="my-4">Informatikos fakultetas / Faculty of Informatics Publications</h1>
      <div className="row">
        <div className="col-md-3">
          <FilterColumn filters={filters} onFilterChange={handleFilterChange} />
        </div>
        <div className="col-md-9">
        <PublicationsList
            publications={publications}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={UpdatePage}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
