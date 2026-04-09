import { useState } from 'react'
import type { Content } from '../../api/content'
import styles from './Sidebar.module.css'

interface Props {
  pages: Content[]
  selectedId: number | null
  onSelect: (id: number) => void
  onCreate: () => void
  onDelete: (id: number) => void
}

export function Sidebar({ pages, selectedId, onSelect, onCreate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <aside className={styles.sidebar}>
      {/* Logo area */}
      <div className={styles.logoArea}>
        <img src="/icons/logo.svg" alt="Logo" className={styles.logoImg} />
        <span className={styles.serviceName}>ServiceName</span>
      </div>

      {/* Menu list card */}
      <div className={styles.menuCard}>
        <ul className={styles.list}>
          {pages.map((page) => (
            <li
              key={page.id}
              className={`${styles.item} ${page.id === selectedId ? styles.selected : ''}`}
            >
              <button
                className={styles.pageButton}
                onClick={() => onSelect(page.id)}
              >
                {page.title || '(無題)'}
              </button>
              {isEditing && (
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(page.id)}
                  title="ページを削除"
                >
                  <img src="/icons/delete.svg" alt="削除" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar footer */}
      <div className={styles.sidebarFooter}>
        {isEditing ? (
          <>
            <button
              className={styles.addBtn}
              onClick={onCreate}
              title="ページを追加"
            >
              <img src="/icons/+.svg" alt="追加" />
              <span className={styles.btnLabel}>Add</span>
            </button>
            <button
              className={styles.doneBtn}
              onClick={() => setIsEditing(false)}
              title="編集完了"
            >
              <img src="/icons/done.svg" alt="完了" />
              <span className={styles.btnLabel}>Done</span>
            </button>
          </>
        ) : (
          <button
            className={styles.editBtn}
            onClick={() => setIsEditing(true)}
            title="メニュー編集"
          >
            <img src="/icons/edit.svg" alt="編集" />
            <span className={styles.btnLabel}>Edit</span>
          </button>
        )}
      </div>
    </aside>
  )
}
