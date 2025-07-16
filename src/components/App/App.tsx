import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./App.module.css";
import fetchMovies from "../../services/movieService";
// import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
// import MovieModal from "../MovieModal/MovieModal";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";

export default function App() {
  const [movies, setMovies] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  // const [count, setCount] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", movies],
    queryFn: () => fetchMovies(movies),
    enabled: movies !== "",
    // placeholderData: keepPreviousData,
  });

  function setIsNotFind() {
    toast.error("No movies found for your request.");
    return;
  }

  const handleSearch = (newMovie: string) => {
    setMovies(newMovie);
    if (newMovie.length === 0) {
      setIsNotFind();
    }
  };
  // const openModal = (movie: Movie) => {
  //   setSelectedMovie(movie);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => setIsModalOpen(false);

  // const handleSearch = async (value: string) => {
  //   setMovies([]);
  // setIsLoading(true);
  // setIsError(false);

  // try {
  //   const newMovie = await fetchMovies(value);
  //   setMovies(newMovie.results);

  //
  // } catch {
  //   setIsError(true);
  // } finally {
  //   setIsLoading(false);
  // }

  return (
    <div className={styles.app}>
      {/* 

      
      {movies.length > 0 && (
        <MovieGrid
          movies={data}
          onSelect={(movie) => {
            openModal(movie);
            setCount((count) => count + 1);
          }}
        />
      )}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )} */}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {data && data.results.length > 0 && <MovieGrid movies={data.results} />}
    </div>
  );
}
