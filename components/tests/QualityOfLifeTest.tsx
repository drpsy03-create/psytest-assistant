import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QualityOfLifeTestProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  text: string;
  domain: 'physical' | 'psychological' | 'social' | 'environment';
}

const questions: Question[] = [
  { id: 1, text: "Как бы Вы оценили качество своей жизни?", domain: 'psychological' },
  { id: 2, text: "Насколько Вы удовлетворены состоянием своего здоровья?", domain: 'physical' },
  { id: 3, text: "В какой степени физическая боль мешает Вам заниматься необходимыми делами?", domain: 'physical' },
  { id: 4, text: "Насколько Вы нуждаетесь в медицинской помощи для ведения повседневной жизни?", domain: 'physical' },
  { id: 5, text: "Насколько Вы получаете удовольствие от жизни?", domain: 'psychological' },
  { id: 6, text: "В какой степени Ваша жизнь кажется Вам осмысленной?", domain: 'psychological' },
  { id: 7, text: "Насколько хорошо Вы можете концентрировать внимание?", domain: 'psychological' },
  { id: 8, text: "В какой степени Вы чувствуете себя в безопасности в повседневной жизни?", domain: 'environment' },
  { id: 9, text: "Насколько здорова окружающая Вас среда?", domain: 'environment' },
  { id: 10, text: "Хватает ли Вам энергии для повседневной жизни?", domain: 'physical' },
  { id: 11, text: "Способны ли Вы принять свой внешний вид?", domain: 'psychological' },
  { id: 12, text: "Имеете ли Вы достаточно денег для удовлетворения своих потребностей?", domain: 'environment' },
  { id: 13, text: "Доступна ли Вам необходимая информация для повседневной жизни?", domain: 'environment' },
  { id: 14, text: "Имеете ли Вы возможности для проведения досуга?", domain: 'environment' },
  { id: 15, text: "Насколько хорошо Вы способны передвигаться?", domain: 'physical' },
  { id: 16, text: "Насколько Вы удовлетворены своим сном?", domain: 'physical' },
  { id: 17, text: "Насколько Вы удовлетворены своей способностью выполнять повседневные дела?", domain: 'physical' },
  { id: 18, text: "Насколько Вы удовлетворены своей работоспособностью?", domain: 'physical' },
  { id: 19, text: "Удовлетворены ли Вы собой?", domain: 'psychological' },
  { id: 20, text: "Удовлетворены ли Вы своими личными отношениями?", domain: 'social' },
  { id: 21, text: "Удовлетворены ли Вы своей половой жизнью?", domain: 'social' },
  { id: 22, text: "Удовлетворены ли Вы поддержкой, которую получаете от друзей?", domain: 'social' },
  { id: 23, text: "Удовлетворены ли Вы условиями того места, где живете?", domain: 'environment' },
  { id: 24, text: "Удовлетворены ли Вы своими возможностями получать медицинскую помощь?", domain: 'environment' },
  { id: 25, text: "Удовлетворены ли Вы средствами передвижения, которыми пользуетесь?", domain: 'environment' },
  { id: 26, text: "Как часто у Вас бывают отрицательные чувства, такие как отчаяние, тревога, депрессия?", domain: 'psychological' }
];

const answerOptions = [
  { value: 1, label: "Очень плохо / Совсем не удовлетворен / Никогда" },
  { value: 2, label: "Плохо / Не удовлетворен / Редко" },
  { value: 3, label: "Ни плохо, ни хорошо / Частично удовлетворен / Иногда" },
  { value: 4, label: "Хорошо / Удовлетворен / Часто" },
  { value: 5, label: "Очень хорошо / Очень удовлетворен / Всегда" }
];

export function QualityOfLifeTest({ onComplete, onBack }: QualityOfLifeTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [scores, setScores] = useState({ physical: 0, psychological: 0, social: 0, environment: 0, total: 0 });

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
    const domainScores = { physical: 0, psychological: 0, social: 0, environment: 0 };
    const domainCounts = { physical: 0, psychological: 0, social: 0, environment: 0 };
    
    questions.forEach((question, index) => {
      const answer = answers[index] || 1;
      let score = answer;
      
      // Для отрицательных вопросов инвертируем шкалу
      if (question.id === 3 || question.id === 4 || question.id === 26) {
        score = 6 - answer;
      }
      
      domainScores[question.domain] += score;
      domainCounts[question.domain]++;
    });

    // Преобразуем в 0-100 шкалу
    const finalScores = {
      physical: Math.round(((domainScores.physical / domainCounts.physical - 1) / 4) * 100),
      psychological: Math.round(((domainScores.psychological / domainCounts.psychological - 1) / 4) * 100),
      social: Math.round(((domainScores.social / domainCounts.social - 1) / 4) * 100),
      environment: Math.round(((domainScores.environment / domainCounts.environment - 1) / 4) * 100),
      total: 0
    };

    finalScores.total = Math.round((finalScores.physical + finalScores.psychological + finalScores.social + finalScores.environment) / 4);

    setScores(finalScores);
    setIsCompleted(true);
    
    setTimeout(() => {
      toast.success('Результаты опросника качества жизни отправлены вашему врачу');
    }, 1000);
  };

  const getSeverity = (score: number) => {
    if (score >= 80) return { level: 'Очень высокое', color: 'text-green-600' };
    if (score >= 60) return { level: 'Высокое', color: 'text-green-500' };
    if (score >= 40) return { level: 'Среднее', color: 'text-yellow-600' };
    if (score >= 20) return { level: 'Низкое', color: 'text-orange-600' };
    return { level: 'Очень низкое', color: 'text-red-600' };
  };

  const getDomainName = (domain: string) => {
    switch (domain) {
      case 'physical': return 'Физическое здоровье';
      case 'psychological': return 'Психологическое';
      case 'social': return 'Социальные отношения';
      case 'environment': return 'Окружающая среда';
      default: return domain;
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    const totalSeverity = getSeverity(scores.total);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Опросник качества жизни завершен</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{scores.total}</div>
                <div className="text-lg text-gray-600">баллов из 100</div>
                <div className={`text-xl font-semibold mt-2 ${totalSeverity.color}`}>
                  {totalSeverity.level} качество жизни
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(scores).filter(([key]) => key !== 'total').map(([domain, score]) => {
                  const severity = getSeverity(score);
                  return (
                    <div key={domain} className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold mb-1">{score}</div>
                      <div className="text-sm text-gray-600 mb-1">{getDomainName(domain)}</div>
                      <div className={`text-xs font-medium ${severity.color}`}>
                        {severity.level}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Общая оценка качества жизни:</h3>
                <p className="text-sm text-gray-700">
                  {scores.total >= 80 && "Ваше качество жизни находится на очень высоком уровне. Вы чувствуете себя хорошо во всех основных сферах жизни."}
                  {scores.total >= 60 && scores.total < 80 && "Ваше качество жизни находится на хорошем уровне. Большинство аспектов жизни вас удовлетворяют."}
                  {scores.total >= 40 && scores.total < 60 && "Ваше качество жизни находится на среднем уровне. Есть области, которые можно улучшить."}
                  {scores.total >= 20 && scores.total < 40 && "Ваше качество жизни снижено. Многие аспекты жизни вызывают неудовлетворенность."}
                  {scores.total < 20 && "Ваше качество жизни значительно снижено. Необходимо обратить внимание на улучшение различных сфер жизни."}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ИИ-анализ по доменам:</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {scores.physical < 40 && (
                    <p className="text-red-700">• <strong>Физическое здоровье:</strong> Низкие показатели могут указывать на проблемы со здоровьем, болью или ограничениями в повседневной активности.</p>
                  )}
                  {scores.psychological < 40 && (
                    <p className="text-orange-700">• <strong>Психологическое благополучие:</strong> Сниженное настроение, тревожность или проблемы с самооценкой могут влиять на общее качество жизни.</p>
                  )}
                  {scores.social < 40 && (
                    <p className="text-blue-700">• <strong>Социальные отношения:</strong> Недостаток поддержки или неудовлетворенность отношениями могут негативно влиять на психическое здоровье.</p>
                  )}
                  {scores.environment < 40 && (
                    <p className="text-green-700">• <strong>Окружающая среда:</strong> Неблагоприятные условия жизни, работы или недоступность ресурсов снижают качество жизни.</p>
                  )}

                  {Math.max(scores.physical, scores.psychological, scores.social, scores.environment) - Math.min(scores.physical, scores.psychological, scores.social, scores.environment) > 30 && (
                    <p className="text-indigo-700 mt-2">Отмечается значительная разница между доменами качества жизни, что указывает на необходимость целенаправленной работы с проблемными областями.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Рекомендации по улучшению качества жизни:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Результаты переданы вашему лечащему врачу для комплексной оценки</li>
                  {scores.physical < 60 && (
                    <>
                      <li>• Консультация врача для оценки физического здоровья</li>
                      <li>• Регулярная физическая активность в соответствии с возможностями</li>
                    </>
                  )}
                  {scores.psychological < 60 && (
                    <>
                      <li>• Рассмотрите психологическую поддержку или консультирование</li>
                      <li>• Практикуйте техники управления стрессом и релаксации</li>
                    </>
                  )}
                  {scores.social < 60 && (
                    <>
                      <li>• Активизируйте социальные контакты и отношения</li>
                      <li>• Участвуйте в групповых активностях или сообществах</li>
                    </>
                  )}
                  {scores.environment < 60 && (
                    <>
                      <li>• Оцените возможности улучшения условий жизни</li>
                      <li>• Изучите доступные ресурсы и социальные услуги</li>
                    </>
                  )}
                  {scores.total >= 60 && (
                    <li>• Продолжайте поддерживать факторы, способствующие хорошему качеству жизни</li>
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
            <CardTitle>Опросник качества жизни (WHOQOL-BREF)</CardTitle>
            <div className="text-sm text-gray-600">
              Следующие вопросы касаются того, как вы себя чувствовали в течение последних двух недель
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
                    questions[currentQuestion].domain === 'physical' ? 'bg-blue-100 text-blue-800' :
                    questions[currentQuestion].domain === 'psychological' ? 'bg-purple-100 text-purple-800' :
                    questions[currentQuestion].domain === 'social' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {getDomainName(questions[currentQuestion].domain)}
                  </div>
                </div>
              </div>
              
              <RadioGroup 
                value={answers[currentQuestion]?.toString() || ""} 
                onValueChange={handleAnswer}
              >
                {answerOptions.map((option) => (
                  <div key={option.value} className="flex items-start space-x-2 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="mt-1" />
                    <Label 
                      htmlFor={`option-${option.value}`} 
                      className="cursor-pointer flex-1 text-sm leading-relaxed"
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
      </div>
    </div>
  );
}