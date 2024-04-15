import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { authenticate } from './http/controllers/authenticate'
import { singUp } from './http/controllers/sign-up'
import { singUpCodeValidate } from './http/controllers/sign-up-code-validate'
import { createProfile } from './http/controllers/create-profile'
import { ensureAuthenticate } from './http/middlewares/ensure-authenticate'
import { updateProfile } from './http/controllers/update-profile'
import { getProfile } from './http/controllers/get-profile'

const app = new Hono<{ Bindings: Bindings }>().basePath('/users')

app.get('/', (c: Context) => c.json({ message: 'Hello, world!' }))
app.use(
	'/*',
	cors({
		origin: [
			'http://localhost:3000',
			'https://ease-calendar-front-end.pages.dev/',
		],
		allowMethods: ['POST', 'PUT'],
		allowHeaders: ['Content-Type', 'Authorization'],
	}),
)
app.use(prettyJSON())
app.post('/sessions', authenticate)
app.post('/sign-up', singUp)
app.post('/sign-up/code-validate', singUpCodeValidate)
app.get('/profile', ensureAuthenticate, getProfile)
app.post('/profile', ensureAuthenticate, createProfile)
app.put('/profile', ensureAuthenticate, updateProfile)

export default app
