import { UserTemp } from '@prisma/client/edge'
import { UsersTempRepository } from '../repositories/users-temp-repository'
import { genSalt, hash } from 'bcryptjs'
import { generateSixDigitCode } from '../factories/generate-six-digit-code'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'

interface CreateUserTempRequest {
	email: string
	password: string
}

interface CreateUserTempResponse {
	userTemp: UserTemp
	code: string
}

export class CreateUserTempUseCase {
	constructor(
		private usersTempRepository: UsersTempRepository,
		private usersRepository: UsersRepository,
		private isLocalHost?: boolean,
	) {}

	async execute({
		email,
		password,
	}: CreateUserTempRequest): Promise<CreateUserTempResponse> {
		const userWithSameEmail =
			await this.usersRepository.findUniqueByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const salt = await genSalt(10)
		const code = generateSixDigitCode()

		const userTemp = await this.usersTempRepository.findUniqueByEmail(email)

		if (userTemp) {
			await this.usersTempRepository.delete(userTemp.id)
		}

		const userTempCreated = await this.usersTempRepository.create({
			email,
			password_hash: await hash(password, salt),
			code,
		})

		console.log('----- This is the code:', code)

		if (!this.isLocalHost) {
			await sendEmail({
				personalizations: [
					{
						to: [{ email }],
					},
				],
				from: {
					email: 'ease-calendar@gisellehoekveld.me',
					name: 'Ease Calendar',
				},
				subject: 'Código de verificação - Cadastro',
				content: [
					{
						type: 'text/html;charset=UTF-8',
						value: `
							<!DOCTYPE html>
							<html>
								<body style="max-width: 800px;margin:0 auto;padding:8px;border-radius:4x;">
									<div style="min-width:280px;width:100%;margin:0 auto">
										<div style="text-align:center;padding:16px;background-color:#fff;border-radius:4px;margin: 0 auto;">
											<header style="padding: 16px 0;">
												<div style="margin: 0 auto;text-align:center;background-color:#fff;border-radius:4px;">
													<table align="center" style="border: none; background: none; margin: 0 auto;">
														<tbody>
															<tr>
																<td><img src="https://res.cloudinary.com/da2hgsrt7/image/upload/v1713303801/ease-calendar/platform/logo-main_nhcyyr.png" height="40px"></td>
															</tr>
														</tbody>
													</table>
												</div>
											</header>
											<div style="color:#000;margin: 12px auto 24px auto;border-radius: 8px;border: 1px solid #e0e0e0;background-color: #fafafa;padding: 32px;display: table;">
												<p style="font-size: 1rem; margin: 0 0 28px 0; color: #000;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Helvetica Neue&quot;, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">Seu código de verificação é:</p>
												<p style="font-size:2rem;margin:0;background-color: #fff;width: fit-content;margin: 0 auto; padding: 8px 16px;border-radius: 8px;border: 1px solid #e0e0e0;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Helvetica Neue&quot;, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">${code}</p>
											</div>
										</div>
										<footer style="padding: 16px 0;">
											<p style="color:#9e9e9e;font-size:0.75rem;line-height:1.43;margin-top:4px;margin-bottom:4px;text-align: center;">
												Calendário de Organização Pessoal
											</p>
											<span style="color:#9e9e9e;font-size:0.75rem;font-weight:400;text-align: center;display:block;">
												Copyright © ${new Date().getFullYear().toString()} Ease Calendar.
											</span>
											<br>
										</footer>
									</div>
								</body>
							</html>
						`,
					},
				],
			})
		}

		return {
			userTemp: userTempCreated,
			code,
		}
	}
}

const sendEmail = async (body: {
	personalizations: Array<{
		to: Array<{
			email: string
			name?: string
		}>
	}>
	from: {
		email: string
		name: string
	}
	subject: string
	content: Array<{
		type: string
		value: string
	}>
}) => {
	try {
		const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (response.status !== 202) {
			if (response?.text) {
				const text = await response?.text()
				console.log('Error sending email', { text, status: response.status })
			} else if (response?.json) {
				const data = await response?.json()
				console.log('Error sending email', { data, status: response.status })
			}
		}
	} catch (error) {
		console.log('Server Error sending email', error)
	}
}
