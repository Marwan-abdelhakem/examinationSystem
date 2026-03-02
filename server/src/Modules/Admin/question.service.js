import successResponse from "../../Utlis/successRespone.utlis.js";
import * as dbService from "../../DB/dbServices.js";
import QuestionsModel from "../../DB/models/questions.model.js";
import QuizModel from "../../DB/models/Quiz.model.js";

// export const createQuiz = async (req, res, next) => {
//     const { quizName, questionsArray } = req.body;

//     const quiz = await dbService.findOne({ model: QuizModel, filter: { quizName } })
//     if (quiz) {
//         return next(new Error("quiz already exists", { cause: 409 }))
//     }

//     const createQuiz = await dbService.create({ model: QuizModel, data: [{ quizName: quizName.toLowerCase(), totalQuestions: questionsArray.length }] })

//     const preparedQuestions = questionsArray.map(q => ({
//         questionText: q.questionText,
//         options: q.options,
//         correctAnswerIndex: q.correctAnswerIndex,
//         timerPerQuestion: q.timerPerQuestion,
//         quizId: createQuiz[0]._id
//     }));

//     const savedQuestions = await QuestionsModel.insertMany(preparedQuestions);

//     return successResponse({ res, statusCode: 201, message: "Quiz Create Successfully", data: createQuiz, savedQuestions })

// }

export const createQuiz = async (req, res, next) => {
  const { quizName, questionsArray, duration } = req.body;

  const quiz = await dbService.findOne({
    model: QuizModel,
    filter: { quizName },
  });

  if (quiz) {
    return next(new Error("quiz already exists", { cause: 409 }));
  }

  const createQuiz = await dbService.create({
    model: QuizModel,
    data: [
      {
        quizName: quizName.toLowerCase(),
        totalQuestions: questionsArray.length,
        duration ,
      },
    ],
  });

  const preparedQuestions = questionsArray.map((q) => ({
    questionText: q.questionText,
    options: q.options,
    correctAnswerIndex: q.correctAnswerIndex,
    timerPerQuestion: q.timerPerQuestion,
    quizId: createQuiz[0]._id,
  }));

  const savedQuestions = await QuestionsModel.insertMany(preparedQuestions);

  return successResponse({
    res,
    statusCode: 201,
    message: "Quiz Created Successfully",
    data: createQuiz,
    savedQuestions,
  });
};

export const getQuiz = async (req, res, next) => {
  const { quizName } = req.params;

  const quiz = await QuizModel.findOne({ quizName: quizName.toLowerCase() });
  if (!quiz)
    return next(new Error("Users Not FoundedQuiz not founded", { cause: 409 }));

  const questions = await QuestionsModel.find({ quizId: quiz._id });

  return res.json({ quiz, questions });
};

export const getAllQuiz = async (req, res, next) => {
  try {
    const quizzes = await QuizModel.find().select("quizName duration");

    if (!quizzes.length) {
      return next(new Error("No quizzes found", { cause: 404 }));
    }

    return successResponse({
      res,
      statusCode: 200,
      message: "Quiz fetched successfully",
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};
