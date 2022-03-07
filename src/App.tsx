import React from 'react';
import AsyncSelect from "react-select/async";
import { customOption, customMenu } from './templates/AsyncTemplates';
import { SearchResults } from './templates/SearchResults';
import ReactPaginate from 'react-paginate';

import './App.css';

const NPM_REGISTRY = "https://registry.npmjs.org/-/v1/search?text=";
const SEARCH_SCORE_THRESHOLD = "0.025";
const ITEMS_PER_PAGE = 8;

type props = {};
type state = { 
  debugMode: string
  objects: any[],
  total: number,
  time: string,
  lastSearchVal: string,
  currentItems: any[],
  pageCount: number, 
  itemOffset: number,
  itemsPerPage: number
};

class App extends React.Component<props, state> {
  
  constructor(props) {
    super (props);
    this.state = {
      lastSearchVal: null,
      debugMode: "OFF", 
      objects: null, 
      total: null,
      time: null,
      currentItems:null,
      pageCount: null,
      itemOffset: null,
      itemsPerPage: ITEMS_PER_PAGE
    };

    this.updateDebugger = this.updateDebugger.bind(this);
    this.performSearch = this.performSearch.bind(this);
  }

  componentDidMount() {

    //On component mount, initiate an initial search for react
    this.performSearch({
      value: "react"
    });
  }

  updateDebugger(event) {
    this.setState({debugMode:event.target.value});
  }

  //Function to populate the async dropdown menu on input
  //This function will only retrieve based on NPM's default search size of 20
  //FInal result will be less since there is a search score filter
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
  performSearch(event) {
    this.setState({
      objects:null,
      total: null,
      time:null
    })

    //Deal with empty input
    let searchURL;
    if(!event || event.value.trim().length === 0) {
      return;
    } else {
      //Search for the desired terms and set the default search size to 100
      searchURL = NPM_REGISTRY+event.value.trim()+'&size=100';
    }

    fetch(searchURL).then(searchResponse => {
      if(searchResponse.ok) {
        searchResponse.json().then(data => {
          
          for(let i=0; i < data.objects.length; i++) {
            data.objects[i].package.trackingIndex = i;
          }

          this.setState(data);
          this.setState({lastSearchVal: event.value.trim()})

          //Trigger the page click to present new values for the pagination function
          this.handlePageClick({selected:0})

        });
      } else {
        //Error Handling
      }
    })
  }

  // Invoke when user click to request another page.
  handlePageClick = (event) => {
    //Find the items to show
    const newOffset = event.selected * this.state.itemsPerPage % this.state.objects.length;
    const newEnd = newOffset + this.state.itemsPerPage;
    const newPageItems = this.state.objects.slice(newOffset, newEnd);
    this.setState({
      currentItems: newPageItems, 
      itemOffset: newOffset, 
      pageCount: Math.ceil(this.state.objects.length / this.state.itemsPerPage),
    });
  };

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
            autoFocus
            placeholder="Search NPM..."
            onChange={this.performSearch}
            loadOptions={this.shortlistSearch} 
            components={{Option: customOption, DropdownIndicator: null, IndicatorSeparator: null, Menu: customMenu}}></AsyncSelect>
        </div>
        {(this.state.objects && this.state.objects.length > 0)?(
          <div className='search-tools-container'>
            <div>Displaying {this.state.objects.length} of {this.state.total} possible results for "<strong>{this.state.lastSearchVal}</strong>"</div>
          </div>
        ):null}
        {(this.state.objects && this.state.objects.length > 0)?
          (<SearchResults currentResults={this.state.currentItems} performSearch={this.performSearch} debugMode={this.state.debugMode}/>):null
        }
        {(this.state.objects && this.state.objects.length > ITEMS_PER_PAGE)?
          (<div className='overflow-hidden'>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next"
              previousLabel="previous"
              onPageChange={this.handlePageClick}
              pageRangeDisplayed={5}
              pageCount={this.state.pageCount}
              renderOnZeroPageCount={null}/>
          </div>):null}
      </div>
    )
  }

}

export default App;