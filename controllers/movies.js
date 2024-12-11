import { MovieModel } from '../models/movie.js';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import movies from '../movies.json' with { type : "json" };

//The controller is responsible for handling incoming requests and returning appropriate responses
//it decides what to ask the model to do and what to render in the response
//it connects to the Model with the view layer.
//We are using the MVC pattern to separate the concerns of the application

export class MovieController {
  static async getAll(req, res){
    try {
      const { genre } = req.query
      const movies = await MovieModel.getAll({ genre })
      res.status(200).json(movies)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getById(req, res){
    try {
      const id = req.params.id
      const movie = await MovieModel.getById(id)
      if (movie) {
        res.status(200).json(movie)
      } else {
        res.status(404).json({ message: 'Movie not found' })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async create(req, res){ 
    try {
      const result = validateMovie(req.body)
      // Zod will throw an error if the request body is invalid
      if(result.error){
        res.status(400).json(result.error)
        return
      }
      const newMovie = await MovieModel.create({ movie : result.data })
      res.status(201).json({ message: 'Movie created successfully, id = ' + newMovie.id })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async updateById(req, res){
    try { 
      const result = validatePartialMovie(req.body)
      if(result.error){
        res.status(400).json(result.error)
        return
      }
      const { id } = req.params
      const indexMovie = await MovieModel.updateById({ id, data: result.data })
      if(indexMovie === -1){
        res.status(404).json({ message: 'Movie not found' })
        return
      }
      const updatedMovie = movies[indexMovie]
      res.status(200).json(updatedMovie)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async deleteById(req, res){
    try {
      const { id } = req.params
      const deleted = await MovieModel.deleteById({ id })
      if(!deleted){
          res.status(404).json({ message: 'Movie not found' })
          return
      }
      res.status(200).json( { message: 'Movie deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

}