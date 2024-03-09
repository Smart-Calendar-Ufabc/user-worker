import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export interface Env {
  DIRECT_DATABASE_URL: string;
	DATABASE_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    }).$extends(withAccelerate())


		// const { data, info } = await prisma.log
    //   .findMany({
    //     take: 20,
    //     orderBy: {
    //       id: 'desc',
    //     },
    //   })
    //   .withAccelerateInfo()

		return new Response(`request method: ${request.method}!`)
  },
};
