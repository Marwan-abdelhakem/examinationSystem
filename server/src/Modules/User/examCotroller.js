import QuizModel from "../../DB/models/Quiz.model.js";
import QuestionsModel from "../../DB/models/questions.model.js";
import ExamAttempt from "../../DB/models/examAttempt.js";
import UserModel from "../../DB/models/user.model.js";

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

/*
============================
START EXAM
============================
*/

export const startExam = async (req, res) => {
  try {
    const { quizId } = req.params;

    const userId = req.user._id;

    const quiz = await QuizModel.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }
    // session lock check
    const activeAttempt = await ExamAttempt.findOne({
      userId,
      quizId,
      sessionActive: true,
    });

    if (activeAttempt) {
      return res.status(400).json({
        message: "Exam session locked",
      });
    }
    //Attempt count check
    const lastAttempt = await ExamAttempt.findOne({
      userId,
      quizId,
    }).sort({ attemptNumber: -1 });

    const attemptNumber = lastAttempt ? lastAttempt.attemptNumber + 1 : 1;

    if (attemptNumber > 2) {
      return res.status(400).json({
        message: "Max attempts reached",
      });
    }
    // console.log("USER:", req.user);

    const questions = await QuestionsModel.find({
      quizId,
    }).select("-correctAnswerIndex");

    if (!questions.length) {
      return res.status(400).json({
        message: "No questions found",
      });
    }

    // const shuffled = shuffleArray([...questions]);
    const shuffled = questions.sort(() => Math.random() - 0.5);

    const questionsOrder = shuffled.map((q) => q._id);

    const endAt = new Date(Date.now() + quiz.duration * 60 * 1000);

    const attempt = await ExamAttempt.create({
      userId,
      quizId,
      attemptNumber,
      questionsOrder,
      endAt,
      essionActive: true
    });

    res.status(200).json({
      attemptId: attempt._id,
      endAt,
      questions: shuffled.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      })),
    });
  } catch (error) {
    // console.error(error)
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
============================
SAVE ANSWER
============================
*/

export const saveAnswer = async (req, res) => {
  try {
    const { attemptId, questionId, selectedOptionIndex } = req.body;

    const attempt = await ExamAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        message: "Attempt not found",
      });
    }

    if (attempt.status === "submitted") {
      return res.status(400).json({
        message: "Exam already submitted",
      });
    }

    if (new Date() > new Date(attempt.endAt)) {
      attempt.status = "submitted";
      await attempt.save();

      return res.status(400).json({
        message: "Exam time is finished",
      });
    }

    const answerIndex = attempt.answers.findIndex(
      (a) => a.questionId.toString() === questionId,
    );

    if (answerIndex !== -1) {
      attempt.answers[answerIndex].selectedOptionIndex = selectedOptionIndex;
    } else {
      attempt.answers.push({
        questionId,
        selectedOptionIndex,
      });
    }

    await attempt.save();

    res.json({
      message: "Answer saved",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/*
============================
SUBMIT EXAM
============================
*/

// export const submitExam = async (req, res) => {
//   try {
//     // const { attemptId } = req.body;
//     const attemptId = req.body?.attemptId;

//     if (!attempt) {
//       return res.status(404).json({
//         message: "Attempt not found",
//       });
//     }

//     const attempt = await ExamAttempt.findById(attemptId)
//       .populate("answers.questionId")
//       .populate("quizId");

//     if (attempt.status === "submitted") {
//       return res.status(400).json({
//         message: "Exam already submitted",
//       });
//     }

//     if (new Date() > new Date(attempt.endAt)) {
//       attempt.status = "submitted";
//     }

//     let score = 0;

//     attempt.answers.forEach((ans) => {
//       if (ans.questionId.correctAnswerIndex === ans.selectedOptionIndex) {
//         score++;
//       }
//     });

//     attempt.score = score;
//     attempt.status = "submitted";

//     await attempt.save();

//     // await UserModel.findByIdAndUpdate(attempt.userId, {
//     //   $push: {
//     //     exams: {
//     //       examName: attempt.quizId.quizName,
//     //       score,
//     //       totalScore: attempt.questionsOrder.length
//     //     }
//     //   }
//     // });

//     await UserModel.findByIdAndUpdate(attempt.userId, {
//       $push: {
//         exams: {
//           examName: attempt.quizId?.quizName || "quiz",
//           score,
//           totalScore: attempt.questionsOrder?.length || 0,
//         },
//       },
//     });

//     res.json({
//       score,
//       total: attempt.questionsOrder.length,
//     });
//   } catch (error) {
//     // catch (error) {
//     //   res.status(500).json({
//     //     message: "Server error",
//     //   });
//     // }
//     console.error(error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const submitExam = async (req, res) => {
  try {
    const attemptId = req.body?.attemptId;

    if (!attemptId) {
      return res.status(400).json({
        message: "attemptId is required",
      });
    }

    const attempt = await ExamAttempt.findById(attemptId)
      .populate("answers.questionId")
      .populate("quizId");

    if (!attempt) {
      return res.status(404).json({
        message: "Attempt not found",
      });
    }

    if (attempt.status === "submitted") {
      return res.status(400).json({
        message: "Exam already submitted",
      });
    }

    if (new Date() > new Date(attempt.endAt)) {
      attempt.status = "submitted";
    }

    let score = 0;

    attempt.answers.forEach((ans) => {
      if (ans.questionId.correctAnswerIndex === ans.selectedOptionIndex) {
        score++;
      }
    });

    attempt.score = score;
    attempt.status = "submitted";
    attempt.sessionActive = false;

    await attempt.save();

    await UserModel.findByIdAndUpdate(attempt.userId, {
      $push: {
        exams: {
          examName: attempt.quizId?.quizName || "quiz",
          score,
          totalScore: attempt.questionsOrder?.length || 0,
        },
      },
    });

    res.json({
      score,
      total: attempt.questionsOrder.length,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
