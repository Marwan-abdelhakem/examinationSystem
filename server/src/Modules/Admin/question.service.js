import successResponse from "../../Utlis/successRespone.utlis.js";
import * as dbService from "../../DB/dbServices.js";
import QuestionsModel from "../../DB/models/questions.model.js";
import QuizModel from "../../DB/models/Quiz.model.js";
import UserModel from "../../DB/models/user.model.js";

export const createQuiz = async (req, res, next) => {
  const { quizName, questionsArray, durationInMinutes } = req.body;

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
        durationInMinutes,
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
    message: "Quiz Create Successfully",
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

export const saveExamResult = async (req, res, next) => {
  try {
    const { examName, score } = req.body;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(
        new Error("User not found", { cause: 404 })
      );
    }

    const examIndex = user.exams.findIndex(
      exam => exam.examName === examName
    );

    //  if exam already exists ->  update
    if (examIndex !== -1) {

      user.exams[examIndex].score = score;
      user.exams[examIndex].date = new Date();

    } else {

        //  if exam not exists -> push new result to exams array
      user.exams.push({
        examName,
        score,
        date: new Date()
      });

    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Exam result saved successfully"
    });

  } catch (error) {
    return next(new Error(error.message, { cause: 500 }));
  }
};


export const getMyGrades = async (req, res, next) => {
  try {
    // 1. الوصول للمستخدم عن طريق الـ ID المخزن في req.user (من ميدل وير الـ auth)
    // بنستخدم .select عشان نجيب مصفوفة الامتحانات فقط ونوفر في مساحة البيانات
    const user = await UserModel.findById(req.user._id).select("exams");

    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    // 2. إرجاع مصفوفة الدرجات كاملة
    return res.status(200).json({
      message: "Success",
      resultsCount: user.exams.length,
      grades: user.exams, // هذه المصفوفة تحتوي على examName, score, date
    });
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }));
  }
};

export const getAllQuiz = async (req, res, next) => {
  const quizs = await QuizModel.find().select("quizName durationInMinutes");
  if (!quizs) return next(new Error("not founded quiz", { cause: 409 }));
  return successResponse({
    res,
    statusCode: 200,
    message: "Quiz fetched successfully",
    data: {
      quizs,
    },
  });
};

export const getAllUsers = async (req, res, next) => {
  const users = await UserModel.find();
  if (!users) {
    return next(new Error("not founded Users", { cause: 409 }));
  }
  return successResponse({
    res,
    statusCode: 200,
    message: "users fetched successfully",
    data: {
      users,
    },
  });
};

export const getallQuiz = async (req, res, next) => {
  try {
    const quizzes = await QuizModel.find().select("quizName durationInMinutes");

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

// export const updateQuiz = async (req, res, next) => {

// }
