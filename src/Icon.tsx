const paths = {
  product: 'M12 3 3 7.5v9L12 21l9-4.5v-9L12 3ZM3 7.5l9 4.5 9-4.5M12 12v9M7.5 5.25l9 4.5',
  bill: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3ZM9 7h6M9 11h6M9 15h3',
  reservation: 'M5 4h14v17l-7-4-7 4V4ZM9 8h6M9 12h4',
  return: 'M8 4 3 9l5 5M3 9h11a6 6 0 0 1 0 12',
  settings: 'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  plus: 'M12 5v14M5 12h14',
  chevron: 'M9 5l7 7-7 7',
  photo: 'M3 5h18v14H3V5ZM3 15l5-5 5 5 3-3 5 5M15 8h.01',
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM15 15l6 6',
}
export type IconName = keyof typeof paths
export function Icon({ name }: { name: IconName }) {
  return <svg className="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d={paths[name]} /></svg>
}
