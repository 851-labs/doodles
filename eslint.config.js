import baseConfig from "@851-labs/eslint-config/base"
import nextjsConfig from "@851-labs/eslint-config/nextjs"
import reactConfig from "@851-labs/eslint-config/react"

export default [...baseConfig, ...reactConfig, ...nextjsConfig]
