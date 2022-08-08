import React from "react";


const MovieCard = ({ movie, selectedMovie}) => {
    const IMAGE_PATH = "https://image.tmdb.org/t/p/w500"
    return (

        <div className="movie-card" onClick={()=>selectedMovie(movie)}>


            {movie.poster_path ?
                <img  className="movie-cover" src={`${IMAGE_PATH}${movie.poster_path}`} /> : <div className="movie-cover-null"><h1>X</h1>Imagem não encontrada </div>
            }
            <h4 className="movie-title">{movie.title}</h4>

        </div>

    )
}

export default MovieCard;