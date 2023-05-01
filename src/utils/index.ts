type Classname = string | boolean

export const clsx = (...classes: Classname[]) => classes.filter(Boolean).join(' ')

export const unique = <T>(arr: T[]) => arr.filter((v, i, a) => a.indexOf(v) === i)

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)