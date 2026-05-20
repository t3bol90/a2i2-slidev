export interface BibEntry {
  key: string
  title: string
  author: string
  year?: string
  /** journal for @article, booktitle for @inproceedings, publisher for @book */
  venue?: string
  type: string
  /** 1-based bib-file order; stable across slides — same key always shows the same number */
  num: number
}

export interface BibData {
  byKey: Record<string, BibEntry>
}
