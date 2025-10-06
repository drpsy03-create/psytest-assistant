import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface HamiltonDepressionTestProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  title: string;
  options: string[];
  scores: number[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "Депрессивное настроение (печаль, безнадежность, беспомощность, чувство собственной малоценности)",
    options: [
      "Отсутствует",
      "Чувства выражены только при прямом вопросе",
      "Чувства сообщаются спонтанно",
      "Чувства проявляются невербально",
      "Пациент выражает только эти чувства как в речи, так и невербально"
    ],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: 2,
    title: "Чувство вины",
    options: [
      "Отсутствует",
      "Самоуничижение, считает, что подвел других",
      "Идеи виновности или размышления о прошлых ошибках или грешных поступках",
      "Настоящее заболевание - это наказание, бредовые идеи виновности",
      "Слышит обвиняющие или осуждающие голоса и/или видит угрожающие зрительные галлюцинации"
    ],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: 3,
    title: "Суицидальные намерения",
    options: [
      "Отсутствуют",
      "Чувствует, что жить не стоит",
      "Желает смерти или мысли о возможности собственной смерти",
      "Суицидальные высказывания или жесты",
      "Попытки самоубийства"
    ],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: 4,
    title: "Ранняя бессонница",
    options: [
      "Отсутствует",
      "Периодически отмечает трудности засыпания, т.е. более чем в течение 0.5 часа",
      "Жалуется на трудности засыпания каждую ночь"
    ],
    scores: [0, 1, 2]
  },
  {
    id: 5,
    title: "Средняя бессонница",
    options: [
      "Отсутствует",
      "Пациент жалуется на беспокойный сон в течение всей ночи",
      "Многократно просыпается в течение ночи - любой подъем с постели кодируется как 2 (исключая физиологические потребности)"
    ],
    scores: [0, 1, 2]
  },
  {
    id: 6,
    title: "Поздняя бессонница",
    options: [
      "Отсутствует",
      "Просыпается рано утром, но засыпает снова",
      "Не может заснуть, если встает с постели"
    ],
    scores: [0, 1, 2]
  },
  {
    id: 7,
    title: "Работоспособность и активность",
    options: [
      "Отсутствуют трудности",
      "Мысли и ощущения неспособности, усталости или слабости, связанные с активностью, работой или хобби",
      "Утрата интереса к активности, хобби или работе - либо сообщается непосредственно пациентом, либо опосредованно, через апатичность, нерешительность и колебания",
      "Уменьшение времени активности или снижение продуктивности",
      "Прекратил работать из-за настоящего заболевания"
    ],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: 8,
    title: "Заторможенность (замедленность мышления и речи; нарушение способности концентрироваться; снижение моторной активности)",
    options: [
      "Нормальная речь и мышление",
      "Легкая заторможенность при опросе",
      "Заметная заторможенность при опросе",
      "Выраженные затруднения при опросе",
      "Полный ступор"
    ],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: 9,
    title: "Ажитация",
    options: [
      "Отсутствует",
      "Беспокойство",
      "Играет руками, теребит волосы и т.д.",
      "Подвижен, не может спокойно сидеть",
      "Заламывает руки, кусает ногти, рвет волосы, кусает губы"
    ],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: 10,
    title: "Тревога психическая",
    options: [
      "Отсутствует",
      "Субъективное напряжение и раздражительность",
      "Беспокойство по незначительным поводам",
      "Тревожное отношение, выражающееся в выражении лица или речи",
      "Страхи, выражаемые и без расспроса"
    ],
    scores: [0, 1, 2, 3, 4]
  }
];

export function HamiltonDepressionTest({ onComplete, onBack }: HamiltonDepressionTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (value: string) => {
    const selectedIndex = parseInt(value);
    const questionScores = questions[currentQuestion].scores;
    const score = questionScores[selectedIndex];
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: score
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

  const completeTest = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setScore(totalScore);
    setIsCompleted(true);
    
    setTimeout(() => {
      toast.success('Результаты шкалы Гамильтона отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score <= 7) return { level: 'Отсутствие депрессии', color: 'text-green-600', description: 'Депрессивная симптоматика отсутствует или минимальна' };
    if (score <= 16) return { level: 'Легкая депрессия', color: 'text-yellow-600', description: 'Легкая степень депрессивных расстройств' };
    if (score <= 23) return { level: 'Умеренная депрессия', color: 'text-orange-600', description: 'Умеренная степень депрессивных расстройств' };
    return { level: 'Тяжелая депрессия', color: 'text-red-600', description: 'Тяжелая степень депрессивных расстройств' };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
              <CardTitle className="text-2xl">Шкала депрессии Гамильтона завершена</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}</div>
                <div className="text-lg text-gray-600">баллов из 52 возможных</div>
                <div className={`text-xl font-semibold mt-2 ${severity.color}`}>
                  {severity.level}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Клиническая интерпретация:</h3>
                <p className="text-sm text-gray-700">{severity.description}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ИИ-анализ по шкале Гамильтона:</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {score <= 7 && (
                    <p>Результаты шкалы Гамильтона указывают на отсутствие клинически значимой депрессивной симптоматики. Настроение и функциональные способности в пределах нормы.</p>
                  )}
                  {score > 7 && score <= 16 && (
                    <p>Выявлена легкая депрессия. Характерны умеренные нарушения настроения, некоторое снижение активности. Рекомендуется психотерапевтическое вмешательство и поведенческие техники.</p>
                  )}
                  {score > 16 && score <= 23 && (
                    <p>Умеренная депрессия с выраженным влиянием на повседневное функционирование. Наблюдаются нарушения сна, снижение работоспособности, тревожные симптомы. Показана комбинированная терапия.</p>
                  )}
                  {score > 23 && (
                    <p>Тяжелая депрессия с значительными функциональными нарушениями. Высокий риск суицидальных мыслей, выраженная психомоторная заторможенность или ажитация. Требуется интенсивное лечение.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Клинические рекомендации:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты переданы лечащему врачу для клинической оценки</li>
                  {score <= 7 && (
                    <>
                      <li>• Поддержание здорового образа жизни</li>
                      <li>• Профилактические мероприятия</li>
                    </>
                  )}
                  {score > 7 && score <= 16 && (
                    <>
                      <li>• Психотерапевтическое сопровождение</li>
                      <li>• Когнитивно-поведенческая терапия</li>
                      <li>• Мониторинг динамики состояния</li>
                    </>
                  )}
                  {score > 16 && score <= 23 && (
                    <>
                      <li>• Консультация врача-психиатра</li>
                      <li>• Рассмотрение медикаментозной терапии</li>
                      <li>• Структурированная психотерапия</li>
                    </>
                  )}
                  {score > 23 && (
                    <>
                      <li>• Неотложная консультация психиатра</li>
                      <li>• Антидепрессивная терапия</li>
                      <li>• Контроль суицидального риска</li>
                      <li>• Возможная госпитализация</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={onComplete} className="flex-1">
                  Завершить
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
            <CardTitle>Шкала депрессии Гамильтона (HDRS)</CardTitle>
            <div className="text-sm text-gray-600">
              Выберите наиболее подходящий вариант, описывающий ваше состояние за последнюю неделю
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{questions[currentQuestion].title}</h3>
                <RadioGroup 
                  value={answers[currentQuestion] !== undefined ? 
                    questions[currentQuestion].scores.indexOf(answers[currentQuestion]).toString() : 
                    ""
                  } 
                  onValueChange={handleAnswer}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="text-sm cursor-pointer leading-relaxed flex-1"
                      >
                        <span className="font-medium text-gray-800">
                          [{questions[currentQuestion].scores[index]} балл{questions[currentQuestion].scores[index] === 1 ? '' : questions[currentQuestion].scores[index] < 5 ? 'а' : 'ов'}]
                        </span>
                        <br />
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
                  disabled={answers[currentQuestion] === undefined}
                >
                  {currentQuestion === questions.length - 1 ? 'Завершить тест' : 'Далее'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}