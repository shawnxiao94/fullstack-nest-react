export interface MetaProps {
  keepAlive?: boolean
  requiresAuth?: boolean
  title: string
  key?: string
  icon?: string
  isLink?: string
}

export interface RouteObject {
  caseSensitive?: boolean
  children?: RouteObject[]
  element?: React.ReactNode
  index?: boolean
  path: string
  meta?: MetaProps
  isLink?: string
}
