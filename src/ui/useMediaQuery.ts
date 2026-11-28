import { useEffect, useState } from 'preact/hooks'

/** Whether the viewport matches a media query, kept current as it changes; false where `window` or `matchMedia` is missing. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' && window.matchMedia?.(query).matches) || false)
  useEffect(() => {
    const list = window.matchMedia?.(query)
    if (!list) return
    const update = () => setMatches(list.matches)
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])
  return matches
}
