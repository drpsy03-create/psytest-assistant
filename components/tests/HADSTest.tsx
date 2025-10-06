import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, Heart, Brain } from 'lucide-react';

interface HADSTestProps {
  onComplete: (result: HADSResult) => void;
  onBack: () => void;
}

export interface HADSResult {
  testId: 'hads';
  responses: number[];
  anxietyScore: number;
  depressionScore: number;
  totalScore: number;
  anxietySeverity: 'normal' | 'mild' | 'moderate' | 'severe';
  depressionSeverity: 'normal' | 'mild' | 'moderate' | 'severe';
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  completedAt: Date;
  recommendations: string[];
}

const questions = [
  {
    id: 1,
    text: "Я чувствую напряжение, мне не по себе",
    subscale: 'anxiety',
    options: [
      "Совсем не чувствую",
      "Иногда чувствую", 
      "Часто чувствую",
      "Почти все время чувствую"
    ]
  },
  {
    id: 2,
    text: "То, что раньше приносило мне удовольствие, и сейчас вызывает такие же чувства",
    subscale: 'depression',
    reversed: true,
    options: [
      "Определенно, это так",
      "Наверное, это так",
      "Лишь в очень малой степени это так",
      "Это совсем не так"
    ]
  },
  {
    id: 3,
    text: "Меня охватывает внезапное чувство паники",
    subscale: 'anxiety',
    options: [
      "Совсем не охватывает",
      "Иногда охватывает",
      "Довольно часто охватывает",
      "Очень часто охватывает"
    ]
  },
  {
    id: 4,
    text: "Я способен рассмеяться и увидеть в том или ином событии смешное",
    subscale: 'depression',
    reversed: true,
    options: [
      "Определенно способен",
      "Наверное, способен",
      "Определенно не способен",
      "Совсем не способен"
    ]
  },
  {
    id: 5,
    text: "Беспокойные мысли крутятся у меня в голове",
    subscale: 'anxiety',
    options: [
      "Только изредка",
      "От времени к времени",
      "Довольно часто",
      "Очень часто"
    ]
  },
  {
    id: 6,
    text: "Я испытываю бодрость",
    subscale: 'depression',
    reversed: true,
    options: [
      "Все время",
      "Обычно",
      "Иногда",
      "Совсем не испытываю"
    ]
  },
  {
    id: 7,
    text: "Я легко могу сесть и расслабиться",
    subscale: 'anxiety',
    reversed: true,
    options: [
      "Определенно могу",
      "Наверное, могу",
      "Лишь изредка могу",
      "Совсем не могу"
    ]
  },
  {
    id: 8,
    text: "Мне кажется, что я стал все делать очень медленно",
    subscale: 'depression',
    options: [
      "Совсем не кажется",
      "Иногда кажется",
      "Часто кажется",
      "Практически все время кажется"
    ]
  },
  {
    id: 9,
    text: "Я испытываю внутреннее напряжение или дрожь",
    subscale: 'anxiety',
    options: [
      "Совсем не испытываю",
      "Иногда испытываю",
      "Часто испытываю",
      "Очень часто испытываю"
    ]
  },
  {
    id: 10,
    text: "Я не слежу за своей внешностью",
    subscale: 'depression',
    options: [
      "Слежу не хуже, чем обычно",
      "Не уделяю этому столько времени, сколько нужно",
      "Стал меньше уделять этому времени",
      "Совсем не слежу"
    ]
  },
  {
    id: 11,
    text: "Я не могу усидеть на месте, так как испытываю беспокойство",
    subscale: 'anxiety',
    options: [
      "Совсем не испытываю",
      "Испытываю в незначительной степени",
      "Определенно испытываю",
      "Испытываю в очень сильной степени"
    ]
  },
  {
    id: 12,
    text: "Я считаю, что мои дела (занятия, увлечения) могут принести мне чувство удовлетворения",
    subscale: 'depression',
    reversed: true,
    options: [
      "Точно так же, как и обычно",
      "Да, но не в той степени, как раньше",
      "Значительно меньше, чем обычно",
      "Совсем так не считаю"
    ]
  },
  {
    id: 13,
    text: "У меня бывает внезапное чувство страха",
    subscale: 'anxiety',
    options: [
      "Совсем не бывает",
      "Иногда бывает",
      "Довольно часто бывает",
      "Очень часто бывает"
    ]
  },
  {
    id: 14,
    text: "Я могу получить удовольствие от хорошей книги, радио- или телепрограммы",
    subscale: 'depression',
    reversed: true,
    options: [
      "Часто получаю",
      "Иногда получаю",
      "Редко получаю",
      "Очень редко получаю"
    ]
  }
];

export function HADSTest({ onComplete, onBack }: HADSTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = answerIndex;
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newResponses);
    }
  };

  const calculateResults = (responses: number[]) => {
    let anxietyScore = 0;
    let depressionScore = 0;

    questions.forEach((question, index) => {
      const response = responses[index];
      const score = question.reversed ? (3 - response) : response;
      
      if (question.subscale === 'anxiety') {
        anxietyScore += score;
      } else {
        depressionScore += score;
      }
    });

    const totalScore = anxietyScore + depressionScore;

    // Определяем тяжесть тревоги
    let anxietySeverity: 'normal' | 'mild' | 'moderate' | 'severe';
    if (anxietyScore <= 7) anxietySeverity = 'normal';
    else if (anxietyScore <= 10) anxietySeverity = 'mild';
    else if (anxietyScore <= 14) anxietySeverity = 'moderate';
    else anxietySeverity = 'severe';

    // Определяем тяжесть депрессии
    let depressionSeverity: 'normal' | 'mild' | 'moderate' | 'severe';
    if (depressionScore <= 7) depressionSeverity = 'normal';
    else if (depressionScore <= 10) depressionSeverity = 'mild';
    else if (depressionScore <= 14) depressionSeverity = 'moderate';
    else depressionSeverity = 'severe';

    // Общая тяжесть (берем максимальную)
    const severity = anxietySeverity === 'severe' || depressionSeverity === 'severe' ? 'severe' :
                     anxietySeverity === 'moderate' || depressionSeverity === 'moderate' ? 'moderate' :
                     anxietySeverity === 'mild' || depressionSeverity === 'mild' ? 'mild' : 'normal';

    const recommendations = generateRecommendations(anxietySeverity, depressionSeverity, anxietyScore, depressionScore);

    const result: HADSResult = {
      testId: 'hads',
      responses,
      anxietyScore,
      depressionScore,
      totalScore,
      anxietySeverity,
      depressionSeverity,
      severity,
      completedAt: new Date(),
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const generateRecommendations = (
    anxietySeverity: string, 
    depressionSeverity: string, 
    anxietyScore: number, 
    depressionScore: number
  ): string[] => {
    const recommendations = [];

    if (anxietySeverity === 'severe' && depressionSeverity === 'severe') {
      recommendations.push('Комбинированное тревожно-депрессивное расстройство требует комплексного лечения');
      recommendations.push('Рекомендуется психофармакотерапия и психотерапия');
      recommendations.push('Необходимо регулярное наблюдение специалиста');
    } else if (anxietySeverity === 'severe') {
      recommendations.push('Выраженное тревожное расстройство требует специализированного лечения');
      recommendations.push('Рассмотрите когнитивно-поведенческую терапию');
      recommendations.push('Возможна необходимость в анксиолитической терапии');
    } else if (depressionSeverity === 'severe') {
      recommendations.push('Тяжелая депрессия требует немедленного вмешательства');
      recommendations.push('Необходима консультация психиатра');
      recommendations.push('Рекомендуется антидепрессивная терапия');
    }

    if (anxietyScore > depressionScore + 3) {
      recommendations.push('Тревожный компонент преобладает над депрессивным');
      recommendations.push('Фокус на методах управления тревогой');
    } else if (depressionScore > anxietyScore + 3) {
      recommendations.push('Депрессивный компонент преобладает над тревожным');
      recommendations.push('Активация поведения и работа с настроением в приоритете');
    } else {
      recommendations.push('Смешанное тревожно-депрессивное состояние');
      recommendations.push('Комплексный подход к лечению');
    }

    return recommendations;
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-blue-600" />
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <span>Шкала тревоги и депрессии (HADS) - Результаты</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Тревога</h3>
                <div className="text-2xl font-bold text-orange-700">{responses.reduce((sum, val, idx) => {
                  const q = questions[idx];
                  if (q.subscale !== 'anxiety') return sum;
                  return sum + (q.reversed ? (3 - val) : val);
                }, 0)} баллов</div>
                <div className="text-sm text-orange-600 mt-1">
                  {responses.reduce((sum, val, idx) => {
                    const q = questions[idx];
                    if (q.subscale !== 'anxiety') return sum;
                    return sum + (q.reversed ? (3 - val) : val);
                  }, 0) <= 7 ? 'Норма' :
                   responses.reduce((sum, val, idx) => {
                     const q = questions[idx];
                     if (q.subscale !== 'anxiety') return sum;
                     return sum + (q.reversed ? (3 - val) : val);
                   }, 0) <= 10 ? 'Легкая тревога' :
                   responses.reduce((sum, val, idx) => {
                     const q = questions[idx];
                     if (q.subscale !== 'anxiety') return sum;
                     return sum + (q.reversed ? (3 - val) : val);
                   }, 0) <= 14 ? 'Умеренная тревога' : 'Выраженная тревога'}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Депрессия</h3>
                <div className="text-2xl font-bold text-blue-700">{responses.reduce((sum, val, idx) => {
                  const q = questions[idx];
                  if (q.subscale !== 'depression') return sum;
                  return sum + (q.reversed ? (3 - val) : val);
                }, 0)} баллов</div>
                <div className="text-sm text-blue-600 mt-1">
                  {responses.reduce((sum, val, idx) => {
                    const q = questions[idx];
                    if (q.subscale !== 'depression') return sum;
                    return sum + (q.reversed ? (3 - val) : val);
                  }, 0) <= 7 ? 'Норма' :
                   responses.reduce((sum, val, idx) => {
                     const q = questions[idx];
                     if (q.subscale !== 'depression') return sum;
                     return sum + (q.reversed ? (3 - val) : val);
                   }, 0) <= 10 ? 'Легкая депрессия' :
                   responses.reduce((sum, val, idx) => {
                     const q = questions[idx];
                     if (q.subscale !== 'depression') return sum;
                     return sum + (q.reversed ? (3 - val) : val);
                   }, 0) <= 14 ? 'Умеренная депрессия' : 'Выраженная депрессия'}
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                HADS помогает дифференцировать тревожные и депрессивные симптомы для более точной диагностики
              </p>
              <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white">
                Продолжить тестирование
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-blue-600" />
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <span>Шкала тревоги и депрессии (HADS)</span>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} из {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Подшкала:</strong> {currentQuestionData.subscale === 'anxiety' ? 'Тревога' : 'Депрессия'}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6 text-gray-900">
              {currentQuestionData.text}
            </h3>

            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-4 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index}</span>
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Дифференциальная диагностика тревоги и депрессии
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}