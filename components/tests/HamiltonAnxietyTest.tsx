import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface HamiltonAnxietyTestProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  title: string;
  description: string;
  category: 'psychic' | 'somatic';
}

const questions: Question[] = [
  {
    id: 1,
    title: "Тревожное настроение",
    description: "Беспокойство, ожидание худшего, тревожные опасения, раздражительность",
    category: 'psychic'
  },
  {
    id: 2,
    title: "Напряженность",
    description: "Ощущения напряженности, утомляемость, вздрагивание, легко возникающие слезы, дрожание, чувство беспокойства, неспособность расслабиться",
    category: 'psychic'
  },
  {
    id: 3,
    title: "Страхи",
    description: "Темноты, незнакомых людей, одиночества, животных, транспорта, толпы",
    category: 'psychic'
  },
  {
    id: 4,
    title: "Инсомния",
    description: "Затруднения при засыпании, прерывистый сон, неудовлетворенность сном и чувство разбитости при пробуждении, кошмары, ночные терроры",
    category: 'psychic'
  },
  {
    id: 5,
    title: "Интеллектуальные нарушения",
    description: "Снижение способности к концентрации, ухудшение памяти",
    category: 'psychic'
  },
  {
    id: 6,
    title: "Депрессивное настроение",
    description: "Утрата интересов, снижение удовольствия от хобби, депрессия, раннее пробуждение, суточные колебания настроения",
    category: 'psychic'
  },
  {
    id: 7,
    title: "Соматические мышечные симптомы",
    description: "Боли и ломота в мышцах, мышечная ригидность, миоклонические подергивания, скрежетание зубами, неустойчивость голоса",
    category: 'somatic'
  },
  {
    id: 8,
    title: "Соматические сенсорные симптомы",
    description: "Звон в ушах, нечеткость зрения, приливы жара и холода, ощущение слабости, покалывания",
    category: 'somatic'
  },
  {
    id: 9,
    title: "Сердечно-сосудистые симптомы",
    description: "Тахикардия, сердцебиение, боли в груди, пульсация в сосудах, частые вздохи, одышка",
    category: 'somatic'
  },
  {
    id: 10,
    title: "Респираторные симптомы",
    description: "Ощущения сдавления или сжатия в груди, чувство удушья, частые вздохи, одышка",
    category: 'somatic'
  },
  {
    id: 11,
    title: "Гастроинтестинальные симптомы",
    description: "Затруднения при глотании, метеоризм, боли в животе, изжога, чувство переполнения, тошнота, рвота, урчание в животе, диарея, запоры, похудание",
    category: 'somatic'
  },
  {
    id: 12,
    title: "Мочеполовые симптомы",
    description: "Учащенное мочеиспускание, сильные позывы на мочеиспускание, аменорея, менорагия, фригидность, преждевременная эякуляция, утрата либидо, импотенция",
    category: 'somatic'
  },
  {
    id: 13,
    title: "Вегетативные симптомы",
    description: "Сухость во рту, покраснение или бледность кожных покровов, потливость, головные боли, подъем волос",
    category: 'somatic'
  },
  {
    id: 14,
    title: "Поведение при осмотре",
    description: "Ерзание, беспокойство или ажитация, дрожание рук, нахмуренность, напряженное лицо, вздохи или учащенное дыхание, бледность лица, сглатывание и др.",
    category: 'somatic'
  }
];

const answerOptions = [
  { value: 0, label: "Отсутствует" },
  { value: 1, label: "Слабая выраженность" },
  { value: 2, label: "Умеренная выраженность" },
  { value: 3, label: "Сильная выраженность" },
  { value: 4, label: "Максимальная выраженность" }
];

export function HamiltonAnxietyTest({ onComplete, onBack }: HamiltonAnxietyTestProps) {
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
    
    setTimeout(() => {
      toast.success('Результаты шкалы тревоги Гамильтона отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score < 17) return { level: 'Легкая тревожность', color: 'text-green-600', description: 'Тревожность в пределах нормы или легкая' };
    if (score < 25) return { level: 'Умеренная тревожность', color: 'text-yellow-600', description: 'Умеренная тревожность' };
    if (score < 30) return { level: 'Выраженная тревожность', color: 'text-orange-600', description: 'Выраженная тревожность' };
    return { level: 'Очень сильная тревожность', color: 'text-red-600', description: 'Очень сильная тревожность' };
  };

  const getScoreBreakdown = () => {
    const psychicQuestions = questions.filter(q => q.category === 'psychic');
    const somaticQuestions = questions.filter(q => q.category === 'somatic');
    
    let psychicScore = 0;
    let somaticScore = 0;
    
    psychicQuestions.forEach((q, index) => {
      psychicScore += answers[index] || 0;
    });
    
    somaticQuestions.forEach((q, index) => {
      const questionIndex = psychicQuestions.length + index;
      somaticScore += answers[questionIndex] || 0;
    });
    
    return { psychicScore, somaticScore };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    const severity = getSeverity(score);
    const { psychicScore, somaticScore } = getScoreBreakdown();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Шкала тревоги Гамильтона завершена</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}</div>
                <div className="text-lg text-gray-600">баллов из 56 возможных</div>
                <div className={`text-xl font-semibold mt-2 ${severity.color}`}>
                  {severity.level}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{psychicScore}</div>
                  <div className="text-sm text-gray-600">Психические симптомы</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{somaticScore}</div>
                  <div className="text-sm text-gray-600">Соматические симптомы</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Клиническая интерпретация:</h3>
                <p className="text-sm text-gray-700">{severity.description}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ИИ-анализ тревожных симптомов:</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {score < 17 && (
                    <div>
                      <p>Результаты указывают на легкую тревожность в пределах нормы. Психические и соматические проявления тревоги минимальны.</p>
                      {psychicScore > somaticScore && (
                        <p className="mt-2 text-blue-700">Преобладают психические симптомы тревоги (беспокойство, напряженность, страхи).</p>
                      )}
                      {somaticScore > psychicScore && (
                        <p className="mt-2 text-green-700">Преобладают соматические проявления тревоги (физические симптомы).</p>
                      )}
                    </div>
                  )}
                  {score >= 17 && score < 25 && (
                    <div>
                      <p>Умеренная тревожность с заметным влиянием на повседневное функционирование. Рекомендуется психотерапевтическое вмешательство.</p>
                      {psychicScore > somaticScore && (
                        <p className="mt-2 text-blue-700">Выражены психические симптомы: беспокойство, напряженность, нарушения сна и концентрации.</p>
                      )}
                      {somaticScore > psychicScore && (
                        <p className="mt-2 text-green-700">Преобладают соматические симптомы: мышечное напряжение, сердцебиение, вегетативные нарушения.</p>
                      )}
                    </div>
                  )}
                  {score >= 25 && score < 30 && (
                    <div>
                      <p>Выраженная тревожность, значительно нарушающая качество жизни. Необходимо медикаментозное лечение в сочетании с психотерапией.</p>
                      <p className="mt-2">Анализ показывает распространенность тревожных симптомов на множественные сферы жизнедеятельности.</p>
                    </div>
                  )}
                  {score >= 30 && (
                    <div>
                      <p>Очень сильная тревожность с тяжелыми психическими и соматическими проявлениями. Требуется неотложное медицинское вмешательство.</p>
                      <p className="mt-2 text-red-700">Высокий риск развития панических атак и других тревожных расстройств.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Терапевтические рекомендации:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты переданы лечащему врачу для клинической оценки</li>
                  {score < 17 && (
                    <>
                      <li>• Техники релаксации и управления стрессом</li>
                      <li>• Регулярные физические упражнения</li>
                      <li>• Поддержание здорового режима сна</li>
                    </>
                  )}
                  {score >= 17 && score < 25 && (
                    <>
                      <li>• Когнитивно-поведенческая терапия</li>
                      <li>• Техники дыхательной релаксации</li>
                      <li>• Постепенная экспозиционная терапия при наличии фобий</li>
                    </>
                  )}
                  {score >= 25 && score < 30 && (
                    <>
                      <li>• Консультация врача-психиатра</li>
                      <li>• Анксиолитическая терапия</li>
                      <li>• Структурированная психотерапия</li>
                    </>
                  )}
                  {score >= 30 && (
                    <>
                      <li>• Неотложная консультация психиатра</li>
                      <li>• Комплексная медикаментозная терапия</li>
                      <li>• Возможна госпитализация для стабилизации состояния</li>
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
            <CardTitle>Шкала тревоги Гамильтона (HAM-A)</CardTitle>
            <div className="text-sm text-gray-600">
              Оцените выраженность каждого симптома за последнюю неделю
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{questions[currentQuestion].title}</h3>
                  <div className={`px-2 py-1 rounded text-xs ${
                    questions[currentQuestion].category === 'psychic' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {questions[currentQuestion].category === 'psychic' ? 'Психические' : 'Соматические'}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{questions[currentQuestion].description}</p>
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
                      <span className="font-medium">[{option.value} балл{option.value === 1 ? '' : option.value < 5 ? 'а' : 'ов'}]</span> {option.label}
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
      </div>
    </div>
  );
}