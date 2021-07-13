import './ZipForm.css'

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
          value={props.zipCode}
          onChange={e => props.setZipCode(e.target.value)}
        />
      </label>
      {'\u00A0'}{'\u00A0'}
      <label>
        Filter By Distance:
        <select
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
      <br/>
      <label>
        Filter By Service Category:
        <select
         value={props.filteredServiceCategory}
         onChange={e => props.setFilteredServiceCategory(e.target.value)}
         name='filter_by_service_category'>
         <option value='All'> All </option>
         <option value='Choice Pantry'> Choice Pantry </option>
         <option value='Prepack Pantry'> Prepack Pantry </option>
         <option value='Produce'> Produce </option>
         <option value='Meal'> Meal </option>
         </select>
      </label>    
      <input type="submit" value="Submit" />
    </form>
  );
}