import React, { Component } from 'react';
import Pagination from './common/pagination';
import { getMovies } from '../services/fakeMovieService';
import ListGroup from './common/listGroup';
import SearchBox from './common/searchBox';
import {getGenres} from '../services/fakeGenreService';
import { paginate } from '../utils/paginate';
import MoviesTable from './moviesTable';
import { Link } from 'react-router-dom';
import _ from 'lodash';


class Movies extends Component {
    state = {
        movies: [],
        genres: [],
        currentPage:1,
        pageSize: 4,
        selectGenre: null,
        searchQuery: '',
        sortColumn: {path: 'title', order: 'asc'}
    };

    componentDidMount() {
        const genres = [{ _id: "", name: 'All Genres'},...getGenres()]
        this.setState({movies: getMovies(), genres });
    }

    handleDelete = (movie) => {
        //setting state
         const movies = this.state.movies.filter(m => m._id !== movie._id);
         this.setState({ movies });
        
    };

    handleLike = movie => {
        //changing movies state
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] };
        movies[index].liked = !movies[index].liked;
        this.setState({ movies });
    };

    handlePageChange = page => {
        this.setState({ currentPage: page });
    };

    handleGenreSelect = genre =>{
        this.setState({selectedGenre: genre, searchQuery: '', currentPage: 1});
    };

    handleSearch = query => {
        this.setState({ searchQuery: query, searchGenre: null, currentPage: 1 });
    };

    handleSort = sortColumn => {
        this.setState({ sortColumn });
    };

    getPageData = () => {
        const { pageSize, currentPage, sortColumn, selectedGenre, searchQuery, movies: allMovies } = this.state;
        
        let filtered = allMovies;
        if (searchQuery)
            filtered = allMovies.filter(m =>
                m.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
        else if (selectedGenre && selectedGenre._id)
            filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

        
        // const filtered = selectedGenre && selectedGenre._id
        //     ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        //     : allMovies;
        
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const movies = paginate(sorted, currentPage, pageSize);

        return { totalCount: filtered.length, data: movies };
    };
    
    render() { 
        const { length: count } = this.state.movies;
        const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

        if (count === 0)
            return <p>There are no movies in the database!</p>
        
        const {totalCount, data: movies} = this.getPageData();
        return (
            <div className="row">
                <div className="col-3">
                    <ListGroup 
                    items={this.state.genres} 
                    selectedItem={this.state.selectedGenre}
                    onItemSelect={this.handleGenreSelect} />
                </div>
                <div className="col">
                    <Link
                        to="/movies/new"
                        className="btn btn-primary"
                        style={{marginBottom: 20}}
                    >
                        New Movie
                    </Link>
                <p>Showing {totalCount} movies in the database</p>
                    <SearchBox value={searchQuery} onChange={this.handleSearch}/>
                    <MoviesTable
                        movies={movies}
                        sortColumn={sortColumn}
                        onLike={this.handleLike}
                        onDelete={this.handleDelete}
                        onSort={this.handleSort}
                    />
                <Pagination
                    itemsCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange} />
            </div>
        </div>
        );
    } 
}
 
export default Movies;