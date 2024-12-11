import movies from '../movies.json' with { type : "json" };
import { randomUUID } from 'node:crypto';

export class  MovieModel {
    static async getAll ({ genre }){
      if(genre){
          const filteredMovies = movies.filter(
              movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
          )
          return filteredMovies
      }
      return movies
    }

    static async getById (id){
        const movie = movies.find(movie => movie.id === id)
        return movie
    }

    static async create ({ movie }){
        const newMovie = {
            id: randomUUID(),
            ...movie
        }
        movies.push(newMovie)
        return newMovie
    }

    static async deleteById ({ id }){
        const indexMovie = movies.findIndex(movie => movie.id === id)
        if(indexMovie === -1){
            return false
        }
        movies.splice(indexMovie, 1)
        return true
    }

    static async updateById ({ id, data }){
        const indexMovie = movies.findIndex(movie => movie.id === id)
        if(indexMovie === -1){
            return indexMovie
        }
        const updatedMovie = {
            ...movies[indexMovie],
            ...data
        }
        movies[indexMovie] = updatedMovie
        return indexMovie
    }
}