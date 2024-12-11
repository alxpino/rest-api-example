import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { moviesRouter } from './routes/movies.js';

const app = express()

const PORT =  process.env.PORT ?? 3000;


app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(json())

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`)
})