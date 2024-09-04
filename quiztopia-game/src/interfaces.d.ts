interface Question {
    name: string;
    question: string;
    answer: string;
    location: {
      longitude: string;
      latitude: string;
    };
  }
  
  interface Quiz {
    questions: Question[];
    quizId: string;
    userId: string;
    username: string;
  }

  export { Question, Quiz }