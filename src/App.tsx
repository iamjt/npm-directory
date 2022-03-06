import React from 'react';

import './App.css';

const NPM_REGISTRY = "https://registry.npmjs.org/-/v1/search?text=";

class App extends React.Component {
  
  constructor(props) {
    super (props);
  }

  componentDidMount() {
    this.performSearch();
  }

  //Similar to the shortlisting above
  //But this function will handle results of N sizes
  //Default search result size is 100 because we need to do pagination
  performSearch() {

    const testSearchVal = "React";

    //Deal with empty input
    let searchURL;
    if(!testSearchVal || testSearchVal.trim().length == 0) {
      return;
    } else {
      //Search for the desired terms and set the default search size to 100
      searchURL = NPM_REGISTRY+testSearchVal.trim();
    }

    fetch(searchURL).then(searchResponse => {
      if(searchResponse.ok) {
        searchResponse.json().then(data => {
          console.log(data);          
        });
      } else {
        //Error Handling
      }    
    });
  }

  render() {
    return (
      <div>
        Hello World
      </div>
    )
  }

}

export default App;