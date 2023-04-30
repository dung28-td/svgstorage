type Classname = string | boolean

export const clsx = (...classes: Classname[]) => classes.filter(Boolean).join(' ')

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)