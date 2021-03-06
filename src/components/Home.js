import React, { useState } from 'react';
import {
  SEARCH_BASE_URL,
  POPULAR_BASE_URL,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
} from '../config';

import NoImage from './images/no_image.jpg';

// import Components
import HeroImage from './elements/HeroImage';
import SearchBar from './elements/SearchBar';
import Grid from './elements/Grid';
import MovieThumb from './elements/MovieThumb';
import LoadMoreBtn from './elements/LoadMoreBtn';
import Spinner from './elements/Spinner';

// custom hook
import { useHomeFetch } from './hooks/useHomeFetch';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [{ state, loading, error }, fetchMovies] = useHomeFetch(searchTerm);

  const searchMovies = search => {
    const endpoint = search ? SEARCH_BASE_URL + search : POPULAR_BASE_URL;

    setSearchTerm(search);
    fetchMovies(endpoint);
  };

  const loadMoreMovies = () => {
    const searchEndPoint = `${SEARCH_BASE_URL}${searchTerm}&page=${state.currentPage +
      1}`;
    const popularEndPoint = `${POPULAR_BASE_URL}&page=${state.currentPage + 1}`;

    const endpoint = searchTerm ? searchEndPoint : popularEndPoint;

    fetchMovies(endpoint);
  };

  if (error) return <div>Something went wrong!</div>;
  if (!state.movies[0]) return <Spinner />;

  return (
    <>
      {!searchTerm && (
        <HeroImage
          image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${state.heroImage.backdrop_path}`}
          title={state.heroImage.original_title}
          text={state.heroImage.overview}
        />
      )}
      <SearchBar callback={searchMovies} />
      <Grid header={searchTerm ? 'Search Result' : 'Popular Movies'}>
        {state.movies.map(movie => (
          <MovieThumb
            key={movie.id}
            clickable
            image={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                : NoImage
            }
            movieId={movie.id}
            movieName={movie.original_title}
          />
        ))}
      </Grid>
      {loading && <Spinner />}
      {state.currentPage < state.totalPages && !loading && (
        <LoadMoreBtn text='Load More' callback={loadMoreMovies} />
      )}
    </>
  );
};

export default Home;
