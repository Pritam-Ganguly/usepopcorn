import { useState, useEffect } from "react";

interface ITempWatchData {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
  timesRated: number;
}

export const useLocalStorage = (initalState: ITempWatchData[], key: string) => {
  const [watched, setWatched] = useState<ITempWatchData[]>(() => {
    var stringData = String(localStorage.getItem(key));
    return stringData ? JSON.parse(stringData) : initalState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(watched));
  }, [watched, key]);

  return {watched, setWatched}; // need to return as an object
};
