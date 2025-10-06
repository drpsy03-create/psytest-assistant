import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, Shield, Lightbulb, Users, Target } from 'lucide-react';

interface CopingStrategiesTestProps {
  onComplete: (result: CopingStrategiesResult) => void;
  onBack: () => void;
}

export interface CopingStrategiesResult {
  testId: 'coping-strategies';
  responses: number[];
  problemFocusedScore: number;
  emotionFocusedScore: number;
  avoidanceScore: number;
  socialSupportScore: number;
  totalScore: number;
  dominantStrategy: 'problem-focused' | 'emotion-focused' | 'avoidance' | 'social-support';
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  completedAt: Date;
  recommendations: string[];
}

const questions = [
  {
    id: 1,
    text: "Когда у меня возникает проблема, я концентрируюсь на том, что нужно сделать для её решения",
    strategy: 'problem-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это", 
      "Часто делаю это"
    ]
  },
  {
    id: 2,
    text: "Я стараюсь справиться со своими чувствами и продолжать жить",
    strategy: 'emotion-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 3,
    text: "Я избегаю людей в целом",
    strategy: 'avoidance',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это", 
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 4,
    text: "Я ищу эмоциональную поддержку у друзей или родственников",
    strategy: 'social-support',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это", 
      "Часто делаю это"
    ]
  },
  {
    id: 5,
    text: "Я предпринимаю конкретные действия, чтобы попытаться улучшить ситуацию",
    strategy: 'problem-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 6,
    text: "Я говорю себе: 'Это не настоящее' или 'Это нереально'",
    strategy: 'emotion-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 7,
    text: "Я отказываюсь верить, что это произошло",
    strategy: 'avoidance',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 8,
    text: "Я обсуждаю свои чувства с кем-то",
    strategy: 'social-support',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 9,
    text: "Я пытаюсь придумать стратегию того, что делать",
    strategy: 'problem-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 10,
    text: "Я стараюсь контролировать свои эмоции",
    strategy: 'emotion-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 11,
    text: "Я сплю больше обычного",
    strategy: 'avoidance',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 12,
    text: "Я получаю утешение и понимание от кого-то",
    strategy: 'social-support',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 13,
    text: "Я стараюсь увидеть ситуацию в более позитивном свете",
    strategy: 'emotion-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 14,
    text: "Я принимаю реальность происходящего",
    strategy: 'problem-focused',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 15,
    text: "Я использую алкоголь или лекарства, чтобы почувствовать себя лучше",
    strategy: 'avoidance',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  },
  {
    id: 16,
    text: "Я получаю совет или помощь от других людей",
    strategy: 'social-support',
    options: [
      "Никогда не делаю этого",
      "Редко делаю это",
      "Иногда делаю это",
      "Часто делаю это"
    ]
  }
];

const strategyIcons = {
  'problem-focused': Target,
  'emotion-focused': Lightbulb,
  'avoidance': Shield,
  'social-support': Users
};

const strategyNames = {
  'problem-focused': 'Решение проблем',
  'emotion-focused': 'Эмоциональная регуляция',
  'avoidance': 'Избегание',
  'social-support': 'Социальная поддержка'
};

export function CopingStrategiesTest({ onComplete, onBack }: CopingStrategiesTestProps) {
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
    let problemFocusedScore = 0;
    let emotionFocusedScore = 0;
    let avoidanceScore = 0;
    let socialSupportScore = 0;

    questions.forEach((question, index) => {
      const score = responses[index];
      
      switch (question.strategy) {
        case 'problem-focused':
          problemFocusedScore += score;
          break;
        case 'emotion-focused':
          emotionFocusedScore += score;
          break;
        case 'avoidance':
          avoidanceScore += score;
          break;
        case 'social-support':
          socialSupportScore += score;
          break;
      }
    });

    const totalScore = problemFocusedScore + emotionFocusedScore + avoidanceScore + socialSupportScore;

    // Определяем доминирующую стратегию
    const scores = {
      'problem-focused': problemFocusedScore,
      'emotion-focused': emotionFocusedScore,
      'avoidance': avoidanceScore,
      'social-support': socialSupportScore
    };
    
    const dominantStrategy = Object.keys(scores).reduce((a, b) => 
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    ) as 'problem-focused' | 'emotion-focused' | 'avoidance' | 'social-support';

    // Определяем общую эффективность копинга
    const adaptiveScore = problemFocusedScore + emotionFocusedScore + socialSupportScore;
    const maladaptiveScore = avoidanceScore;
    
    const severity = maladaptiveScore > adaptiveScore ? 'severe' :
                     adaptiveScore < 24 ? 'moderate' :
                     adaptiveScore < 36 ? 'mild' : 'normal';

    const recommendations = generateRecommendations(
      dominantStrategy, 
      problemFocusedScore, 
      emotionFocusedScore, 
      avoidanceScore, 
      socialSupportScore
    );

    const result: CopingStrategiesResult = {
      testId: 'coping-strategies',
      responses,
      problemFocusedScore,
      emotionFocusedScore,
      avoidanceScore,
      socialSupportScore,
      totalScore,
      dominantStrategy,
      severity,
      completedAt: new Date(),
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const generateRecommendations = (
    dominantStrategy: string,
    problemFocused: number,
    emotionFocused: number,
    avoidance: number,
    socialSupport: number
  ): string[] => {
    const recommendations = [];

    if (avoidance > 9) {
      recommendations.push('⚠️ Высокий уровень избегающих стратегий может усугублять проблемы');
      recommendations.push('Рекомендуется работа над развитием активных копинг-стратегий');
    }

    if (problemFocused < 6) {
      recommendations.push('Низкие навыки решения проблем - рекомендуется тренинг проблемно-ориентированного копинга');
    }

    if (socialSupport < 6) {
      recommendations.push('Недостаточное использование социальной поддержки - важно развивать социальные связи');
    }

    switch (dominantStrategy) {
      case 'problem-focused':
        recommendations.push('✅ Активная стратегия решения проблем - эффективный подход');
        recommendations.push('Продолжайте развивать навыки планирования и анализа ситуаций');
        break;
      case 'emotion-focused':
        recommendations.push('Эмоционально-ориентированный копинг может быть полезен в неконтролируемых ситуациях');
        recommendations.push('Сбалансируйте с проблемно-ориентированными стратегиями');
        break;
      case 'avoidance':
        recommendations.push('🚨 Избегание как основная стратегия может быть неэффективным');
        recommendations.push('Рекомендуется когнитивно-поведенческая терапия для развития активных стратегий');
        break;
      case 'social-support':
        recommendations.push('✅ Хорошее использование социальной поддержки');
        recommendations.push('Дополните навыками самостоятельного решения проблем');
        break;
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
  const StrategyIcon = strategyIcons[currentQuestionData.strategy];

  if (showResults) {
    const scores = {
      'problem-focused': responses.reduce((sum, val, idx) => {
        return questions[idx].strategy === 'problem-focused' ? sum + val : sum;
      }, 0),
      'emotion-focused': responses.reduce((sum, val, idx) => {
        return questions[idx].strategy === 'emotion-focused' ? sum + val : sum;
      }, 0),
      'avoidance': responses.reduce((sum, val, idx) => {
        return questions[idx].strategy === 'avoidance' ? sum + val : sum;
      }, 0),
      'social-support': responses.reduce((sum, val, idx) => {
        return questions[idx].strategy === 'social-support' ? sum + val : sum;
      }, 0)
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-600" />
              <span>Стратегии совладания со стрессом - Результаты</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(scores).map(([strategy, score]) => {
                const Icon = strategyIcons[strategy as keyof typeof strategyIcons];
                const isMaxScore = score === Math.max(...Object.values(scores));
                
                return (
                  <div 
                    key={strategy}
                    className={`p-4 rounded-lg border-2 ${
                      isMaxScore ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Icon className={`h-8 w-8 ${isMaxScore ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isMaxScore ? 'text-blue-700' : 'text-gray-700'}`}>
                        {score}
                      </div>
                      <div className={`text-sm ${isMaxScore ? 'text-blue-600' : 'text-gray-600'}`}>
                        {strategyNames[strategy as keyof typeof strategyNames]}
                      </div>
                      {isMaxScore && (
                        <div className="text-xs text-blue-500 mt-1 font-medium">
                          Доминирующая
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Интерпретация результатов</h3>
              <p className="text-sm text-blue-800">
                Эффективные стратегии: Решение проблем и Социальная поддержка обычно наиболее адаптивны. 
                Избегание при частом использовании может усугублять проблемы.
              </p>
            </div>

            <div className="text-center space-y-4">
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
              <Target className="h-6 w-6 text-blue-600" />
              <span>Стратегии совладания со стрессом</span>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} из {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <StrategyIcon className="h-5 w-5 text-blue-600" />
            <span><strong>Стратегия:</strong> {strategyNames[currentQuestionData.strategy]}</span>
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
              Как вы справляетесь со стрессовыми ситуациями?
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}