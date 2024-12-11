import z from 'zod';

const movieSchema = z.object({
  title: z.string({
      invalid_type_error: "Title must be a string",
      required_error: "Title is required"
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().min(0).max(1000),
  poster: z.string().url(),
  genre: z.array(
      z.enum(['Action', 'Adventure', 'Sci-Fi', 'Fantasy', 'Horror', 'Thriller', 'Drama', 'Comedy', 'Romance']),
      {
          required_error: "Genre is required",
          min_items_error: "Genre must have at least one item",
          invalid_type_error: "Invalid genre"
      }
  ),
  rate: z.number().min(0).max(10).optional()
})

function validateMovie(movie) {
   return movieSchema.safeParse(movie)
}

function validatePartialMovie(movie) {
  return movieSchema.partial().safeParse(movie)
}

export { validateMovie, validatePartialMovie }