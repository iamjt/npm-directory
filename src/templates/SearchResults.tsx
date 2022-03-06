import Moment from "moment";
import "./SearchResults.css"

export const SearchResults = ({currentResults, performSearch, debugMode = "OFF"}) => {
    return (
      <>
        {currentResults && currentResults.map((resultItem, index) => {
         return( 
          <div className="search-result-item" key={index}>
            <div className="flex-row">
              <div className="search-result-header"><a target="_blank" href={resultItem.package.links.homepage?resultItem.package.links.homepage:""}>{resultItem.package.name}</a></div>
              {/*this is to make the examiner's life a bit easier*/}
              {debugMode==="ON"?<div className="search-result-debug">{resultItem.package.trackingIndex}</div>:null}
            </div>
            <div className="flex-row">
              <div className="search-result-desc">{resultItem.package.description}</div>
            </div>
            {(resultItem.package.keywords && resultItem.package.keywords.length > 0)?(
            <div className="flex-row search-result-keyword-container">
              {resultItem.package.keywords.slice(0,3).map((keyword, keyIndex)=> {
                return (<div className="search-result-keyword" key={keyIndex} onClick={(clickEvent)=> performSearch({value:keyword})}>{keyword}</div>)
              })}
            </div>):null}
            <div className="flex-row">
              <strong>Published By</strong>: {resultItem.package.publisher.username} {Moment(resultItem.package.date).format('Y-M-D HH:mm:ss')}
            </div>
          </div>
        )})}
      </>
    )
  }
