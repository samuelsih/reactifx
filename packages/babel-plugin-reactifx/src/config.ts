export type ReactifxConfig = {
  /**
   * Inline `<If cond>` elements into conditional expressions.
   *
   * @default true
   */
  transformIf?: boolean

  /**
   * Inline `<Cond>` branches into nested conditional expressions.
   *
   * @default true
   */
  transformCond?: boolean
}

export type ResolvedConfig = Required<ReactifxConfig>

const defaultConfig: ResolvedConfig = {
  transformIf: true,
  transformCond: true,
}

export const resolveConfig = (config: ReactifxConfig = {}): ResolvedConfig => ({
  transformIf: config.transformIf ?? defaultConfig.transformIf,
  transformCond: config.transformCond ?? defaultConfig.transformCond,
})
