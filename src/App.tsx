import React, { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import { useLocalStorage } from "./useLocalStorage";

interface ITempMovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

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

const average = (arr: number[]) =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

const Search: React.FC<{ onChange: (value: string) => void }> = ({
  onChange,
}) => {
  var searchReference = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   const callback = (ev: KeyboardEvent) => {
  //     if (document.activeElement === searchReference.current) return;
  //     if (ev.code === "Enter") searchReference.current?.focus();
  //   };

  //   document.addEventListener("keydown", callback);

  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, []);
  useKey("Enter", () => searchReference.current?.focus());

  return (
    <input
      ref={searchReference}
      className="search"
      type="text"
      placeholder="Search movies..."
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const MoviesResult: React.FC<{ movies: ITempMovieData[] }> = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const NavBar: React.FC<
  React.PropsWithChildren<{ onChange: (value: string) => void }>
> = ({ onChange, children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search onChange={onChange} />
      {children}
    </nav>
  );
};

const MovieList: React.FC<{
  movies: ITempMovieData[];
  onClick: (imdbID: string) => void;
}> = ({ movies, onClick }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onClick(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const Box: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen1, setIsOpen1] = useState<boolean>(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
};

const WatchSummary: React.FC<{ watched: ITempWatchData[] }> = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedList: React.FC<{
  watched: ITempWatchData[];
  onRemoveFormWatchedList: (imdbID: string) => void;
}> = ({ watched, onRemoveFormWatchedList }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
          <button
            style={{ width: "20px", height: "20px", background: "grey" }}
            className="btn-back"
            onClick={() => onRemoveFormWatchedList(movie.imdbID)}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
};

const Main: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <main className="main">{children}</main>;
};

const ErrorMessage: React.FC<{ errorMessage: string }> = ({ errorMessage }) => {
  return <div className="error"> ⛔ {errorMessage}</div>;
};

const Loader: React.FC = () => {
  return <div className="loader">Loading ...</div>;
};

const DetailsPanel: React.FC<{
  jsonResponse: any;
  onBack: () => void;
  onAddToWatchList: (movie: ITempWatchData) => void;
  watched: ITempWatchData[];
}> = ({ jsonResponse, onBack, onAddToWatchList, watched }) => {
  const [rate, onRate] = useState<number>(0);
  const [isAlreadyAddedMovie, SetIsAlreadyAddedMovie] =
    useState<boolean>(false);

  var timesRated = useRef<number>(0);

  useEffect(() => {
    if (rate) timesRated.current++;
  }, [rate]);

  const {
    imdbID,
    Actors: actors,
    Title: title,
    Year: year,
    Director: director,
    Poster: poster,
    Plot: plot,
    Genre: genre,
    imdbRating,
    Runtime: runtime,
  } = jsonResponse;

  useEffect(() => {
    if (watched.some((el) => el.imdbID === imdbID)) {
      SetIsAlreadyAddedMovie(true);
    }
  }, [imdbID, watched]);

  const handleOnRate = (rate: number) => {
    onRate(rate);
  };

  return (
    <>
      <button
        style={{ background: "grey" }}
        className="btn-back"
        onClick={onBack}
      >
        🔙
      </button>
      <div className="details details-overview">
        <h2>{title}</h2>
        <p>By {director}</p>
        <img src={poster} alt={`Poster for the movie ${title}`} />
        <header>
          <span>⭐ {imdbRating}</span>
          <span> ⌚ {runtime}</span>
        </header>
        <p>
          <strong>Actors </strong>
          {actors}
        </p>
        <StarRating onRated={handleOnRate} maxRating={10} />
        {isAlreadyAddedMovie ? (
          <button className="btn-add" disabled>
            ✅ Already added to watchlist
          </button>
        ) : (
          <button
            className="btn-add"
            onClick={() =>
              onAddToWatchList({
                imdbID: imdbID,
                Title: title,
                Year: year,
                Poster: poster,
                runtime: Number(runtime.split(" ")[0]),
                imdbRating: imdbRating,
                userRating: rate,
                timesRated: timesRated.current,
              })
            }
          >
            + Add to Watchlist
          </button>
        )}

        <section>
          <p>
            <strong>Genre </strong>
            {genre}
          </p>
          {plot}
        </section>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [movies, setMovies] = useState<ITempMovieData[]>([]);
  const [error, SetError] = useState<string>("");
  const [isLoading, SetIsLoading] = useState<boolean>(false);
  const [isLoadingForDetailsPanel, SetIsLoadingForDetailsPanel] =
    useState<boolean>(false);
  const [searchTerm, SetSearchTerm] = useState<string>("");
  const [isDetailsPanelOpen, SetIsDetailsPanelOpen] = useState<boolean>(false);
  const [jsonResponse, SetJsonResponse] = useState<any>({});
  const [imdbId, SetImdbId] = useState<string>("");
  const apiKey = "99947ae6";

  // const [watched, setWatched] = useState<ITempWatchData[]>(() => {
  //   var stringData = String(localStorage.getItem("watched"));
  //   return JSON.parse(stringData);
  // });

  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  const {watched, setWatched} = useLocalStorage([], "watched"); // directly unboxing the object

  const handleAddToWatchList = (movie: ITempWatchData) => {
    setWatched((prevMovies) => [...prevMovies, movie]);
    handleBackClick();
  };

  const handleMovieClick = (imdbID: string) => {
    SetIsDetailsPanelOpen(true);
    SetImdbId(imdbID);
  };

  const handleBackClick = () => {
    SetIsDetailsPanelOpen(false);
  };

  const handleRemoveFormWatchedList = (imdbID: string) => {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== imdbID));
  };

  useEffect(() => {
    if (!jsonResponse.Title) return;
    document.title = `usePopcorn: ${jsonResponse.Title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [jsonResponse.Title]);

  useEffect(() => {
    if (searchTerm.length < 3) {
      SetError("");
      setMovies([]);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        SetError("");
        SetIsLoading(true);
        var response = await fetch(
          `http://www.omdbapi.com/?s="${searchTerm}"&apikey=${apiKey}`,
          { signal: controller.signal }
        );
        var jsonResponse = await response.json();
        if (!response.ok) throw new Error("Invalid request");
        if (jsonResponse.Response === "False")
          throw new Error("Movie not found");
        setMovies(jsonResponse.Search);
        SetError("");
      } catch (error: any) {
        SetError(error.message);
      } finally {
        SetIsLoading(false);
      }
    })();
  }, [searchTerm, apiKey]);

  useEffect(() => {
    (async () => {
      SetIsLoadingForDetailsPanel(true);
      var data = await fetch(
        `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`
      );
      var jsonResponse = await data.json();
      SetJsonResponse(jsonResponse);
      SetIsLoadingForDetailsPanel(false);
    })();
  }, [imdbId]);

  // useEffect(() => {
  //   const callback = (ev: KeyboardEvent) => {
  //     if (ev.code === "Escape") handleBackClick();
  //   };

  //   document.addEventListener("keydown", callback);

  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, []);

  useKey("Escape", handleBackClick);

  return (
    <>
      <NavBar onChange={SetSearchTerm}>
        <MoviesResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {movies && <MovieList movies={movies} onClick={handleMovieClick} />}
          {error && <ErrorMessage errorMessage={error} />}
        </Box>
        {isDetailsPanelOpen ? (
          <Box>
            {isLoadingForDetailsPanel ? (
              <Loader />
            ) : (
              <DetailsPanel
                jsonResponse={jsonResponse}
                onBack={handleBackClick}
                onAddToWatchList={handleAddToWatchList}
                watched={watched}
              />
            )}
          </Box>
        ) : (
          <Box>
            <WatchSummary watched={watched} />
            <WatchedList
              watched={watched}
              onRemoveFormWatchedList={handleRemoveFormWatchedList}
            />
          </Box>
        )}
      </Main>
    </>
  );
};

export default App;
