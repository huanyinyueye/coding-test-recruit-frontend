import { useState, useEffect } from 'react'
import type { Content } from '../../api/content'
import styles from './PageEditor.module.css'

interface Props {
  page: Content
  onSaveTitle: (title: string) => Promise<void>
  onSaveBody: (body: string) => Promise<void>
}

export function validateTitle(value: string): string | null {
  if (value.length < 1) return 'タイトルは1文字以上入力してください'
  if (value.length > 50) return 'タイトルは50文字以内で入力してください'
  return null
}

export function validateBody(value: string): string | null {
  if (value.length < 10) return '本文は10文字以上入力してください'
  if (value.length > 2000) return '本文は2000文字以内で入力してください'
  return null
}

export function PageEditor({ page, onSaveTitle, onSaveBody }: Props) {
  // Title section state
  const [titleEditing, setTitleEditing] = useState(false)
  const [titleValue, setTitleValue] = useState(page.title ?? '')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [titleSaving, setTitleSaving] = useState(false)

  // Body section state
  const [bodyEditing, setBodyEditing] = useState(false)
  const [bodyValue, setBodyValue] = useState(page.body ?? '')
  const [bodyError, setBodyError] = useState<string | null>(null)
  const [bodySaving, setBodySaving] = useState(false)

  // Reset when page changes
  useEffect(() => {
    setTitleValue(page.title ?? '')
    setBodyValue(page.body ?? '')
    setTitleEditing(false)
    setBodyEditing(false)
    setTitleError(null)
    setBodyError(null)
  }, [page.id])

  // ── Title handlers ──
  const handleTitleEdit = () => {
    setTitleError(null)
    setTitleEditing(true)
  }

  const handleTitleCancel = () => {
    setTitleValue(page.title ?? '')
    setTitleError(null)
    setTitleEditing(false)
  }

  const handleTitleSave = async () => {
    const err = validateTitle(titleValue)
    if (err) { setTitleError(err); return }
    setTitleSaving(true)
    try {
      await onSaveTitle(titleValue)
      setTitleEditing(false)
      setTitleError(null)
    } finally {
      setTitleSaving(false)
    }
  }

  // ── Body handlers ──
  const handleBodyEdit = () => {
    setBodyError(null)
    setBodyEditing(true)
  }

  const handleBodyCancel = () => {
    setBodyValue(page.body ?? '')
    setBodyError(null)
    setBodyEditing(false)
  }

  const handleBodySave = async () => {
    const err = validateBody(bodyValue)
    if (err) { setBodyError(err); return }
    setBodySaving(true)
    try {
      await onSaveBody(bodyValue)
      setBodyEditing(false)
      setBodyError(null)
    } finally {
      setBodySaving(false)
    }
  }

  return (
    <div className={styles.editor}>
      {/* ── Title row ── */}
      <div className={styles.titleRow}>
        <div className={`${styles.titleContainer} ${titleEditing ? styles.editing : ''}`}>
          {titleEditing ? (
            <input
              className={styles.titleInput}
              value={titleValue}
              onChange={(e) => {
                setTitleValue(e.target.value)
                setTitleError(validateTitle(e.target.value))
              }}
              maxLength={50}
              placeholder="タイトルを入力"
              autoFocus
              disabled={titleSaving}
            />
          ) : (
            <h1 className={styles.title}>{page.title || '(無題)'}</h1>
          )}
        </div>

        <div className={styles.actions}>
          {titleEditing ? (
            <>
              <button
                className={styles.cancelBtn}
                onClick={handleTitleCancel}
                disabled={titleSaving}
                title="キャンセル"
              >
                <img src="/icons/cancel.svg" alt="キャンセル" />
                <span className={styles.btnLabel}>Cancel</span>
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleTitleSave}
                disabled={titleSaving}
                title="保存"
              >
                <img src="/icons/save.svg" alt="保存" />
                <span className={styles.btnLabel}>Save</span>
              </button>
            </>
          ) : (
            <button
              className={styles.editBtn}
              onClick={handleTitleEdit}
              title="タイトルを編集"
            >
              <img src="/icons/edit.svg" alt="タイトル編集" />
              <span className={styles.btnLabel}>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Title validation (when editing) */}
      {titleEditing && (
        <div className={styles.titleValidation}>
          <span className={styles.error}>{titleError ?? ''}</span>
          <span className={styles.count}>{titleValue.length} / 50</span>
        </div>
      )}

      {/* ── Body row ── */}
      <div className={styles.bodyRow}>
        <div className={`${styles.bodyContainer} ${bodyEditing ? styles.editing : ''}`}>
          <div className={styles.bodyContent}>
            {bodyEditing ? (
              <textarea
                className={styles.bodyTextarea}
                value={bodyValue}
                onChange={(e) => {
                  setBodyValue(e.target.value)
                  setBodyError(validateBody(e.target.value))
                }}
                maxLength={2000}
                placeholder="本文を入力（10文字以上）"
                autoFocus
                disabled={bodySaving}
              />
            ) : (
              <p className={styles.bodyText}>{page.body || '(本文なし)'}</p>
            )}
          </div>

          {/* Body validation (when editing) */}
          {bodyEditing && (
            <div className={styles.validationRow}>
              <span className={styles.error}>{bodyError ?? ''}</span>
              <span className={styles.count}>{bodyValue.length} / 2000</span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {bodyEditing ? (
            <>
              <button
                className={styles.cancelBtn}
                onClick={handleBodyCancel}
                disabled={bodySaving}
                title="キャンセル"
              >
                <img src="/icons/cancel.svg" alt="キャンセル" />
                <span className={styles.btnLabel}>Cancel</span>
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleBodySave}
                disabled={bodySaving}
                title="保存"
              >
                <img src="/icons/save.svg" alt="保存" />
                <span className={styles.btnLabel}>Save</span>
              </button>
            </>
          ) : (
            <button
              className={styles.editBtn}
              onClick={handleBodyEdit}
              title="本文を編集"
            >
              <img src="/icons/edit.svg" alt="本文編集" />
              <span className={styles.btnLabel}>Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
