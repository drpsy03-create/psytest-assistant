import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface STAITestProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  text: string;
  type: 'state' | 'trait';
  reverse?: boolean;
}

const questions: Question[] = [
  // State Anxiety (как вы чувствуете себя сейчас)
  { id: 1, text: "Я спокоен", type: 'state', reverse: true },
  { id: 2, text: "Мне ничто не угрожает", type: 'state', reverse: true },
  { id: 3, text: "Я нахожусь в напряжении", type: 'state' },
  { id: 4, text: "Я внутренне скован", type: 'state' },
  { id: 5, text: "Я чувствую себя свободно", type: 'state', reverse: true },
  { id: 6, text: "Я расстроен", type: 'state' },
  { id: 7, text: "Меня волнуют возможные неудачи", type: 'state' },
  { id: 8, text: "Я ощущаю душевный покой", type: 'state', reverse: true },
  { id: 9, text: "Я встревожен", type: 'state' },
  { id: 10, text: "Я испытываю чувство внутреннего удовлетворения", type: 'state', reverse: true },
  { id: 11, text: "Я уверен в себе", type: 'state', reverse: true },
  { id: 12, text: "Я нервничаю", type: 'state' },
  { id: 13, text: "Я не нахожу себе места", type: 'state' },
  { id: 14, text: "Я взвинчен", type: 'state' },
  { id: 15, text: "Я не чувствую скованности, напряжения", type: 'state', reverse: true },
  { id: 16, text: "Я доволен", type: 'state', reverse: true },
  { id: 17, text: "Я озабочен", type: 'state' },
  { id: 18, text: "Я слишком возбужден и мне не по себе", type: 'state' },
  { id: 19, text: "Мне радостно", type: 'state', reverse: true },
  { id: 20, text: "Мне приятно", type: 'state', reverse: true },

  // Trait Anxiety (как вы обычно себя чувствуете)
  { id: 21, text: "У меня бывает приподнятое настроение", type: 'trait', reverse: true },
  { id: 22, text: "Я бываю раздражительным", type: 'trait' },
  { id: 23, text: "Я легко расстраиваюсь", type: 'trait' },
  { id: 24, text: "Я хотел бы быть таким же удачливым, как и другие", type: 'trait' },
  { id: 25, text: "Я сильно переживаю неприятности и долго не могу о них забыть", type: 'trait' },
  { id: 26, text: "Я чувствую прилив сил, желание работать", type: 'trait', reverse: true },
  { id: 27, text: "Я спокоен, хладнокровен и собран", type: 'trait', reverse: true },
  { id: 28, text: "Меня тревожат возможные трудности", type: 'trait' },
  { id: 29, text: "Я слишком переживаю из-за пустяков", type: 'trait' },
  { id: 30, text: "Я бываю вполне счастлив", type: 'trait', reverse: true },
  { id: 31, text: "Я принимаю все слишком близко к сердцу", type: 'trait' },
  { id: 32, text: "Мне не хватает уверенности в себе", type: 'trait' },
  { id: 33, text: "Я чувствую себя беззащитным", type: 'trait' },
  { id: 34, text: "Я стараюсь избегать критических ситуаций и трудностей", type: 'trait' },
  { id: 35, text: "У меня бывает хандра", type: 'trait' },
  { id: 36, text: "Я бываю доволен", type: 'trait', reverse: true },
  { id: 37, text: "Всякие пустяки отвлекают и волнуют меня", type: 'trait' },
  { id: 38, text: "Бывает, что я чувствую себя неудачником", type: 'trait' },
  { id: 39, text: "Я уравновешенный человек", type: 'trait', reverse: true },
  { id: 40, text: "Меня охватывает беспокойство, когда я думаю о своих делах и заботах", type: 'trait' }
];

const answerOptions = [
  { value: 1, label: "Нет, это совсем не так" },
  { value: 2, label: "Пожалуй, так" },
  { value: 3, label: "Верно" },
  { value: 4, label: "Совершенно верно" }
];

export function STAITest({ onComplete, onBack }: STAITestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [stateScore, setStateScore] = useState(0);
  const [traitScore, setTraitScore] = useState(0);

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
    let stateTotal = 0;
    let traitTotal = 0;
    
    questions.forEach((question, index) => {
      const answer = answers[index] || 1;
      const score = question.reverse ? (5 - answer) : answer;
      
      if (question.type === 'state') {
        stateTotal += score;
      } else {
        traitTotal += score;
      }
    });

    setStateScore(stateTotal);
    setTraitScore(traitTotal);
    setIsCompleted(true);
    
    setTimeout(() => {
      toast.success('Результаты STAI отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score <= 30) return { level: 'Низкая', color: 'text-green-600' };
    if (score <= 45) return { level: 'Умеренная', color: 'text-yellow-600' };
    return { level: 'Высокая', color: 'text-red-600' };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentPart = currentQuestion < 20 ? 'state' : 'trait';

  if (isCompleted) {
    const stateSeverity = getSeverity(stateScore);
    const traitSeverity = getSeverity(traitScore);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Тест STAI завершен</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{stateScore}</div>
                  <div className="text-lg text-gray-600 mb-1">Ситуативная тревожность</div>
                  <div className={`font-semibold ${stateSeverity.color}`}>
                    {stateSeverity.level}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{traitScore}</div>
                  <div className="text-lg text-gray-600 mb-1">Личностная тревожность</div>
                  <div className={`font-semibold ${traitSeverity.color}`}>
                    {traitSeverity.level}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Интерпретация результатов:</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <strong>Ситуативная тревожность ({stateScore} баллов):</strong> 
                    {stateScore <= 30 && " Низкий уровень тревожности в данный момент. Вы чувствуете себя спокойно и расслабленно."}
                    {stateScore > 30 && stateScore <= 45 && " Умеренный уровень ситуативной тревожности. Некоторое беспокойство по поводу текущей ситуации."}
                    {stateScore > 45 && " Высокий уровень ситуативной тревожности. Выраженное беспокойство и напряжение в данный момент."}
                  </div>
                  <div>
                    <strong>Личностная тревожность ({traitScore} баллов):</strong>
                    {traitScore <= 30 && " Низкий уровень личностной тревожности. Вы обычно спокойны и уравновешены."}
                    {traitScore > 30 && traitScore <= 45 && " Умеренный уровень личностной тревожности. Склонность к беспокойству в стрессовых ситуациях."}
                    {traitScore > 45 && " Высокий уровень личностной тревожности. Склонность воспринимать многие ситуации как угрожающие."}
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ИИ-анализ тревожности:</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {stateScore > traitScore + 10 && (
                    <p className="text-orange-700">Ситуативная тревожность значительно превышает личностную, что указывает на острую реакцию на текущую стрессовую ситуацию.</p>
                  )}
                  {traitScore > stateScore + 10 && (
                    <p className="text-blue-700">Личностная тревожность выше ситуативной, что характерно для людей с устойчивой склонностью к тревожным реакциям.</p>
                  )}
                  {Math.abs(stateScore - traitScore) <= 10 && (
                    <p>Ситуативная и личностная тревожность находятся на схожем уровне, что указывает на сбалансированное эмоциональное состояние.</p>
                  )}
                  
                  {(stateScore > 45 || traitScore > 45) && (
                    <p className="text-red-700 mt-2">Высокие показатели тревожности могут влиять на качество жизни и требуют внимания специалиста.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Рекомендации:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты переданы вашему лечащему врачу</li>
                  {(stateScore <= 30 && traitScore <= 30) && (
                    <>
                      <li>• Поддерживайте здоровый образ жизни</li>
                      <li>• Продолжайте использовать эффективные стратегии совладания</li>
                    </>
                  )}
                  {(stateScore > 30 && stateScore <= 45) && (
                    <>
                      <li>• Изучите техники управления стрессом</li>
                      <li>• Практикуйте дыхательные упражнения</li>
                    </>
                  )}
                  {(traitScore > 30 && traitScore <= 45) && (
                    <>
                      <li>• Рассмотрите когнитивно-поведенческую терапию</li>
                      <li>• Развивайте навыки эмоциональной саморегуляции</li>
                    </>
                  )}
                  {(stateScore > 45 || traitScore > 45) && (
                    <>
                      <li>• Обратитесь к специалисту по психическому здоровью</li>
                      <li>• Рассмотрите возможность медикаментозной поддержки</li>
                      <li>• Избегайте дополнительных стрессовых факторов</li>
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
          <div className="text-sm text-gray-600 mt-2">
            Прогресс: {Math.round(progress)}% • 
            {currentPart === 'state' ? 'Часть 1: Ситуативная тревожность' : 'Часть 2: Личностная тревожность'}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>STAI - Шкала тревожности Спилбергера</CardTitle>
            <div className="text-sm text-gray-600">
              {currentPart === 'state' 
                ? "Как вы чувствуете себя в данный момент, сейчас?"
                : "Как вы обычно себя чувствуете?"
              }
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {questions[currentQuestion].text}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    currentPart === 'state' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {currentPart === 'state' ? 'Сейчас' : 'Обычно'}
                  </div>
                </div>
              </div>
              
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

        {currentQuestion === 19 && (
          <Card className="mt-4 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-blue-900 mb-2">Переход ко второй части</h3>
                <p className="text-sm text-blue-700">
                  Следующие вопросы касаются того, как вы обычно себя чувствуете в повседневной жизни
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}