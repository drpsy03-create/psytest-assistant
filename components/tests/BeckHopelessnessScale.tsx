import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, CloudRain, Sun } from 'lucide-react';

interface BeckHopelessnessScaleProps {
  onComplete: (result: BHSResult) => void;
  onBack: () => void;
}

export interface BHSResult {
  testId: 'bhs';
  responses: boolean[];
  totalScore: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  completedAt: Date;
  recommendations: string[];
}

const statements = [
  {
    id: 1,
    text: "Я смотрю в будущее с надеждой и энтузиазмом",
    reversed: true
  },
  {
    id: 2,
    text: "Я мог бы также сдаться, потому что я ничего не могу изменить к лучшему",
    reversed: false
  },
  {
    id: 3,
    text: "Когда дела идут плохо, мне помогает знать, что они не могут оставаться плохими вечно",
    reversed: true
  },
  {
    id: 4,
    text: "Я не могу представить, какой будет моя жизнь через 10 лет",
    reversed: false
  },
  {
    id: 5,
    text: "У меня достаточно времени, чтобы выполнить то, что я больше всего хочу сделать",
    reversed: true
  },
  {
    id: 6,
    text: "В будущем я надеюсь добиться успеха в том, что меня больше всего волнует",
    reversed: true
  },
  {
    id: 7,
    text: "Мое будущее кажется мне темным",
    reversed: false
  },
  {
    id: 8,
    text: "Я надеюсь получить больше хорошего в жизни, чем обычный человек",
    reversed: true
  },
  {
    id: 9,
    text: "Я просто не могу поймать удачу, и нет причин верить, что буду в будущем",
    reversed: false
  },
  {
    id: 10,
    text: "Мои прошлые переживания подготовили меня хорошо к будущему",
    reversed: true
  },
  {
    id: 11,
    text: "Все, что я вижу впереди, больше неприятно, чем приятно",
    reversed: false
  },
  {
    id: 12,
    text: "Я не надеюсь получить то, что я действительно хочу",
    reversed: false
  },
  {
    id: 13,
    text: "Когда я смотрю в будущее, я надеюсь быть счастливее, чем сейчас",
    reversed: true
  },
  {
    id: 14,
    text: "Все никогда не будет работать так, как я хочу",
    reversed: false
  },
  {
    id: 15,
    text: "У меня большая вера в будущее",
    reversed: true
  },
  {
    id: 16,
    text: "Я никогда не получаю то, что хочу, поэтому глупо что-то желать",
    reversed: false
  },
  {
    id: 17,
    text: "Очень маловероятно, что я получу реальное удовлетворение в будущем",
    reversed: false
  },
  {
    id: 18,
    text: "Будущее кажется мне неопределенным и сомнительным",
    reversed: false
  },
  {
    id: 19,
    text: "Я могу ожидать больше хороших времен, чем плохих",
    reversed: true
  },
  {
    id: 20,
    text: "Нет смысла действительно стараться получить что-то, что я хочу, потому что я, вероятно, не получу этого",
    reversed: false
  }
];

export function BeckHopelessnessScale({ onComplete, onBack }: BeckHopelessnessScaleProps) {
  const [currentStatement, setCurrentStatement] = useState(0);
  const [responses, setResponses] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (agrees: boolean) => {
    const newResponses = [...responses];
    newResponses[currentStatement] = agrees;
    setResponses(newResponses);

    if (currentStatement < statements.length - 1) {
      setCurrentStatement(currentStatement + 1);
    } else {
      calculateResults(newResponses);
    }
  };

  const calculateResults = (responses: boolean[]) => {
    let score = 0;

    statements.forEach((statement, index) => {
      const userAgrees = responses[index];
      
      // Если утверждение обратное (позитивное), то согласие = 0 баллов, несогласие = 1 балл
      // Если утверждение прямое (негативное), то согласие = 1 балл, несогласие = 0 баллов
      if (statement.reversed) {
        score += userAgrees ? 0 : 1;
      } else {
        score += userAgrees ? 1 : 0;
      }
    });

    // Определяем тяжесть безнадежности
    let severity: 'normal' | 'mild' | 'moderate' | 'severe';
    if (score <= 3) severity = 'normal';
    else if (score <= 8) severity = 'mild';
    else if (score <= 13) severity = 'moderate';
    else severity = 'severe';

    const recommendations = generateRecommendations(score, severity);

    const result: BHSResult = {
      testId: 'bhs',
      responses,
      totalScore: score,
      severity,
      completedAt: new Date(),
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const generateRecommendations = (score: number, severity: string): string[] => {
    const recommendations = [];

    if (severity === 'severe') {
      recommendations.push('🚨 Критический уровень безнадежности - высокий суицидальный риск');
      recommendations.push('Немедленная консультация специалиста по психическому здоровью');
      recommendations.push('Рассмотрите госпитализацию или интенсивное амбулаторное лечение');
      recommendations.push('Обязательна оценка суицидального риска');
    } else if (severity === 'moderate') {
      recommendations.push('⚠️ Выраженная безнадежность требует внимания');
      recommendations.push('Когнитивно-поведенческая терапия для работы с негативными убеждениями');
      recommendations.push('Регулярное наблюдение специалиста');
      recommendations.push('Рекомендуется дополнительная оценка суицидального риска');
    } else if (severity === 'mild') {
      recommendations.push('Легкая степень безнадежности');
      recommendations.push('Работа с позитивным планированием будущего');
      recommendations.push('Психологическая поддержка и консультирование');
      recommendations.push('Техники развития надежды и целеполагания');
    } else {
      recommendations.push('✅ Нормальный уровень надежды на будущее');
      recommendations.push('Хорошие адаптивные ресурсы');
      recommendations.push('Поддержание позитивного взгляда на будущее');
    }

    // Специфические рекомендации на основе паттернов ответов
    const negativeStatements = responses.filter((response, idx) => 
      !statements[idx].reversed && response
    ).length;

    if (negativeStatements > 10) {
      recommendations.push('Преобладают негативные убеждения о будущем');
      recommendations.push('Фокус на когнитивной реструктуризации');
    }

    return recommendations;
  };

  const goBack = () => {
    if (currentStatement > 0) {
      setCurrentStatement(currentStatement - 1);
    } else {
      onBack();
    }
  };

  const progress = ((currentStatement + 1) / statements.length) * 100;
  const currentStatementData = statements[currentStatement];

  if (showResults) {
    const score = responses.reduce((sum, response, idx) => {
      const statement = statements[idx];
      if (statement.reversed) {
        return sum + (response ? 0 : 1);
      } else {
        return sum + (response ? 1 : 0);
      }
    }, 0);

    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'severe': return 'text-red-700 bg-red-50';
        case 'moderate': return 'text-orange-700 bg-orange-50';
        case 'mild': return 'text-yellow-700 bg-yellow-50';
        default: return 'text-green-700 bg-green-50';
      }
    };

    const getSeverityText = (severity: string) => {
      switch (severity) {
        case 'severe': return 'Критическая безнадежность';
        case 'moderate': return 'Выраженная безнадежность';
        case 'mild': return 'Легкая безнадежность';
        default: return 'Нормальная надежда';
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <CloudRain className="h-6 w-6 text-gray-600" />
              <span>Шкала безнадежности Бека - Результаты</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{score} баллов</div>
              <div className={`inline-block px-4 py-2 rounded-lg ${getSeverityColor(responses.reduce((sum, response, idx) => {
                const statement = statements[idx];
                if (statement.reversed) {
                  return sum + (response ? 0 : 1);
                } else {
                  return sum + (response ? 1 : 0);
                }
              }, 0) <= 3 ? 'normal' : responses.reduce((sum, response, idx) => {
                const statement = statements[idx];
                if (statement.reversed) {
                  return sum + (response ? 0 : 1);
                } else {
                  return sum + (response ? 1 : 0);
                }
              }, 0) <= 8 ? 'mild' : responses.reduce((sum, response, idx) => {
                const statement = statements[idx];
                if (statement.reversed) {
                  return sum + (response ? 0 : 1);
                } else {
                  return sum + (response ? 1 : 0);
                }
              }, 0) <= 13 ? 'moderate' : 'severe')}`}>
                {getSeverityText(score <= 3 ? 'normal' : score <= 8 ? 'mild' : score <= 13 ? 'moderate' : 'severe')}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Интерпретация результатов</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>0-3 балла:</strong> Нормальный уровень надежды</p>
                <p><strong>4-8 баллов:</strong> Легкая безнадежность</p>
                <p><strong>9-13 баллов:</strong> Умеренная безнадежность</p>
                <p><strong>14-20 баллов:</strong> Критическая безнадежность (высокий суицидальный риск)</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Важно!</h3>
              <p className="text-sm text-yellow-800">
                Шкала безнадежности Бека является одним из лучших предикторов суицидального риска. 
                Высокие баллы требуют немедленного клинического внимания.
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
              <CloudRain className="h-6 w-6 text-gray-600" />
              <span>Шкала безнадежности Бека</span>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {currentStatement + 1} из {statements.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Инструкция:</strong> Прочитайте каждое утверждение и решите, согласны вы с ним или нет, 
            учитывая ваше отношение к будущему в течение последней недели.
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6 text-gray-900">
              {currentStatementData.text}
            </h3>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full p-4 h-auto text-left justify-start hover:bg-green-50 hover:border-green-300 transition-colors"
                onClick={() => handleAnswer(true)}
              >
                <div className="flex items-center space-x-3">
                  <Sun className="h-5 w-5 text-green-600" />
                  <span>Согласен</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full p-4 h-auto text-left justify-start hover:bg-red-50 hover:border-red-300 transition-colors"
                onClick={() => handleAnswer(false)}
              >
                <div className="flex items-center space-x-3">
                  <CloudRain className="h-5 w-5 text-gray-600" />
                  <span>Не согласен</span>
                </div>
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Ключевой предиктор суицидального риска
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}