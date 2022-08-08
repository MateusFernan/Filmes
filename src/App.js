
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import MovieCard from './components/MovieCard';
import Youtube from 'react-youtube'
import { FcApproval } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";

 

function App() {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280"
  const api_url = "https://api.themoviedb.org/3"
  const api_key = "c038bc92a0ca1c529dc741c6b377b545"

  const [movies, setMovies] = useState([])

  const [searchKey, setSearchKey] = useState([])

  const [selectedMovie, setSelectedMovie] = useState({})

  const [iniciarTrailer, setIniciarTrailer] = useState(false)


  useEffect(() => {
    procurarFilmes()
  }, [])


  const procurarFilmes = async (searchKey) => {
    if (searchKey != null) {
      const { data: { results } } = await axios.get(`${api_url}/search/movie`, {
        params: {
          api_key: api_key,
          query: searchKey,
          language: "pt-BR"
        }
      })
      console.log(results)

      setSelectedMovie(results[0])

      setMovies(results)
      await filmeSelecionado(results[0])

    } else {
      const { data: { results } } = await axios.get(`${api_url}/discover/movie`, {
        params: {
          api_key: api_key,
          language: "pt-BR"
        }
      })
      console.log(results)
      setMovies(results)
      setSelectedMovie(results[0])
      await filmeSelecionado(results[0])
    }
  }

  const procuraFilmes = async (id) => {
    const { data } = await axios.get(`${api_url}/movie/${id}`, {
      params: {
        api_key: api_key,
        append_to_response: "videos",
        language: "pt-BR"
      }
    })
    return data;
  }

  const filmeSelecionado = async (movies) => {
    const data = await procuraFilmes(movies.id)
    console.log(data)
    setSelectedMovie(data)
  }


  const carregarFilmes = () => (
    movies.map(movie => {
      return (
        <MovieCard
          key={movie.id}
          movie={movie}
          selectedMovie={filmeSelecionado}
        />
      )
    })
  )


  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(vid => vid.name === 'Official Trailer')
    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key
    return (
      <Youtube
        videoId={key}
        className={"youtube-container"}
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {

            controls: 0
          }
        }}
      />
    )
  }
  const searchMovies = (e) => {
    e.preventDefault()
    procurarFilmes(searchKey)
  }
  const reload = () => {
    window.location.reload();
  }

  const voteAverage = () => {
    if (selectedMovie.vote_average > 5) {
      return (
        <FcApproval size={40}/>
      )
    } else {
      return (
        <FcCancel size={40} />
      )

    }
  }




  return (
    <div className="App">
      <header>
        <div className="header-div content">
          <h1 onClick={reload} style={{ cursor: 'pointer' }}>Fine Max Filmes</h1>
          <form onSubmit={searchMovies}>
            <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
            <button onClick={() => setIniciarTrailer(false)} type={"submit"}>Procurar filmes</button>
          </form>
        </div>
      </header>

      <div className="top-content" style={{ backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')` }}>


        <div className="all-Content content">
          {selectedMovie.videos && iniciarTrailer ? renderTrailer() : null}
      

    
          <div className="averageInfo">
          <span style={{ marginTop:'0.5%', padding:'10px' }}>{voteAverage()}</span>
          <h1 className="voteAverage">  {selectedMovie.vote_average} </h1>
          <h5 style={{ marginTop:'3%', padding:'10px', color:'#4f4f53'}}> {selectedMovie.vote_count} votos</h5>
          </div>
   

          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
            <span className="titulo">{selectedMovie.title}</span>
            <button className="button" onClick={() => setIniciarTrailer(true)} >
              Iniciar Trailer
            </button>
          </div>

          <p>{selectedMovie.overview}</p>
        </div>

      </div>
      <div className="container content" onClick={() => setIniciarTrailer(false)}>
        {carregarFilmes()}
      </div>
    </div >
  );
}

export default App;
