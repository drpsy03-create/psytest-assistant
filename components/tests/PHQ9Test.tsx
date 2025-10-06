import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PHQ9TestProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  text: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Слабый интерес или удовольствие от деятельности"
  },
  {
    id: 2,
    text: "Чувство подавленности, депрессии или безнадежности"
  },
  {
    id: 3,
    text: "Проблемы с засыпанием, сном или слишком много сна"
  },
  {
    id: 4,
    text: "Чувство усталости или недостатка энергии"
  },
  {
    id: 5,
    text: "Плохой аппетит или переедание"
  },
  {
    id: 6,
    text: "Плохое мнение о себе или чувство неудачника, или что вы подвели себя или семью"
  },
  {
    id: 7,
    text: "Проблемы с концентрацией внимания на таких вещах, как чтение газеты или просмотр телевизора"
  },
  {
    id: 8,
    text: "Замедленные движения или речь, которые другие могли заметить. Или наоборот - беспокойство или возбуждение, из-за которых вы двигаетесь намного больше, чем обычно"
  },
  {
    id: 9,
    text: "Мысли о том, что лучше было бы умереть, или о нанесении себе вреда каким-либо образом"
  }
];

const answerOptions = [
  { value: 0, label: "Совсем нет" },
  { value: 1, label: "Несколько дней" },
  { value: 2, label: "Более половины дней" },
  { value: 3, label: "Почти каждый день" }
];

export function PHQ9Test({ onComplete, onBack }: PHQ9TestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (value: string) => {
    const numericValue = parseInt(value);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: numericValue
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
    
    // Mock отправка результатов врачу
    setTimeout(() => {
      toast.success('Результаты PHQ-9 отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score <= 4) return { level: 'Минимальная', color: 'text-green-600', description: 'Депрессивная симптоматика минимальна или отсутствует' };
    if (score <= 9) return { level: 'Легкая', color: 'text-yellow-600', description: 'Легкая депрессия' };
    if (score <= 14) return { level: 'Умеренная', color: 'text-orange-600', description: 'Умеренная депрессия' };
    if (score <= 19) return { level: 'Умеренно-тяжелая', color: 'text-red-500', description: 'Умеренно-тяжелая депрессия' };
    return { level: 'Тяжелая', color: 'text-red-700', description: 'Тяжелая депрессия' };
  };

  const hasSuicidalThoughts = answers[8] > 0;

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
              <CardTitle className="text-2xl">Тест PHQ-9 завершен</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasSuicidalThoughts && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="font-semibold text-red-800">Важно!</h3>
                  </div>
                  <p className="text-sm text-red-700">
                    Ваши ответы указывают на наличие суицидальных мыслей. 
                    Результаты немедленно переданы вашему врачу. 
                    При острой необходимости обратитесь в службу экстренной помощи.
                  </p>
                </div>
              )}

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}</div>
                <div className="text-lg text-gray-600">баллов из 27 возможных</div>
                <div className={`text-xl font-semibold mt-2 ${severity.color}`}>
                  {severity.level} депрессия
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Интерпретация результата:</h3>
                <p className="text-sm text-gray-700">{severity.description}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ИИ-анализ депрессивных симптомов:</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {score <= 4 && (
                    <p>Анализ показывает отсутствие значимых депрессивных симптомов. Текущее эмоциональное состояние находится в пределах нормы.</p>
                  )}
                  {score > 4 && score <= 9 && (
                    <p>Выявлены признаки легкой депрессии. Наблюдается снижение настроения и энергии. Рекомендуется поведенческая активация и психологическая поддержка.</p>
                  )}
                  {score > 9 && score <= 14 && (
                    <p>Умеренная депрессия влияет на повседневное функционирование. Характерны нарушения сна, аппетита и концентрации внимания. Необходима профессиональная помощь.</p>
                  )}
                  {score > 14 && score <= 19 && (
                    <p>Умеренно-тяжелая депрессия значительно нарушает качество жизни. Выражены соматические симптомы и когнитивные нарушения. Требуется комплексное лечение.</p>
                  )}
                  {score > 19 && (
                    <p>Тяжелая депрессия с выраженными симптомами, включая возможные психотические проявления. Необходимо стационарное лечение или интенсивная амбулаторная терапия.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Клинические рекомендации:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты переданы вашему лечащему врачу</li>
                  {score <= 4 && <li>• Профилактические меры: здоровый образ жизни, регулярные физические упражнения</li>}
                  {score > 4 && score <= 9 && (
                    <>
                      <li>• Рассмотреть психотерапевтическое сопровождение</li>
                      <li>• Поведенческая активация и планирование приятных активностей</li>
                    </>
                  )}
                  {score > 9 && score <= 14 && (
                    <>
                      <li>• Необходима консультация врача-психиатра</li>
                      <li>• Рассмотреть медикаментозную терапию</li>
                      <li>• Когнитивно-поведенческая терапия</li>
                    </>
                  )}
                  {score > 14 && (
                    <>
                      <li>• Требуется неотложная консультация психиатра</li>
                      <li>• Антидепрессивная терапия</li>
                      <li>• Регулярный мониторинг состояния</li>
                    </>
                  )}
                  {hasSuicidalThoughts && <li>• Контроль суицидального риска</li>}
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
            <CardTitle>PHQ-9 - Опросник здоровья пациента</CardTitle>
            <div className="text-sm text-gray-600">
              За последние 2 недели, как часто вас беспокоили следующие проблемы?
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{questions[currentQuestion].text}</h3>
                <RadioGroup 
                  value={answers[currentQuestion]?.toString() || ""} 
                  onValueChange={handleAnswer}
                >
                  {answerOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label 
                        htmlFor={`option-${option.value}`} 
                        className="cursor-pointer flex-1"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {currentQuestion === 8 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-sm font-semibold text-orange-800">Важный вопрос</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Если у вас есть мысли о самоповреждении, немедленно обратитесь за помощью к специалисту или в службу экстренной психологической помощи.
                  </p>
                </div>
              )}

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