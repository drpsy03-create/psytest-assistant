import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Brain, Sparkles, ArrowRight, Target, AlertTriangle, Info } from 'lucide-react';

interface TestResult {
  testId: string;
  score: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  timestamp: number;
}

interface SmartRecommendation {
  testId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface TestResultsWithRecommendationsProps {
  completedTest: TestResult;
  recommendations: SmartRecommendation[];
  allTests: any[];
  onSelectTest: (testId: string) => void;
  onFinishSession: () => void;
  completedTestsCount: number;
}

export function TestResultsWithRecommendations({
  completedTest,
  recommendations,
  allTests,
  onSelectTest,
  onFinishSession,
  completedTestsCount
}: TestResultsWithRecommendationsProps) {
  
  const getTestName = (testId: string) => {
    const testMap: { [key: string]: string } = {
      'phq9': 'PHQ-9 (Депрессия)',
      'gad7': 'GAD-7 (Тревожность)',
      'beck': 'Шкала Бека',
      'hamilton-depression': 'Шкала Гамильтона (Депрессия)',
      'hamilton-anxiety': 'Шкала Гамильтона (Тревожность)',
      'stai': 'STAI (Тревожность)',
      'mmse': 'MMSE (Когнитивные функции)',
      'quality-life': 'Качество жизни'
    };
    return testMap[testId] || testId;
  };

  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'severe':
        return { text: 'Выраженные нарушения', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 'moderate':
        return { text: 'Умеренные нарушения', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
      case 'mild':
        return { text: 'Легкие нарушения', color: 'bg-blue-100 text-blue-800', icon: Info };
      default:
        return { text: 'В пределах нормы', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return { text: 'Высокий приоритет', color: 'bg-red-100 text-red-700' };
      case 'medium': return { text: 'Средний приоритет', color: 'bg-yellow-100 text-yellow-700' };
      default: return { text: 'Низкий приоритет', color: 'bg-blue-100 text-blue-700' };
    }
  };

  const severityInfo = getSeverityInfo(completedTest.severity);
  const SeverityIcon = severityInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Тест завершен!
          </h1>
          <p className="text-gray-600">
            Пройдено тестов: {completedTestsCount} • ИИ анализирует результаты
          </p>
        </div>

        {/* Result Summary */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {getTestName(completedTest.testId)}
              </CardTitle>
              <Badge className={severityInfo.color}>
                <SeverityIcon className="h-3 w-3 mr-1" />
                {severityInfo.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-gray-600">Оценка</p>
                <p className="text-2xl font-bold">{completedTest.score}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Результат сохранен и будет передан вашему врачу</p>
                <div className="text-xs text-gray-500">
                  {new Date(completedTest.timestamp).toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        {recommendations.length > 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Рекомендации ИИ</CardTitle>
                  <p className="text-sm text-gray-600">
                    На основе ваших результатов система предлагает дополнительные тесты
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => {
                const test = allTests.find(t => t.id === rec.testId);
                const priorityBadge = getPriorityBadge(rec.priority);
                
                if (!test) return null;

                return (
                  <div
                    key={rec.testId}
                    className={`rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={priorityBadge.color}>
                            {priorityBadge.text}
                          </Badge>
                          <span className="text-xs text-gray-500">{test.duration}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                        <p className="text-xs text-gray-500">{test.description}</p>
                      </div>
                      <Button
                        onClick={() => onSelectTest(rec.testId)}
                        className="ml-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Пройти
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">
                Диагностика завершена
              </h3>
              <p className="text-sm text-green-700 mb-4">
                На основе ваших результатов все релевантные тесты пройдены. 
                ИИ больше не рекомендует дополнительные опросники.
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-green-600">
                <Brain className="h-4 w-4" />
                <span>Полная картина для врача сформирована</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {recommendations.length > 0 ? (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="text-center">
                <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Умная диагностика
                </p>
                <p className="text-xs text-blue-700">
                  ИИ подобрал {recommendations.length} релевантных {recommendations.length === 1 ? 'тест' : recommendations.length < 5 ? 'теста' : 'тестов'}
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900 mb-1">
                  Диагностика завершена
                </p>
                <p className="text-xs text-green-700">
                  Все необходимые данные собраны
                </p>
              </div>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onFinishSession}
              className="px-6 py-3"
            >
              Вернуться к списку
            </Button>
            
            <Button
              onClick={onFinishSession}
              className={`px-6 py-3 ${
                recommendations.length === 0 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {recommendations.length === 0 ? 'Завершить сессию' : 'Завершить позже'}
            </Button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Все результаты автоматически сохраняются и будут переданы вашему врачу
          </p>
        </div>
      </div>
    </div>
  );
}