const { Router } = require('express')

const { Question } = require('../../../models')
const { Answer } = require('../../../models')
const AnswerRouter = require('./answers')

const router = new Router({ mergeParams: true })

router.get('/', (req, res) => {
  try {
    let questions = Question.get()
    const quizId = parseInt(req.params.quizId, 10)
    questions.forEach((question) =>
      question.answers = Answer.get().filter((answer) => answer.questionId === question.id))
    res.status(200).json(questions.filter((question) => question.quizId === quizId))
  } catch (err) {
    res.status(500)
      .json(err)
  }
})

router.use('/:questionId/answers', AnswerRouter)

router.get('/:questionId', (req, res) => {
  try {
    res.status(200)
      .json(Question.getById(req.params.questionId))
  } catch (err) {
    res.status(500)
      .json(err)
  }
})

router.delete('/:questionId', (req, res) => {
  try {
    res.status(200)
      .json(Question.delete(req.params.questionId))
  } catch (err) {
    res.status(500)
      .json(err)
  }
})

router.put('/:questionId', (req, res) => {
  try {
    res.status(200)
      .json(Question.update(req.params.questionId, req.body))
  } catch (err) {
    res.status(500)
      .json(err)
  }
})

router.post('/', (req, res) => {
  try {
    req.body.quizId = parseInt(req.params.quizId, 10)
    const question = Question.create({ ...req.body })
    res.status(201)
      .json(question)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400)
        .json(err.extra)
    } else {
      res.status(500)
        .json(err)
    }
  }
})
module.exports = router
