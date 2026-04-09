import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from './components/Sidebar/Sidebar'
import { PageEditor } from './components/PageEditor/PageEditor'
import {
  fetchAllContents,
  fetchContent,
  createContent,
  updateContent,
  deleteContent,
  type Content,
} from './api/content'
import styles from './App.module.css'

export default function App() {
  const [pages, setPages] = useState<Content[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedPage, setSelectedPage] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPages = useCallback(async () => {
    try {
      const data = await fetchAllContents()
      setPages(data)
      return data
    } catch {
      setError('ページ一覧の取得に失敗しました')
      return []
    }
  }, [])

  useEffect(() => {
    loadPages().finally(() => setLoading(false))
  }, [loadPages])

  const handleSelect = useCallback(async (id: number) => {
    setSelectedId(id)
    try {
      const page = await fetchContent(id)
      setSelectedPage(page)
    } catch {
      setError('ページの取得に失敗しました')
    }
  }, [])

  const handleCreate = useCallback(async () => {
    try {
      const newPage = await createContent()
      const updated = await loadPages()
      const found = updated.find((p) => p.id === newPage.id)
      if (found) {
        setSelectedId(found.id)
        setSelectedPage(found)
      }
    } catch {
      setError('ページの作成に失敗しました')
    }
  }, [loadPages])

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteContent(id)
        const updated = await loadPages()
        if (selectedId === id) {
          if (updated.length > 0) {
            await handleSelect(updated[0].id)
          } else {
            setSelectedId(null)
            setSelectedPage(null)
          }
        }
      } catch {
        setError('ページの削除に失敗しました')
      }
    },
    [selectedId, loadPages, handleSelect],
  )

  const handleSaveTitle = useCallback(
    async (title: string) => {
      if (!selectedPage) return
      const updated = await updateContent(selectedPage.id, { title })
      setSelectedPage(updated)
      setPages((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, title: updated.title } : p)),
      )
    },
    [selectedPage],
  )

  const handleSaveBody = useCallback(
    async (body: string) => {
      if (!selectedPage) return
      const updated = await updateContent(selectedPage.id, { body })
      setSelectedPage(updated)
    },
    [selectedPage],
  )

  return (
    <div className={styles.page}>
      <Sidebar
        pages={pages}
        selectedId={selectedId}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      <div className={styles.rightArea}>
        <div className={styles.contentWrapper}>
          <div className={styles.contentCard}>
            {error && (
              <div className={styles.errorBanner}>
                <span>{error}</span>
                <button onClick={() => setError(null)} className={styles.dismissBtn}>✕</button>
              </div>
            )}
            {!loading && !selectedPage && (
              <div className={styles.placeholder}>
                サイドバーからページを選択するか、「+」ボタンで新規作成してください。
              </div>
            )}
            {selectedPage && (
              <PageEditor
                page={selectedPage}
                onSaveTitle={handleSaveTitle}
                onSaveBody={handleSaveBody}
              />
            )}
          </div>
        </div>

        <footer className={styles.footer}>
          <span className={styles.footerCopyright}>Copyright &copy; 2021 Sample</span>
          <a href="#" className={styles.footerLink}>運営会社</a>
        </footer>
      </div>
    </div>
  )
}
