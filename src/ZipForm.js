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
          onChange={e => props.setZipCode(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}