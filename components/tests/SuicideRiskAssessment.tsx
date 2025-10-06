import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, AlertTriangle, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface SuicideRiskAssessmentProps {
  onComplete: (result: SuicideRiskResult) => void;
  onBack: () => void;
}

export interface SuicideRiskResult {
  testId: 'suicide-risk';
  responses: number[];
  totalScore: number;
  riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'severe';
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  completedAt: Date;
  recommendations: string[];
}

const questions = [
  {
    id: 1,
    text: "В течение последних 2 недель, как часто вас беспокоили мысли о том, что лучше было бы умереть или причинить себе вред?",
    options: [
      "Ни разу",
      "Несколько дней", 
      "Более половины дней",
      "Почти каждый день"
    ]
  },
  {
    id: 2,
    text: "Думали ли вы конкретно о способах причинения себе вреда?",
    options: [
      "Никогда не думал об этом",
      "Иногда возникали такие мысли",
      "Часто думаю об этом",
      "Постоянно думаю об этом"
    ]
  },
  {
    id: 3,
    text: "Есть ли у вас конкретный план причинения себе вреда?",
    options: [
      "Нет никакого плана",
      "Есть общие мысли, но без плана",
      "Есть частичный план",
      "Есть детальный план"
    ]
  },
  {
    id: 4,
    text: "Насколько сильно ваше желание жить?",
    options: [
      "Очень сильное",
      "Умеренное",
      "Слабое",
      "Отсутствует"
    ]
  },
  {
    id: 5,
    text: "Что удерживает вас от причинения себе вреда?",
    options: [
      "Много причин (семья, планы, ценности)",
      "Несколько важных причин",
      "Одна-две причины",
      "Ничего не удерживает"
    ]
  },
  {
    id: 6,
    text: "Были ли у вас в прошлом попытки причинить себе вред?",
    options: [
      "Никогда",
      "Были мысли, но не было действий",
      "Была одна попытка",
      "Было несколько попыток"
    ]
  },
  {
    id: 7,
    text: "Как вы оцениваете вероятность того, что причините себе вред в ближайшие 24 часа?",
    options: [
      "0% - исключено",
      "Низкая вероятность",
      "Умеренная вероятность",
      "Высокая вероятность"
    ]
  },
  {
    id: 8,
    text: "Принимаете ли вы алкоголь или наркотики?",
    options: [
      "Не принимаю",
      "Редко, в социальных ситуациях",
      "Регулярно",
      "Часто или в больших количествах"
    ]
  }
];

const emergencyContacts = [
  { name: "Телефон экстренной психологической помощи", number: "8-800-2000-122", available: "круглосуточно" },
  { name: "Служба скорой помощи", number: "103", available: "круглосуточно" },
  { name: "Центр психического здоровья", number: "8-800-101-1212", available: "08:00-20:00" }
];

export function SuicideRiskAssessment({ onComplete, onBack }: SuicideRiskAssessmentProps) {
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
    const totalScore = responses.reduce((sum, response) => sum + response, 0);
    
    let riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'severe';
    let severity: 'normal' | 'mild' | 'moderate' | 'severe';
    
    // Особое внимание к критическим ответам
    const hasHighRiskIndicators = 
      responses[2] >= 2 || // Есть план
      responses[3] >= 2 || // Слабое желание жить
      responses[4] >= 2 || // Мало что удерживает
      responses[6] >= 2;   // Высокая вероятность в 24ч
    
    const hasImmediateRisk = 
      responses[2] === 3 || // Детальный план
      responses[3] === 3 || // Нет желания жить
      responses[6] === 3;   // Высокая вероятность немедленно
    
    if (hasImmediateRisk || totalScore >= 20) {
      riskLevel = 'severe';
      severity = 'severe';
    } else if (hasHighRiskIndicators || totalScore >= 15) {
      riskLevel = 'high';
      severity = 'severe';
    } else if (totalScore >= 10) {
      riskLevel = 'moderate';
      severity = 'moderate';
    } else if (totalScore >= 5) {
      riskLevel = 'low';
      severity = 'mild';
    } else {
      riskLevel = 'minimal';
      severity = 'normal';
    }

    const recommendations = generateRecommendations(riskLevel, responses);

    const result: SuicideRiskResult = {
      testId: 'suicide-risk',
      responses,
      totalScore,
      riskLevel,
      severity,
      completedAt: new Date(),
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const generateRecommendations = (riskLevel: string, responses: number[]): string[] => {
    const recommendations = [];

    if (riskLevel === 'severe') {
      recommendations.push('НЕМЕДЛЕННО обратитесь за экстренной помощью');
      recommendations.push('Не оставайтесь в одиночестве');
      recommendations.push('Срочная госпитализация может быть необходима');
      recommendations.push('Уберите средства самоповреждения из доступа');
    } else if (riskLevel === 'high') {
      recommendations.push('Срочно обратитесь к психиатру или в кризисный центр');
      recommendations.push('Рассмотрите возможность госпитализации');
      recommendations.push('Обеспечьте постоянное наблюдение');
      recommendations.push('Начните медикаментозное лечение');
    } else if (riskLevel === 'moderate') {
      recommendations.push('Обратитесь к специалисту в течение 1-2 дней');
      recommendations.push('Рассмотрите психотерапию и медикаментозное лечение');
      recommendations.push('Создайте план безопасности');
      recommendations.push('Увеличьте социальную поддержку');
    } else if (riskLevel === 'low') {
      recommendations.push('Запланируйте визит к специалисту на этой неделе');
      recommendations.push('Рассмотрите психотерапию');
      recommendations.push('Работайте над копинг-стратегиями');
    } else {
      recommendations.push('Продолжайте регулярное наблюдение');
      recommendations.push('Поддерживайте защитные факторы');
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

  if (showResults) {
    const result = {
      responses,
      totalScore: responses.reduce((sum, response) => sum + response, 0)
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-900">Оценка суицидального риска завершена</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                <strong>Важно:</strong> Результаты этого теста немедленно переданы вашему врачу. 
                Если вы испытываете суицидальные мысли, обратитесь за помощью прямо сейчас.
              </AlertDescription>
            </Alert>

            <div className="bg-white rounded-lg p-6 border border-red-200">
              <h3 className="font-semibold text-lg mb-4 text-red-900">Экстренные контакты</h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-red-900">{contact.name}</div>
                      <div className="text-sm text-red-700">{contact.available}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-800">{contact.number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-red-800 font-medium">
                Ваша безопасность — наш приоритет. Помощь доступна 24/7.
              </p>
              <Button
                onClick={onBack}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Вернуться к тестированию
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-900">Оценка суицидального риска</CardTitle>
            </div>
            <div className="text-sm text-red-700">
              {currentQuestion + 1} из {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-red-300 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              Этот опрос поможет оценить риск и обеспечить вашу безопасность. 
              Отвечайте честно — ваши ответы конфиденциальны и помогут получить нужную помощь.
            </AlertDescription>
          </Alert>

          <div className="bg-white rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-medium mb-6 text-gray-900">
              {questions[currentQuestion].text}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-4 h-auto text-left justify-start hover:bg-red-50 hover:border-red-300 transition-colors"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-red-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-red-600">{index}</span>
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Назад</span>
            </Button>
            
            <div className="text-xs text-red-600 text-center">
              Если вы в кризисе, звоните 8-800-2000-122
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}