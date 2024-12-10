const express = require('express')
const movies = require('./movies.json');
const crypto = require('node:crypto');
const cors = require('cors');
const z = require('zod');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');


const app = express()

const PORT =  process.env.PORT ?? 3000;

app.disable('x-powered-by')

app.use(express.json())

app.use(cors({
    origin: (origin, callback) => { 
        if(ACCEPTED_ORIGINS.includes(origin) === true || !origin){
            callback(null, true)
        } else {
            callback(new Error('Origin not allowed'))
        }

    }

}))

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000'
]

app.get('/movies', (req, res) => {
    const origin = req.headers.origin
    if(ACCEPTED_ORIGINS.includes(origin) === true || !origin){
        res.header('Access-Control-Allow-Origin', origin)
    } else {
        res.status(403).json({ message: 'Origin not allowed' })
        return
    }
    const { genre } = req.query
    if(genre){
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        res.json(filteredMovies)
    } else {
        res.json(movies)
    }
})

app.get('/movies/:id', (req, res) => {
    const id = req.params.id
    const movie = movies.find(movie => movie.id === id)
    if (movie) {
        res.status(200).json(movie)
    } else {
        res.status(404).json({ message: 'Movie not found' })
    }
})

// We use Zod to validate the request body. 
// Zod will throw an error if the request body is invalid.
app.post('/movies', (req, res) => {
    
    const result = validateMovie(req.body)
    
    // Zod will throw an error if the request body is invalid
    if(result.error){
        res.status(400).json(result.error)
        return
    }

    // we can access the validated data using result.data 
    const movie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    movies.push(movie)

    res.status(201).json({ message: 'Movie created successfully, id = ' + movie.id })
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
    if(result.error){
        res.status(400).json(result.error)
        return
    }

    const { id } = req.params
    const indexMovie = movies.findIndex(movie => movie.id === id)
    
    if(indexMovie === -1){
        res.status(404).json({ message: 'Movie not found' })
        return
    }
    const updatedMovie = {
        ...movies[indexMovie],
        ...result.data
    }

    movies[indexMovie] = updatedMovie
    
    res.status(200).json(updatedMovie)

})

app.delete('/movies/:id', (req, res) => {
    const origin = req.headers.origin
    if(ACCEPTED_ORIGINS.includes(origin) === true || !origin){
        res.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    } else {
        res.status(403).json({ message: 'Origin not allowed' })
        return
    }
    const { id } = req.params
    const indexMovie = movies.findIndex(movie => movie.id === id)
    if(indexMovie === -1){
        res.status(404).json({ message: 'Movie not found' })
        return
    }
    movies.splice(indexMovie, 1)
    res.status(200).json( { message: 'Movie deleted successfully' })
})

app.options('/movies/:id', (req, res) => {
    const origin = req.headers.origin
    if(ACCEPTED_ORIGINS.includes(origin) === true || !origin){
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        res.sendStatus(200)
    } else {
        res.sendStatus(403).json({ message: 'Origin not allowed' })
        return
    }
})

app.get('/web/index', (req, res) => { 
    res.status(200).sendFile(__dirname + '/web/index.html')
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`)
})