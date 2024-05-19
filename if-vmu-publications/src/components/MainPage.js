import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PublicationsList from './PublicationsList';
import PublicationModel from '../models/PublicationModel';

const requestUrl = "https://localhost:7165/fetch";

const MainPage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setitemsPerPage] = useState(10);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, currentPage, itemsPerPage]);

  const handleSearch = async (query) => {
   
    var publicationsList = [];

    var response = await fetch(requestUrl+"?page="+(currentPage)+"&size="+itemsPerPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },});
  

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
      //var year = publication.metadata["localcerif.wos.year"][0].value;

      var publicationModel = new PublicationModel(
          authors,
          title,
          "",
          "",
          "",
          doi
        )

      publicationsList.push(publicationModel);

      //console.log(publication);
      //console.log(publication.name);
    }

    setSearchQuery(query);
    setPublications(publicationsList);
  };

  const UpdatePage = (page) =>{
    console.log(currentPage);
    setCurrentPage(page);
    console.log(currentPage);
    handleSearch(searchQuery);
  }

  return (
    <div className="container">
      <h1 className="my-4">Informatikos fakultetas / Faculty of Informatics Publications</h1>
      <SearchBar onSearch={handleSearch} />
      <PublicationsList
        publications={publications}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={UpdatePage}
      />
    </div>
  );
};

export default MainPage;
