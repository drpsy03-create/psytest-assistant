import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BeckDepressionInventoryProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  title: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "Печаль",
    options: [
      "Я не чувствую себя печальным",
      "Я чувствую себя печальным или угнетенным",
      "Я постоянно чувствую себя печальным или угнетенным и не могу отвлечься от этого",
      "Я настолько печален и несчастен, что не могу этого вынести"
    ]
  },
  {
    id: 2,
    title: "Пессимизм",
    options: [
      "Я смотрю в будущее без особого разочарования",
      "Я чувствую себя разочарованным в отношении будущего",
      "Я чувствую, что мне нечего ждать от будущего",
      "Я чувствую, что будущее безнадежно и дела не могут улучшиться"
    ]
  },
  {
    id: 3,
    title: "Чувство несостоятельности",
    options: [
      "Я не чувствую себя неудачником",
      "Я чувствую, что потерпел больше неудач, чем обычный человек",
      "Когда оглядываюсь на свою жизнь, я вижу лишь череду неудач",
      "Я чувствую, что как личность я полный неудачник"
    ]
  },
  {
    id: 4,
    title: "Потеря удовольствия",
    options: [
      "Я получаю такое же удовольствие от жизни, как и раньше",
      "Я не получаю удовольствие от жизни так, как раньше",
      "Я больше не получаю настоящего удовольствия ни от чего",
      "Я недоволен всем или мне все надоело"
    ]
  },
  {
    id: 5,
    title: "Чувство вины",
    options: [
      "Я не чувствую особой вины",
      "Я чувствую вину за многие вещи, которые я сделал или должен был сделать",
      "Я чувствую себя довольно виноватым большую часть времени",
      "Я чувствую себя виноватым постоянно"
    ]
  },
  {
    id: 6,
    title: "Ощущение наказанности",
    options: [
      "Я не чувствую, что меня наказывают",
      "Я чувствую, что могу быть наказан",
      "Я ожидаю, что буду наказан",
      "Я чувствую, что меня наказывают"
    ]
  },
  {
    id: 7,
    title: "Самокритичность",
    options: [
      "Я не испытываю разочарования в себе",
      "Я разочарован в себе",
      "Я испытываю отвращение к себе",
      "Я ненавижу себя"
    ]
  },
  {
    id: 8,
    title: "Самообвинения",
    options: [
      "Я не виню себя больше обычного",
      "Я виню себя за свои ошибки и слабости",
      "Я виню себя во всем плохом, что происходит",
      "Я виню себя за все несчастья"
    ]
  },
  {
    id: 9,
    title: "Суицидальные мысли",
    options: [
      "У меня нет мыслей о том, чтобы причинить себе вред",
      "У меня есть мысли о том, чтобы причинить себе вред, но я не буду это делать",
      "Я хотел бы покончить с собой",
      "Я покончил бы с собой, если бы представилась возможность"
    ]
  },
  {
    id: 10,
    title: "Плач",
    options: [
      "Я плачу не больше обычного",
      "Я плачу больше, чем раньше",
      "Я плачу по любому поводу",
      "Я хочу плакать, но не могу"
    ]
  }
];

export function BeckDepressionInventory({ onComplete, onBack }: BeckDepressionInventoryProps) {
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
      toast.success('Результаты теста отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score <= 13) return { level: 'Минимальная депрессия', color: 'text-green-600' };
    if (score <= 19) return { level: 'Легкая депрессия', color: 'text-yellow-600' };
    if (score <= 28) return { level: 'Умеренная депрессия', color: 'text-orange-600' };
    return { level: 'Тяжелая депрессия', color: 'text-red-600' };
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
              <CardTitle className="text-2xl">Тест завершен</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}</div>
                <div className="text-lg text-gray-600">баллов из 63 возможных</div>
                <div className={`text-xl font-semibold mt-2 ${severity.color}`}>
                  {severity.level}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Интерпретация результата:</h3>
                <p className="text-sm text-gray-700">
                  {score <= 13 && "Ваши результаты указывают на минимальный уровень депрессивных симптомов. Это в пределах нормы."}
                  {score > 13 && score <= 19 && "Выявлены признаки легкой депрессии. Рекомендуется обсуждение результатов с врачом."}
                  {score > 19 && score <= 28 && "Результаты указывают на умеренную депрессию. Необходима консультация специалиста."}
                  {score > 28 && "Выявлены признаки тяжелой депрессии. Требуется немедленная консультация врача-психиатра."}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Важно помнить:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты теста являются ориентировочными</li>
                  <li>• Только врач может поставить точный диагноз</li>
                  <li>• Результаты отправлены вашему лечащему врачу</li>
                  <li>• При суицидальных мыслях немедленно обратитесь за помощью</li>
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
            <CardTitle>Шкала депрессии Бека (BDI-II)</CardTitle>
            <div className="text-sm text-gray-600">
              Выберите утверждение, которое наилучшим образом описывает ваше состояние в течение последних двух недель
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{questions[currentQuestion].title}</h3>
                <RadioGroup 
                  value={answers[currentQuestion]?.toString() || ""} 
                  onValueChange={handleAnswer}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="text-sm cursor-pointer leading-relaxed flex-1"
                      >
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