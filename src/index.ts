import { Hono } from "hono";
import { prettyJSON } from 'hono/pretty-json'
import { authenticate } from "./http/controllers/authenticate";

const app = new Hono<{Bindings: Bindings}>().basePath("/users");

app.use(prettyJSON())
app.post('/sessions', authenticate)

export default app