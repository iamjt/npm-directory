import React from 'react';
import AsyncSelect from "react-select/async";
import { customOption, customMenu } from './templates/AsyncTemplates';

import './App.css';

const NPM_REGISTRY = "https://registry.npmjs.org/-/v1/search?text=";
const SEARCH_SCORE_THRESHOLD = "0.025";

type props = {};
type state = { 
  debugMode: string
};

class App extends React.Component<props, state> {
  
  constructor(props) {
    super (props);
    this.state = {
      debugMode: "OFF"
    };

    this.updateDebugger = this.updateDebugger.bind(this);
  }

  componentDidMount() {
    this.performSearch();
  }

  updateDebugger(event) {
    this.setState({debugMode:event.target.value});
  }

  //Function to populate the async dropdown menu on input
  //This function will only retrieve NPM's default search size of 20
  shortlistSearch (searchVal, callback) {
    const searchPromise = fetch(NPM_REGISTRY+searchVal);
    searchPromise.then(response => {
      response.json().then((data) => {
  
        const results = [];
        let okResult;

        //Stick the value that the user typed in on top of the list
        okResult = {
          value: searchVal,
          label: searchVal,
          description: "Search for '"+searchVal+"'",
          version: "",
          score: 0,
          header: false
        };

        results.push(okResult);
  
        for(const resultItem of data.objects) {
          //parse the results of the real time search to get rid of items below a certain score
          //score is arbitrarily decided in this case, just to show that we can do something here
          if(resultItem.searchScore > SEARCH_SCORE_THRESHOLD) {
            okResult = {
              value: resultItem.package.name,
              label: resultItem.package.name,
              description: resultItem.package.description,
              version: resultItem.package.version,
              score: resultItem.searchScore,
              header: true
            };
   
            results.push(okResult);
          }
        }
        
        //Resolve the promise via the callback
        callback(results);
      });
    });
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

        });
      } else {
        //Error Handling
      }    
    });
  }

  render() {
    return (
      <div>
        <div className="header flex-row">
          <h3 className="logo">NPM Search</h3>
          <div className="debug">
            <div className="debug-label">
              <label>
                Debug:
              </label>
            </div>
            <div className="debug-control">
              <select onChange={this.updateDebugger}>
                <option value="OFF">Off</option>
                <option value="ON">On</option>
              </select>
            </div>
          </div>
        </div>
        <div className="search-container">
          <AsyncSelect
            placeholder="Search NPM..."
            onChange={this.performSearch}
            loadOptions={this.shortlistSearch} 
            components={{Option: customOption, DropdownIndicator: null, IndicatorSeparator: null, Menu: customMenu}}></AsyncSelect>
        </div>
        {this.state.debugMode?(<div>{this.state.debugMode}</div>):null}
      </div>
    )
  }

}

export default App;