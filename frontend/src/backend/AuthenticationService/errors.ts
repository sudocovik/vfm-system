import { CustomError } from 'ts-custom-error'

export abstract class ServerError extends CustomError {
}

export class NetworkError extends CustomError {
}

export class UndefinedServerError extends ServerError {
}

export class InvalidCredentialsError extends ServerError {
}
