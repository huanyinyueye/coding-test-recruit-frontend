import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PageEditor, validateTitle, validateBody } from '../components/PageEditor/PageEditor'
import type { Content } from '../api/content'

// ── Validation unit tests ──────────────────────────────────────────────────

describe('validateTitle', () => {
  it('returns error when empty', () => {
    expect(validateTitle('')).toBe('タイトルは1文字以上入力してください')
  })

  it('returns null for valid title (1 char)', () => {
    expect(validateTitle('A')).toBeNull()
  })

  it('returns null for valid title (50 chars)', () => {
    expect(validateTitle('A'.repeat(50))).toBeNull()
  })

  it('returns error when title exceeds 50 chars', () => {
    expect(validateTitle('A'.repeat(51))).toBe('タイトルは50文字以内で入力してください')
  })
})

describe('validateBody', () => {
  it('returns error when body is less than 10 chars', () => {
    expect(validateBody('short')).toBe('本文は10文字以上入力してください')
  })

  it('returns null for valid body (10 chars)', () => {
    expect(validateBody('A'.repeat(10))).toBeNull()
  })

  it('returns null for valid body (2000 chars)', () => {
    expect(validateBody('A'.repeat(2000))).toBeNull()
  })

  it('returns error when body exceeds 2000 chars', () => {
    expect(validateBody('A'.repeat(2001))).toBe('本文は2000文字以内で入力してください')
  })
})

// ── Component integration tests ───────────────────────────────────────────

const mockPage: Content = {
  id: 1,
  title: 'Test Title',
  body: 'Test body content here',
}

describe('PageEditor component', () => {
  const onSaveTitle = vi.fn().mockResolvedValue(undefined)
  const onSaveBody = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    onSaveTitle.mockClear()
    onSaveBody.mockClear()
  })

  it('renders page title and body in view mode', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test body content here')).toBeInTheDocument()
  })

  it('shows two edit buttons in view mode', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    expect(screen.getByTitle('タイトルを編集')).toBeInTheDocument()
    expect(screen.getByTitle('本文を編集')).toBeInTheDocument()
  })

  it('shows title input when title edit button is clicked', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('タイトルを編集'))
    expect(screen.getByPlaceholderText('タイトルを入力')).toBeInTheDocument()
  })

  it('shows cancel and save buttons in title edit mode', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('タイトルを編集'))
    expect(screen.getByTitle('キャンセル')).toBeInTheDocument()
    expect(screen.getByTitle('保存')).toBeInTheDocument()
  })

  it('shows validation error when title is empty and save is clicked', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('タイトルを編集'))
    const input = screen.getByPlaceholderText('タイトルを入力')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(screen.getByTitle('保存'))
    expect(screen.getByText('タイトルは1文字以上入力してください')).toBeInTheDocument()
    expect(onSaveTitle).not.toHaveBeenCalled()
  })

  it('calls onSaveTitle with valid title', async () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('タイトルを編集'))
    const input = screen.getByPlaceholderText('タイトルを入力')
    fireEvent.change(input, { target: { value: 'New Title' } })
    fireEvent.click(screen.getByTitle('保存'))
    await waitFor(() => expect(onSaveTitle).toHaveBeenCalledWith('New Title'))
  })

  it('restores original title when cancel is clicked', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('タイトルを編集'))
    const input = screen.getByPlaceholderText('タイトルを入力')
    fireEvent.change(input, { target: { value: 'Discarded' } })
    fireEvent.click(screen.getByTitle('キャンセル'))
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('shows body textarea when body edit button is clicked', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('本文を編集'))
    expect(screen.getByPlaceholderText('本文を入力（10文字以上）')).toBeInTheDocument()
  })

  it('shows validation error when body is too short', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('本文を編集'))
    const textarea = screen.getByPlaceholderText('本文を入力（10文字以上）')
    fireEvent.change(textarea, { target: { value: 'short' } })
    fireEvent.click(screen.getByTitle('保存'))
    expect(screen.getByText('本文は10文字以上入力してください')).toBeInTheDocument()
    expect(onSaveBody).not.toHaveBeenCalled()
  })

  it('calls onSaveBody with valid body', async () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    fireEvent.click(screen.getByTitle('本文を編集'))
    const textarea = screen.getByPlaceholderText('本文を入力（10文字以上）')
    fireEvent.change(textarea, { target: { value: 'This is a valid body text.' } })
    fireEvent.click(screen.getByTitle('保存'))
    await waitFor(() => expect(onSaveBody).toHaveBeenCalledWith('This is a valid body text.'))
  })

  it('title and body can be edited independently', () => {
    render(<PageEditor page={mockPage} onSaveTitle={onSaveTitle} onSaveBody={onSaveBody} />)
    // Click title edit - title input appears, body text still shown
    fireEvent.click(screen.getByTitle('タイトルを編集'))
    expect(screen.getByPlaceholderText('タイトルを入力')).toBeInTheDocument()
    expect(screen.getByText('Test body content here')).toBeInTheDocument()
    // Body edit button still visible
    expect(screen.getByTitle('本文を編集')).toBeInTheDocument()
  })
})
