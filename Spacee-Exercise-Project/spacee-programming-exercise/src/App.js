import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';

import './App.css';

function App() {
  const [value, onValueChange] = useState(new Date());
  const [apiPhotos, onApiPhotosChange] = useState([]);

  const callApi = evt => {
    fetch('http://localhost:8080/NASA/api/getImagesBasedOnDate', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "date": value
      })
    })
    .then(response => response.json())
    .then(result => onApiPhotosChange(result.photos))
    .catch(e => {
      console.log(e)
    })
  }

  return (
    <div className="App">
      <div className='top-content'>
        <DatePicker onChange={onValueChange} value={value} />
        <br/>
        <button onClick={() => callApi()}>Get NASA Images!</button>
      </div>

      <div className='container'>
        { apiPhotos.length ? (
            apiPhotos.map((photo, idx) => {
              return <div key={idx} className='NASA-photo'>
                <h1>{photo.full_name}</h1>
                <img src={photo.img_src} alt='Mars' />
                <button onClick={() => window.open(`${photo.img_src}`,'_blank')}>
                  View Source Image!
                </button>
              </div>
            })
          ) : (
            <h1>No Images for this date... :(</h1>
          )
        }
      </div>
    </div>
  );
}

export default App;
