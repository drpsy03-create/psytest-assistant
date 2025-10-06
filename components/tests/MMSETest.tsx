import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ArrowLeft, CheckCircle, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MMSETestProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  category: string;
  question: string;
  type: 'radio' | 'input' | 'multiple';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

const questions: Question[] = [
  // Ориентация во времени (5 баллов)
  { id: 1, category: "Ориентация во времени", question: "Какой сейчас год?", type: "input", correctAnswer: "2024", points: 1 },
  { id: 2, category: "Ориентация во времени", question: "Какое сейчас время года?", type: "radio", options: ["Весна", "Лето", "Осень", "Зима"], correctAnswer: "Зима", points: 1 },
  { id: 3, category: "Ориентация во времени", question: "Какой сейчас месяц?", type: "input", correctAnswer: "январь", points: 1 },
  { id: 4, category: "Ориентация во времени", question: "Какое сегодня число?", type: "input", points: 1 },
  { id: 5, category: "Ориентация во времени", question: "Какой сегодня день недели?", type: "radio", options: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"], points: 1 },

  // Ориентация в месте (5 баллов)
  { id: 6, category: "Ориентация в месте", question: "В какой стране мы находимся?", type: "input", correctAnswer: "россия", points: 1 },
  { id: 7, category: "Ориентация в месте", question: "В каком городе мы находимся?", type: "input", points: 1 },
  { id: 8, category: "Ориентация в месте", question: "На каком этаже мы находимся?", type: "input", points: 1 },
  { id: 9, category: "Ориентация в месте", question: "Как называется это учреждение?", type: "input", points: 1 },
  { id: 10, category: "Ориентация в месте", question: "В какой области/регионе мы находимся?", type: "input", points: 1 },

  // Восприятие (3 балла)
  { id: 11, category: "Восприятие", question: "Запомните эти три слова: ЛИМОН, КЛЮЧ, ШАРИК. Повторите их.", type: "input", points: 3 },

  // Внимание и счет (5 баллов)
  { id: 12, category: "Внимание и счет", question: "Сосчитайте от 100, отнимая по 7. Назовите первые 5 чисел.", type: "input", correctAnswer: "93, 86, 79, 72, 65", points: 5 },

  // Память (3 балла)
  { id: 13, category: "Память", question: "Назовите три слова, которые я просил запомнить ранее.", type: "input", correctAnswer: "лимон ключ шарик", points: 3 },

  // Речь (9 баллов)
  { id: 14, category: "Речь", question: "Как называется этот предмет? (показывается ручка)", type: "radio", options: ["Ручка", "Карандаш", "Маркер", "Фломастер"], correctAnswer: "Ручка", points: 1 },
  { id: 15, category: "Речь", question: "Как называется этот предмет? (показываются часы)", type: "radio", options: ["Часы", "Будильник", "Секундомер", "Таймер"], correctAnswer: "Часы", points: 1 },
  { id: 16, category: "Речь", question: "Повторите фразу: 'Никаких если, и или но'", type: "radio", options: ["Повторил правильно", "Повторил с ошибками", "Не смог повторить"], points: 1 },
];

export function MMSETest({ onComplete, onBack }: MMSETestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value.toLowerCase().trim()
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (!userAnswer) return;

      switch (question.id) {
        case 1: // Год
          if (userAnswer === "2024") totalScore += 1;
          break;
        case 2: // Время года
          if (userAnswer === "зима") totalScore += 1;
          break;
        case 3: // Месяц
          if (userAnswer.includes("январь")) totalScore += 1;
          break;
        case 4: // Число
          const day = new Date().getDate();
          if (userAnswer.includes(day.toString())) totalScore += 1;
          break;
        case 5: // День недели
          const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
          const today = days[new Date().getDay()];
          if (userAnswer === today) totalScore += 1;
          break;
        case 6: // Страна
          if (userAnswer.includes("россия")) totalScore += 1;
          break;
        case 7: // Город
          totalScore += 1; // Засчитываем любой разумный ответ
          break;
        case 8: // Этаж
        case 9: // Учреждение
        case 10: // Область
          totalScore += 1; // Засчитываем любой ответ
          break;
        case 11: // Запоминание слов
          const words = ["лимон", "ключ", "шарик"];
          const mentioned = words.filter(word => userAnswer.includes(word));
          totalScore += mentioned.length;
          break;
        case 12: // Счет
          if (userAnswer.includes("93") && userAnswer.includes("86")) totalScore += 3;
          else if (userAnswer.includes("93")) totalScore += 1;
          break;
        case 13: // Воспроизведение слов
          const recallWords = ["лимон", "ключ", "шарик"];
          const recalled = recallWords.filter(word => userAnswer.includes(word));
          totalScore += recalled.length;
          break;
        case 14: // Ручка
          if (userAnswer === "ручка") totalScore += 1;
          break;
        case 15: // Часы
          if (userAnswer === "часы") totalScore += 1;
          break;
        case 16: // Повторение фразы
          if (userAnswer === "повторил правильно") totalScore += 1;
          break;
      }
    });
    return totalScore;
  };

  const completeTest = () => {
    const totalScore = calculateScore();
    setScore(totalScore);
    setIsCompleted(true);
    
    // Mock отправка результатов врачу
    setTimeout(() => {
      toast.success('Результаты MMSE отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score >= 27) return { level: 'Норма', color: 'text-green-600', description: 'Когнитивные функции в пределах нормы' };
    if (score >= 24) return { level: 'Легкие нарушения', color: 'text-yellow-600', description: 'Легкие когнитивные нарушения' };
    if (score >= 20) return { level: 'Умеренные нарушения', color: 'text-orange-600', description: 'Умеренные когнитивные нарушения' };
    return { level: 'Выраженные нарушения', color: 'text-red-600', description: 'Выраженные когнитивные нарушения' };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const current = questions[currentQuestion];

  if (isCompleted) {
    const severity = getSeverity(score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Тест MMSE завершен</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}</div>
                <div className="text-lg text-gray-600">баллов из 30 возможных</div>
                <div className={`text-xl font-semibold mt-2 ${severity.color}`}>
                  {severity.level}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Интерпретация результата:</h3>
                <p className="text-sm text-gray-700">{severity.description}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ИИ-анализ когнитивных функций:</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {score >= 27 && (
                    <p>Анализ показывает сохранные когнитивные функции. Ориентация, память, внимание и речевые функции находятся в пределах возрастной нормы.</p>
                  )}
                  {score >= 24 && score < 27 && (
                    <p>Выявлены легкие когнитивные нарушения. Могут наблюдаться незначительные трудности с памятью или концентрацией внимания. Рекомендуется динамическое наблюдение.</p>
                  )}
                  {score >= 20 && score < 24 && (
                    <p>Умеренные когнитивные нарушения влияют на повседневное функционирование. Характерны нарушения памяти, ориентации и исполнительных функций. Необходимо дополнительное обследование.</p>
                  )}
                  {score < 20 && (
                    <p>Выраженные когнитивные нарушения значительно влияют на качество жизни. Наблюдается дезориентация, грубые нарушения памяти и других когнитивных функций. Требуется комплексная диагностика и лечение.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Клинические рекомендации:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты переданы вашему лечащему врачу</li>
                  {score >= 27 && (
                    <>
                      <li>• Поддержание когнитивной активности</li>
                      <li>• Регулярные физические упражнения</li>
                      <li>• Социальная активность</li>
                    </>
                  )}
                  {score >= 24 && score < 27 && (
                    <>
                      <li>• Когнитивные тренировки и упражнения</li>
                      <li>• Повторное тестирование через 6 месяцев</li>
                      <li>• Контроль сосудистых факторов риска</li>
                    </>
                  )}
                  {score >= 20 && score < 24 && (
                    <>
                      <li>• Необходимо расширенное нейропсихологическое обследование</li>
                      <li>• МРТ головного мозга</li>
                      <li>• Когнитивная реабилитация</li>
                    </>
                  )}
                  {score < 20 && (
                    <>
                      <li>• Неотложная консультация невролога</li>
                      <li>• Комплексное обследование на деменцию</li>
                      <li>• Социальная поддержка и уход</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={onComplete} className="flex-1">
                  Вернуться к списку тестов
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Пройти повторно
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div className="text-sm text-gray-600">
            Вопрос {currentQuestion + 1} из {questions.length}
          </div>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-gray-600 mt-2">Прогресс: {Math.round(progress)}%</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              MMSE - Краткая оценка психического статуса
            </CardTitle>
            <div className="text-sm text-gray-600">
              Категория: {current.category}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{current.question}</h3>
                
                {current.type === 'radio' && current.options && (
                  <RadioGroup 
                    value={answers[currentQuestion] || ""} 
                    onValueChange={handleAnswer}
                  >
                    {current.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option.toLowerCase()} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="cursor-pointer flex-1"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {current.type === 'input' && (
                  <div className="space-y-2">
                    <Input
                      value={answers[currentQuestion] || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                      placeholder="Введите ваш ответ..."
                      className="w-full"
                    />
                    {current.id === 11 && (
                      <p className="text-sm text-blue-600">
                        Введите три слова через пробел: ЛИМОН, КЛЮЧ, ШАРИК
                      </p>
                    )}
                    {current.id === 12 && (
                      <p className="text-sm text-blue-600">
                        Пример: 93, 86, 79, 72, 65
                      </p>
                    )}
                    {current.id === 13 && (
                      <p className="text-sm text-blue-600">
                        Вспомните три слова, которые нужно было запомнить
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Назад
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]}
                >
                  {currentQuestion === questions.length - 1 ? 'Завершить тест' : 'Далее'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {current.category && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Категория: {current.category} • Баллы за вопрос: {current.points}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}