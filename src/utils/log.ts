const log = {
  info: (message: string) => {
    console.log(message)
  },
  warn: (message: string) => {
    console.warn(message)
  },
  error: (error: unknown) => {
    console.error(error)
  },
  unreachable: (message = "Entered unreachable code.") => {
    throw new TypeError(message)
  },
}

export { log }
