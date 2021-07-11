// accepts the 

export function ZipForm(props) {
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      if(props.zipCode.length !== 5 || isNaN(props.zipCode)) {
        props.setErrorMsg('Zip Code must be 5 numeric characters')
        return;
      }
      
      props.setZipCodeUpdated(true);
  }


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter Zip Code:
        <input
          type="text"
          font-size="16px"
          value={props.zipCode}
          onChange={e => props.setZipCode(e.target.value)}
        />
      </label>
      <br/>
      <label>
        Filter By Distance:
        <select
         font-size="16px"
         value={props.filteredDistance}
         onChange={e => props.setFilteredDistance(e.target.value)}
         name='filter_by_distance'>
         <option value='3'> 3 mi</option>
         <option value='5'> 5 mi</option>
         <option value='10'> 10 mi</option>
         <option value='25'> 25 mi</option>
         <option value='50'> 50 mi</option>
         </select>
      </label>
      
      <input type="submit" font-size="16px" value="Submit" />
    </form>
  );
}