const getFilterQueryParams = (selectedFilters) => {
    var flt = "";

    for (const [key, value] of Object.entries(selectedFilters)) {
      value.forEach(element => {
        flt = flt + "&f."+key+"="+element+",equals" 
      });
    }
    return flt;
  }

export default getFilterQueryParams;