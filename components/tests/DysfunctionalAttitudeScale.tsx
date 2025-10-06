import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, Brain, AlertCircle } from 'lucide-react';

interface DysfunctionalAttitudeScaleProps {
  onComplete: (result: DASResult) => void;
  onBack: () => void;
}

export interface DASResult {
  testId: 'das';
  responses: number[];
  totalScore: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  perfectionalismScore: number;
  approvalScore: number;
  autonomyScore: number;
  completedAt: Date;
  recommendations: string[];
}

const attitudes = [
  {
    id: 1,
    text: "Критика заставляет меня ненавидеть себя",
    subscale: 'approval'
  },
  {
    id: 2,
    text: "Лучше не пытаться, чем рисковать провалиться",
    subscale: 'perfectionism'
  },
  {
    id: 3,
    text: "Если я не добьюсь успеха во всем, что делаю, люди не будут меня уважать",
    subscale: 'perfectionism'
  },
  {
    id: 4,
    text: "Если человек не может хорошо выполнить работу, ему лучше ее вообще не делать",
    subscale: 'perfectionism'
  },
  {
    id: 5,
    text: "Если я попрошу о помощи, это покажет мою слабость",
    subscale: 'autonomy'
  },
  {
    id: 6,
    text: "Если человек не нравится мне, это означает, что я плохой человек",
    subscale: 'approval'
  },
  {
    id: 7,
    text: "Если я делаю ошибку, это означает, что я некомпетентен",
    subscale: 'perfectionism'
  },
  {
    id: 8,
    text: "Если я не могу делать что-то хорошо, нет смысла делать это вообще",
    subscale: 'perfectionism'
  },
  {
    id: 9,
    text: "Мне нужно одобрение других людей, чтобы быть счастливым",
    subscale: 'approval'
  },
  {
    id: 10,
    text: "Если кто-то важный для меня ожидает от меня чего-то, я должен это сделать",
    subscale: 'approval'
  },
  {
    id: 11,
    text: "Мое счастье зависит больше от других людей, чем от меня",
    subscale: 'autonomy'
  },
  {
    id: 12,
    text: "Я не могу быть счастливым, если меня не любят те, кому я небезразличен",
    subscale: 'approval'
  },
  {
    id: 13,
    text: "Если другие люди знают, какой я на самом деле, они подумают обо мне меньше",
    subscale: 'approval'
  },
  {
    id: 14,
    text: "Если я терплю неудачу частично, это так же плохо, как быть полным неудачником",
    subscale: 'perfectionism'
  },
  {
    id: 15,
    text: "Если я не устанавливаю высшие стандарты для себя, я буду второсортным человеком",
    subscale: 'perfectionism'
  },
  {
    id: 16,
    text: "Если я сильно стараюсь, я должу уметь преуспеть практически во всем",
    subscale: 'perfectionism'
  },
  {
    id: 17,
    text: "Для меня ужасно быть неодобренным кем-то важным для меня",
    subscale: 'approval'
  },
  {
    id: 18,
    text: "Если я не делаю других людей счастливыми, они отвергнут меня",
    subscale: 'approval'
  },
  {
    id: 19,
    text: "Если человек, которого я люблю, не любит меня, это означает, что я недостоин любви",
    subscale: 'approval'
  },
  {
    id: 20,
    text: "Совершение ошибки означает, что я глуп или плохой человек",
    subscale: 'perfectionism'
  },
  {
    id: 21,
    text: "Если на работе (в школе) я не делаю все так хорошо, как другие, это означает, что я хуже как личность",
    subscale: 'perfectionism'
  },
  {
    id: 22,
    text: "Если я не могу все время контролировать себя, я становлюсь слабым",
    subscale: 'autonomy'
  },
  {
    id: 23,
    text: "Мне нужно быть идеальным, чтобы заслужить самоуважение",
    subscale: 'perfectionism'
  },
  {
    id: 24,
    text: "Если я выражаю свои чувства, люди подумают, что со мной что-то не так",
    subscale: 'autonomy'
  }
];

const responseOptions = [
  "Полностью согласен",
  "Согласен",
  "Слегка согласен", 
  "Нейтрально",
  "Слегка не согласен",
  "Не согласен",
  "Полностью не согласен"
];

export function DysfunctionalAttitudeScale({ onComplete, onBack }: DysfunctionalAttitudeScaleProps) {
  const [currentAttitude, setCurrentAttitude] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newResponses = [...responses];
    newResponses[currentAttitude] = answerIndex + 1; // Оценки от 1 до 7
    setResponses(newResponses);

    if (currentAttitude < attitudes.length - 1) {
      setCurrentAttitude(currentAttitude + 1);
    } else {
      calculateResults(newResponses);
    }
  };

  const calculateResults = (responses: number[]) => {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);

    // Подсчет по подшкалам
    let perfectionalismScore = 0;
    let approvalScore = 0;
    let autonomyScore = 0;

    attitudes.forEach((attitude, index) => {
      switch (attitude.subscale) {
        case 'perfectionism':
          perfectionalismScore += responses[index];
          break;
        case 'approval':
          approvalScore += responses[index];
          break;
        case 'autonomy':
          autonomyScore += responses[index];
          break;
      }
    });

    // Определяем тяжесть дисфункциональных установок
    const avgScore = totalScore / attitudes.length;
    let severity: 'normal' | 'mild' | 'moderate' | 'severe';
    
    if (avgScore <= 2.5) severity = 'normal';
    else if (avgScore <= 4.0) severity = 'mild';
    else if (avgScore <= 5.5) severity = 'moderate';
    else severity = 'severe';

    const recommendations = generateRecommendations(
      totalScore, 
      severity, 
      perfectionalismScore, 
      approvalScore, 
      autonomyScore
    );

    const result: DASResult = {
      testId: 'das',
      responses,
      totalScore,
      severity,
      perfectionalismScore,
      approvalScore,
      autonomyScore,
      completedAt: new Date(),
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const generateRecommendations = (
    totalScore: number,
    severity: string,
    perfectionism: number,
    approval: number,
    autonomy: number
  ): string[] => {
    const recommendations = [];

    if (severity === 'severe') {
      recommendations.push('🚨 Выраженные дисфункциональные установки');
      recommendations.push('Необходима когнитивно-поведенческая терапия');
      recommendations.push('Работа с автоматическими мыслями и убеждениями');
      recommendations.push('Высокий риск развития депрессии при стрессе');
    } else if (severity === 'moderate') {
      recommendations.push('⚠️ Умеренно выраженные дисфункциональные установки');
      recommendations.push('Психологическое консультирование');
      recommendations.push('Техники когнитивной реструктуризации');
    } else if (severity === 'mild') {
      recommendations.push('Легкие дисфункциональные установки');
      recommendations.push('Профилактическая работа с мышлением');
      recommendations.push('Развитие психологической гибкости');
    } else {
      recommendations.push('✅ Здоровые когнитивные установки');
      recommendations.push('Хорошая психологическая устойчивость');
    }

    // Специфические рекомендации по подшкалам
    const perfectionalismAvg = perfectionism / 12; // 12 вопросов по перфекционизму
    const approvalAvg = approval / 10; // 10 вопросов по одобрению
    const autonomyAvg = autonomy / 4; // 4 вопроса по автономии

    if (perfectionalismAvg > 5.0) {
      recommendations.push('📐 Высокий перфекционизм - основная проблемная область');
      recommendations.push('Работа с нереалистичными стандартами');
      recommendations.push('Принятие "достаточно хорошего" результата');
    }

    if (approvalAvg > 5.0) {
      recommendations.push('👥 Чрезмерная потребность в одобрении');
      recommendations.push('Развитие внутренней самооценки');
      recommendations.push('Снижение зависимости от мнения других');
    }

    if (autonomyAvg > 5.0) {
      recommendations.push('🔒 Проблемы с автономией и контролем');
      recommendations.push('Развитие навыков самостоятельности');
      recommendations.push('Работа с чувством беспомощности');
    }

    return recommendations;
  };

  const goBack = () => {
    if (currentAttitude > 0) {
      setCurrentAttitude(currentAttitude - 1);
    } else {
      onBack();
    }
  };

  const progress = ((currentAttitude + 1) / attitudes.length) * 100;
  const currentAttitudeData = attitudes[currentAttitude];

  if (showResults) {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / attitudes.length;
    
    const perfectionalismScore = attitudes.reduce((sum, attitude, idx) => {
      return attitude.subscale === 'perfectionism' ? sum + responses[idx] : sum;
    }, 0);
    
    const approvalScore = attitudes.reduce((sum, attitude, idx) => {
      return attitude.subscale === 'approval' ? sum + responses[idx] : sum;
    }, 0);
    
    const autonomyScore = attitudes.reduce((sum, attitude, idx) => {
      return attitude.subscale === 'autonomy' ? sum + responses[idx] : sum;
    }, 0);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <span>Шкала дисфункциональных установок - Результаты</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-purple-900 mb-2">Общий балл</h3>
                <div className="text-3xl font-bold text-purple-700">{totalScore}</div>
                <div className="text-sm text-purple-600 mt-1">
                  Средний: {avgScore.toFixed(1)} из 7
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium text-blue-900">Перфекционизм</span>
                  <span className="text-blue-700 font-bold">{perfectionalismScore}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium text-green-900">Потребность в одобрении</span>
                  <span className="text-green-700 font-bold">{approvalScore}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span className="text-sm font-medium text-orange-900">Автономия</span>
                  <span className="text-orange-700 font-bold">{autonomyScore}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                <AlertCircle className="h-5 w-5 inline mr-2" />
                Интерпретация результатов
              </h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <p><strong>Средний балл 1-2.5:</strong> Здоровые установки</p>
                <p><strong>Средний балл 2.6-4.0:</strong> Легкие дисфункциональные установки</p>
                <p><strong>Средний балл 4.1-5.5:</strong> Умеренные дисфункциональные установки</p>
                <p><strong>Средний балл 5.6-7.0:</strong> Выраженные дисфункциональные установки</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Важно!</h3>
              <p className="text-sm text-red-800">
                Дисфункциональные установки являются когнитивными факторами уязвимости к депрессии. 
                Высокие баллы указывают на необходимость работы с мышлением для профилактики депрессивных эпизодов.
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
              <Brain className="h-6 w-6 text-purple-600" />
              <span>Шкала дисфункциональных установок</span>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {currentAttitude + 1} из {attitudes.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
            <strong>Инструкция:</strong> Оцените, насколько вы согласны с каждым утверждением. 
            Отвечайте честно, основываясь на ваших истинных убеждениях.
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6 text-gray-900">
              {currentAttitudeData.text}
            </h3>

            <div className="space-y-2">
              {responseOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-3 h-auto text-left justify-start hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-purple-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
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
              Подшкала: {currentAttitudeData.subscale === 'perfectionism' ? 'Перфекционизм' :
                        currentAttitudeData.subscale === 'approval' ? 'Потребность в одобрении' :
                        'Автономия'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}