//packages
import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

//constant
import {
    DEFAULT_QUERY,
    DEFAULT_HPP,
    PATH_BASE,
    PATH_SEARCH,
    PARAM_PAGE,
    PARAM_HPP,
    PARAM_SEARCH,
} from '../../constants';

//Component
import {Table} from '../Table';
import {Search} from '../Form';

//style
import './App.scss';
import { Button } from '../Button';

//function
const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    const { searchKey, results} = prevState;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updateHits = [...oldHits, ...hits];


    return {
        results:{
            ...results,
            [searchKey]: {hits: updateHits, page},
            
        },
        isLoading : false
    }

}

class App extends Component{

    constructor(prop){
        super(prop);

        this.state = {
            results      : null,
            searchKey   : '',
            searchTerm  : DEFAULT_QUERY,
            error       :null,
            isLoading   :false,

        }

        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.needsTopSearchTopStories = this.needsTopSearchTopStories.bind(this);
    }

    fetchSearchTopStories(searchTerm, page =0){
        this.setState({
            isLoading :true
        })

        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(result => this.setSearchTopStories(result.data))
        .catch(error => this.setState({error}));
    }

    componentDidMount(){
        const {searchTerm} = this.state;
        this.setState({searchKey : searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

    needsTopSearchTopStories(searchTerm){
        return !this.state.results[searchTerm];
    }


    setSearchTopStories(result){
        const {hits, page} = result;
        
        this.setState(updateSearchTopStoriesState(hits, page));

    }

    onDismiss(id){
  
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];

        const isNotId = item=>item.objectID !== id;
        const updateHits = hits.filter(isNotId);

        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updateHits, page}
            }
        })
    }

    onSearchChange(event){
        this.setState({
            searchTerm: event.target.value
        })
    }

    onSearchSubmit(event){
        const {searchTerm} = this.state;
        
        this.setState({searchKey : searchTerm});
    
        if(this.needsTopSearchTopStories(searchTerm)){
            this.fetchSearchTopStories(searchTerm);
        }
        
        event.preventDefault();
    
    }

    render(){

        const {searchTerm, results, searchKey, error, isLoading} = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        const list = (results && results[searchKey] && results[searchKey].hits) || [];

        return(
            <div className='page'>
                <div className = 'intranction'>
                    
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>

                {
                error ?
                <div className="interanction">
                    <p>Something went error !</p>
                </div>
                :
                <Table
                    list={list}
                    onDismiss={this.onDismiss}
                    /> 
                }

                <div className = 'interactions'>
                   
                    <ButtonWithLoading
                    isLoading={isLoading} 
                    className={"btn-danger"}
                    onClick={()=> this.fetchSearchTopStories(searchKey, page + 1)}>
                    More
                    </ButtonWithLoading>
 
                    
                </div>

            </div>
        )
    }


}

const Loading =()=>(
    <FontAwesomeIcon icon={faSpinner} size="lg" pulse/>
)

const withLoading = (Component) => ({isLoading, ...props})=>(
    isLoading ? <Loading />
    : <Component {...props} />
)

const ButtonWithLoading = withLoading(Button);
    
export default App;
export {Table, Search, Button};
