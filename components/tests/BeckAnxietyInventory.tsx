import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, Zap, Heart, Thermometer } from 'lucide-react';

interface BeckAnxietyInventoryProps {
  onComplete: (result: BAIResult) => void;
  onBack: () => void;
}

export interface BAIResult {
  testId: 'bai';
  responses: number[];
  totalScore: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  somaticScore: number;
  cognitiveScore: number;
  completedAt: Date;
  recommendations: string[];
}

const symptoms = [
  {
    id: 1,
    text: "Онемение или покалывание",
    type: 'somatic'
  },
  {
    id: 2,
    text: "Ощущение жара",
    type: 'somatic'
  },
  {
    id: 3,
    text: "Дрожь в ногах",
    type: 'somatic'
  },
  {
    id: 4,
    text: "Неспособность расслабиться",
    type: 'cognitive'
  },
  {
    id: 5,
    text: "Страх, что произойдет что-то очень плохое",
    type: 'cognitive'
  },
  {
    id: 6,
    text: "Головокружение или легкость в голове",
    type: 'somatic'
  },
  {
    id: 7,
    text: "Учащенное сердцебиение",
    type: 'somatic'
  },
  {
    id: 8,
    text: "Неустойчивость",
    type: 'somatic'
  },
  {
    id: 9,
    text: "Испуг",
    type: 'cognitive'
  },
  {
    id: 10,
    text: "Нервозность",
    type: 'cognitive'
  },
  {
    id: 11,
    text: "Ощущение удушья",
    type: 'somatic'
  },
  {
    id: 12,
    text: "Дрожь в руках",
    type: 'somatic'
  },
  {
    id: 13,
    text: "Дрожь",
    type: 'somatic'
  },
  {
    id: 14,
    text: "Страх потерять контроль",
    type: 'cognitive'
  },
  {
    id: 15,
    text: "Затрудненное дыхание",
    type: 'somatic'
  },
  {
    id: 16,
    text: "Страх смерти",
    type: 'cognitive'
  },
  {
    id: 17,
    text: "Напуганность",
    type: 'cognitive'
  },
  {
    id: 18,
    text: "Расстройство пищеварения",
    type: 'somatic'
  },
  {
    id: 19,
    text: "Слабость",
    type: 'somatic'
  },
  {
    id: 20,
    text: "Покраснение лица",
    type: 'somatic'
  },
  {
    id: 21,
    text: "Потливость (не связанная с жарой)",
    type: 'somatic'
  }
];

const severityOptions = [
  "Совсем не беспокоило",
  "Слегка - не очень беспокоило",
  "Умеренно - было неприятно, но терпимо", 
  "Сильно - я едва мог это вынести"
];

export function BeckAnxietyInventory({ onComplete, onBack }: BeckAnxietyInventoryProps) {
  const [currentSymptom, setCurrentSymptom] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newResponses = [...responses];
    newResponses[currentSymptom] = answerIndex;
    setResponses(newResponses);

    if (currentSymptom < symptoms.length - 1) {
      setCurrentSymptom(currentSymptom + 1);
    } else {
      calculateResults(newResponses);
    }
  };

  const calculateResults = (responses: number[]) => {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);

    // Подсчет соматических и когнитивных симптомов
    let somaticScore = 0;
    let cognitiveScore = 0;

    symptoms.forEach((symptom, index) => {
      if (symptom.type === 'somatic') {
        somaticScore += responses[index];
      } else {
        cognitiveScore += responses[index];
      }
    });

    // Определяем тяжесть тревоги
    let severity: 'normal' | 'mild' | 'moderate' | 'severe';
    if (totalScore <= 7) severity = 'normal';
    else if (totalScore <= 15) severity = 'mild';
    else if (totalScore <= 25) severity = 'moderate';
    else severity = 'severe';

    const recommendations = generateRecommendations(totalScore, severity, somaticScore, cognitiveScore);

    const result: BAIResult = {
      testId: 'bai',
      responses,
      totalScore,
      severity,
      somaticScore,
      cognitiveScore,
      completedAt: new Date(),
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const generateRecommendations = (
    totalScore: number, 
    severity: string, 
    somaticScore: number, 
    cognitiveScore: number
  ): string[] => {
    const recommendations = [];

    if (severity === 'severe') {
      recommendations.push('🚨 Тяжелая тревожность - требуется немедленное вмешательство');
      recommendations.push('Необходима консультация психиатра');
      recommendations.push('Рассмотрите фармакотерапию анксиолитиками');
      recommendations.push('Интенсивная психотерапия (КПТ)');
    } else if (severity === 'moderate') {
      recommendations.push('⚠️ Умеренная тревожность требует лечения');
      recommendations.push('Когнитивно-поведенческая терапия');
      recommendations.push('Техники релаксации и дыхательные упражнения');
      recommendations.push('Возможна фармакотерапия');
    } else if (severity === 'mild') {
      recommendations.push('Легкая тревожность');
      recommendations.push('Техники управления стрессом');
      recommendations.push('Регулярные физические упражнения');
      recommendations.push('Психологическое консультирование');
    } else {
      recommendations.push('✅ Нормальный уровень тревожности');
      recommendations.push('Профилактические мероприятия');
      recommendations.push('Поддержание здорового образа жизни');
    }

    // Специфические рекомендации на основе типа симптомов
    if (somaticScore > cognitiveScore) {
      recommendations.push('💪 Преобладают соматические симптомы тревоги');
      recommendations.push('Фокус на техниках релаксации и работе с телом');
      recommendations.push('Исключите медицинские причины симптомов');
    } else {
      recommendations.push('🧠 Преобладают когнитивные симптомы тревоги');
      recommendations.push('Работа с тревожными мыслями и убеждениями');
      recommendations.push('Когнитивная реструктуризация');
    }

    // Проверка на панические симптомы
    const panicSymptoms = [6, 7, 11, 15]; // Головокружение, сердцебиение, удушье, дыхание
    const panicScore = panicSymptoms.reduce((sum, idx) => sum + responses[idx], 0);
    
    if (panicScore > 8) {
      recommendations.push('⚡ Высокие показатели панических симптомов');
      recommendations.push('Рекомендуется дополнительное обследование на паническое расстройство');
    }

    return recommendations;
  };

  const goBack = () => {
    if (currentSymptom > 0) {
      setCurrentSymptom(currentSymptom - 1);
    } else {
      onBack();
    }
  };

  const progress = ((currentSymptom + 1) / symptoms.length) * 100;
  const currentSymptomData = symptoms[currentSymptom];
  const SymptomIcon = currentSymptomData.type === 'somatic' ? Heart : Zap;

  if (showResults) {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    const somaticScore = symptoms.reduce((sum, symptom, idx) => {
      return symptom.type === 'somatic' ? sum + responses[idx] : sum;
    }, 0);
    const cognitiveScore = symptoms.reduce((sum, symptom, idx) => {
      return symptom.type === 'cognitive' ? sum + responses[idx] : sum;
    }, 0);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-orange-600" />
              <span>Опросник тревоги Бека - Результаты</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-blue-900 mb-2">Общий балл</h3>
                <div className="text-3xl font-bold text-blue-700">{totalScore}</div>
                <div className="text-sm text-blue-600 mt-1">
                  {totalScore <= 7 ? 'Норма' :
                   totalScore <= 15 ? 'Легкая тревога' :
                   totalScore <= 25 ? 'Умеренная тревога' : 'Тяжелая тревога'}
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-red-900 mb-2">Соматические</h3>
                <div className="text-3xl font-bold text-red-700">{somaticScore}</div>
                <div className="text-sm text-red-600 mt-1">Телесные симптомы</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-purple-900 mb-2">Когнитивные</h3>
                <div className="text-3xl font-bold text-purple-700">{cognitiveScore}</div>
                <div className="text-sm text-purple-600 mt-1">Психические симптомы</div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Интерпретация результатов</h3>
              <div className="text-sm text-orange-800 space-y-1">
                <p><strong>0-7 баллов:</strong> Минимальная тревожность</p>
                <p><strong>8-15 баллов:</strong> Легкая тревожность</p>
                <p><strong>16-25 баллов:</strong> Умеренная тревожность</p>
                <p><strong>26-63 балла:</strong> Тяжелая тревожность</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                BAI фокусируется на соматических симптомах тревоги, что делает его особенно полезным 
                для выявления панических атак и соматических проявлений тревожности.
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
              <Zap className="h-6 w-6 text-orange-600" />
              <span>Опросник тревоги Бека</span>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {currentSymptom + 1} из {symptoms.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
            <SymptomIcon className="h-5 w-5 text-orange-600" />
            <span>
              <strong>Тип симптома:</strong> {currentSymptomData.type === 'somatic' ? 'Соматический (телесный)' : 'Когнитивный (психический)'}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6 text-gray-900">
              Насколько вас беспокоило за последнюю неделю, включая сегодня:
            </h3>
            <h2 className="text-xl font-semibold mb-6 text-blue-900">
              {currentSymptomData.text}
            </h2>

            <div className="space-y-3">
              {severityOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-4 h-auto text-left justify-start hover:bg-orange-50 hover:border-orange-300 transition-colors"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-600">{index}</span>
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
              Оценка соматических проявлений тревоги
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}