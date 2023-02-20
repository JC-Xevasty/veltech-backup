export const generateToken: (length: number, tokenOptions?: { hasLower?: boolean, hasUpper?: boolean, hasNumber?: boolean }) => string = (length, options) => {
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const number = "0123456789"

  let charset: string = [lower, number].join("")

  if (options) {
    charset = [
      options?.hasLower ? lower : "",
      options?.hasUpper ? upper : "",
      options?.hasNumber ? number : ""
    ].join("")
  }

  let token: string[] = []

  for (let i = 0; i < length; i++) {
    token = [...token, charset[Math.floor(Math.random() * charset.length)]]
  }
  
  return token.join("")
}