import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface GAD7TestProps {
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
    text: "Чувство нервозности, тревожности или возбуждения"
  },
  {
    id: 2,
    text: "Неспособность остановить или контролировать беспокойство"
  },
  {
    id: 3,
    text: "Чрезмерное беспокойство по поводу различных вещей"
  },
  {
    id: 4,
    text: "Проблемы с расслаблением"
  },
  {
    id: 5,
    text: "Такое беспокойство, что трудно усидеть на месте"
  },
  {
    id: 6,
    text: "Легкая раздражительность или гневливость"
  },
  {
    id: 7,
    text: "Ощущение страха, как будто что-то ужасное может произойти"
  }
];

const answerOptions = [
  { value: 0, label: "Совсем нет" },
  { value: 1, label: "Несколько дней" },
  { value: 2, label: "Более половины дней" },
  { value: 3, label: "Почти каждый день" }
];

export function GAD7Test({ onComplete, onBack }: GAD7TestProps) {
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
      toast.success('Результаты GAD-7 отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score <= 4) return { level: 'Минимальная тревожность', color: 'text-green-600', description: 'Тревожность в пределах нормы' };
    if (score <= 9) return { level: 'Легкая тревожность', color: 'text-yellow-600', description: 'Легкий уровень тревожности' };
    if (score <= 14) return { level: 'Умеренная тревожность', color: 'text-orange-600', description: 'Умеренный уровень тревожности, рекомендуется консультация специалиста' };
    return { level: 'Тяжелая тревожность', color: 'text-red-600', description: 'Высокий уровень тревожности, необходима консультация врача' };
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
              <CardTitle className="text-2xl">Тест GAD-7 завершен</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}</div>
                <div className="text-lg text-gray-600">баллов из 21 возможного</div>
                <div className={`text-xl font-semibold mt-2 ${severity.color}`}>
                  {severity.level}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Интерпретация результата:</h3>
                <p className="text-sm text-gray-700">{severity.description}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ИИ-анализ симптомов:</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {score <= 4 && (
                    <p>Анализ показывает нормальный уровень тревожности. Эпизодические переживания являются естественной реакцией на стрессовые ситуации.</p>
                  )}
                  {score > 4 && score <= 9 && (
                    <p>Выявлены признаки легкой тревожности. Рекомендуются техники релаксации, дыхательные упражнения и нормализация режима сна.</p>
                  )}
                  {score > 9 && score <= 14 && (
                    <p>Умеренный уровень тревожности может влиять на повседневное функционирование. Рекомендуется психологическая поддержка и возможно медикаментозное лечение.</p>
                  )}
                  {score > 14 && (
                    <p>Высокий уровень тревожности требует профессионального вмешательства. Необходимо комплексное лечение включающее психотерапию и медикаментозную поддержку.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Рекомендации:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты переданы вашему лечащему врачу для анализа</li>
                  <li>• Практикуйте техники глубокого дыхания и медитации</li>
                  <li>• Поддерживайте регулярный режим сна</li>
                  <li>• Ограничьте потребление кофеина и алкоголя</li>
                  {score > 9 && <li>• Рассмотрите возможность консультации с психологом</li>}
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
            <CardTitle>GAD-7 - Шкала генерализованной тревожности</CardTitle>
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