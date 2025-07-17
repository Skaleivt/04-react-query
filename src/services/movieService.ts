import axios from "axios";

import type { Movie } from "../types/movie";

interface MovieSearchResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

export default async function fetchMovies(
  topic: string,
  page: number
): Promise<MovieSearchResponse> {
  const myKey = import.meta.env.VITE_API_KEY;
  axios.defaults.baseURL = "https://api.themoviedb.org/3";

  const response = await axios.get<MovieSearchResponse>(`/search/movie`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
    params: {
      query: topic,
      page,
    },
  });
  return response.data;
}
