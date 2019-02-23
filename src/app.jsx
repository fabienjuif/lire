/* eslint-env browser */
import React, { useEffect, useState } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import demo from './demo'
import './app.css'

const App = () => {
  const [wordIndex, setWordIndex] = useLocalStorage('word-index', 0)
  const [timerPerWord, setTimePerWord] = useLocalStorage('time-per-word', 180)
  const [words, setWords] = useLocalStorage('words', [])
  const [pause, setPause] = useState(true)
  const [inInput, setInInput] = useState(false)

  if (words.length === 0) {
    setWords(demo.trim().split(/[\n| ]/))
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (inInput) return
      if (e.keyCode !== 32 /* space */) return
      e.preventDefault()
      if (pause) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => setPause(false), 400)
      } else {
        setPause(true)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  let timer
  useEffect(
    () => {
      timer = setTimeout(
        () => {
          if (wordIndex >= words.length) {
            setPause(true)
            setWordIndex(0)
            return
          }

          if (pause) return

          setWordIndex(wordIndex + 1)
        },
        timerPerWord,
      )

      return () => {
        if (timer) clearTimeout(timer)
      }
    },
    [wordIndex, pause],
  )

  const changeWord = (newWordIndex) => {
    if (timer) clearTimeout(timer)
    setPause(true)
    setWordIndex(newWordIndex)
  }

  const d = new Date(1000 * Math.round(timerPerWord * (words.length - wordIndex - 1) / 1000))

  return (
    <div className="app">
      <div
        className={`header ${pause ? 'pause' : 'resume'}`}
      >
        <div
          className="stats"
        >
          <button
            type="button"
            onClick={() => setTimePerWord(timerPerWord + 5)}
          >
            Slower
          </button>

          <div>
            <span className="value">
              {Math.round(1 / (timerPerWord / 1000 / 60))}
            </span>
            {' words per minutes'}
            <br />
            <span className="value">
              {new Intl.DateTimeFormat('fr', { minute: '2-digit', second: '2-digit' }).format(d)}
            </span>
            {' remaining'}
          </div>

          <button
            type="button"
            onClick={() => setTimePerWord(timerPerWord - 5)}
          >
            Faster
          </button>
        </div>

        <input
          className="input-text"
          type="text"
          placeholder="Paste your content here"
          onChange={(e) => {
            setInInput(true)
            setWords(e.target.value.trim().split(/[\n| ]/))
            setWordIndex(0)
          }}
          onBlur={() => {
            setInInput(false)
          }}
        />

        <div
          className="actions"
        >
          <button
            className="btn-resume"
            type="button"
            onClick={() => setPause(!pause)}
          >
            {pause ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`read-word ${pause ? 'resume' : 'pause'}`}
        onClick={() => setPause(!pause)}
      >
        {words[wordIndex]}
      </button>

      <div
        className={`content ${pause ? 'pause' : 'resume'}`}
      >
        {words.map((word, index) => (
          <button
            type="button"
            className={`word ${wordIndex === index ? 'current-word' : ''}`}
            onClick={() => changeWord(index)}
          >
            {' '}
            {word}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
