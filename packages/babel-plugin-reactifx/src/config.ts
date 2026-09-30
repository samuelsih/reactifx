export type ReactifxConfig = {
  /**
   * Inline `<If cond>` elements into conditional expressions.
   *
   * @default true
   */
  transformIf?: boolean
}

export type ResolvedConfig = Required<ReactifxConfig>

const defaultConfig: ResolvedConfig = {
  transformIf: true,
}

export const resolveConfig = (config: ReactifxConfig = {}): ResolvedConfig => ({
  transformIf: config.transformIf ?? defaultConfig.transformIf,
})
