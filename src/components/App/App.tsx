import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./App.module.css";
import ReactPaginate from "react-paginate";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";

export default function App() {
  const [movies, setMovies] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", movies, currentPage],
    queryFn: () => fetchMovies(movies, currentPage),
    enabled: movies !== "",
  });

  useEffect(() => {
    if (!isLoading && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading]);

  const handleSearch = (newMovie: string) => {
    if (!newMovie.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    setMovies(newMovie);
    setCurrentPage(1);
  };

  const totalPages = data?.total_pages || 0;

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const hasMovie = data && data.results.length > 0;

  return (
    <div className={styles.app}>
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {hasMovie && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {hasMovie && (
        <MovieGrid
          movies={data.results}
          onSelect={(movie) => {
            openModal(movie);
          }}
        />
      )}

      {isError && <ErrorMessage />}
      <Toaster />
    </div>
  );
}
