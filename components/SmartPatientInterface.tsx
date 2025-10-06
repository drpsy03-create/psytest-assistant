import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Clock, Brain, Heart, Sparkles, ChevronRight, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { BeckDepressionInventory } from './tests/BeckDepressionInventory';
import { GAD7Test } from './tests/GAD7Test';
import { PHQ9Test } from './tests/PHQ9Test';
import { MMSETest } from './tests/MMSETest';
import { HamiltonDepressionTest } from './tests/HamiltonDepressionTest';
import { HamiltonAnxietyTest } from './tests/HamiltonAnxietyTest';
import { STAITest } from './tests/STAITest';
import { QualityOfLifeTest } from './tests/QualityOfLifeTest';
import { SuicideRiskAssessment } from './tests/SuicideRiskAssessment';
import { HADSTest } from './tests/HADSTest';
import { CopingStrategiesTest } from './tests/CopingStrategiesTest';
import { BeckHopelessnessScale } from './tests/BeckHopelessnessScale';
import { BeckAnxietyInventory } from './tests/BeckAnxietyInventory';
import { DysfunctionalAttitudeScale } from './tests/DysfunctionalAttitudeScale';
import { SCL90RTest } from './tests/SCL90RTest';
import { TestResultsWithRecommendations } from './TestResultsWithRecommendations';

interface TestResult {
  id: string;
  patientName: string;
  patientId: string;
  accessCode: string;
  testType: string;
  score: number;
  severity: 'mild' | 'moderate' | 'severe' | 'normal';
  date: string;
  aiAnalysis: string;
  recommendations: string[];
  rawResults?: any;
}

interface SmartPatientInterfaceProps {
  onBack: () => void;
  user: { role: 'doctor' | 'patient'; name: string; id: string } | null;
  onLogout: () => void;
  accessCode: string;
  onSaveTestResult: (result: Omit<TestResult, 'id' | 'date' | 'patientId'>) => void;
}

type TestType = 'initial-screening' | 'beck' | 'gad7' | 'phq9' | 'mmse' | 'hamilton-depression' | 'hamilton-anxiety' | 'stai' | 'quality-life' | 'suicide-risk' | 'hads' | 'coping-strategies' | 'bhs' | 'bai' | 'das' | 'scl90r' | null;
type ViewState = 'dashboard' | 'test' | 'results';

interface LocalTestResult {
  testId: string;
  score: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  timestamp: number;
}

interface SmartRecommendation {
  testId: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export function SmartPatientInterface({ onBack, user, onLogout, accessCode, onSaveTestResult }: SmartPatientInterfaceProps) {
  const [currentTest, setCurrentTest] = useState<TestType>(null);
  const [completedTests, setCompletedTests] = useState<LocalTestResult[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'initial' | 'adaptive' | 'comprehensive'>('initial');
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [lastCompletedTest, setLastCompletedTest] = useState<LocalTestResult | null>(null);
  const [phaseJustChanged, setPhaseJustChanged] = useState<string | null>(null);

  const initialTests = [
    {
      id: 'scl90r',
      title: 'SCL-90-R (Симптоматический опросник)',
      description: 'Комплексная оценка психического состояния по 9 шкалам',
      duration: '15 минут',
      category: 'Общий скрининг',
      icon: Brain,
      color: 'bg-blue-100 text-blue-700',
      priority: 1
    },
    {
      id: 'phq9',
      title: 'PHQ-9 (Скрининг депрессии)',
      description: 'Быстрая оценка депрессивных симптомов',
      duration: '3 минуты',
      category: 'Настроение',
      icon: Heart,
      color: 'bg-blue-100 text-blue-700',
      priority: 2
    },
    {
      id: 'gad7',
      title: 'GAD-7 (Скрининг тревожности)',
      description: 'Оценка генерализованной тревожности',
      duration: '3 минуты',
      category: 'Тревожность',
      icon: Brain,
      color: 'bg-orange-100 text-orange-700',
      priority: 1
    },
    {
      id: 'beck',
      title: 'Шкала депрессии Бека (BDI-II)',
      description: 'Детальная оценка депрессивной симптоматики',
      duration: '10 минут',
      category: 'Настроение',
      icon: Heart,
      color: 'bg-red-100 text-red-700',
      priority: 1
    },
    {
      id: 'hamilton-depression',
      title: 'Шкала депрессии Гамильтона (HDRS)',
      description: 'Клиническая оценка тяжести депрессии',
      duration: '8 минут',
      category: 'Настроение',
      icon: Heart,
      color: 'bg-pink-100 text-pink-700',
      priority: 1
    },
    {
      id: 'hamilton-anxiety',
      title: 'Шкала тревоги Гамильтона (HAM-A)',
      description: 'Оценка соматических и психических симптомов тревоги',
      duration: '10 минут',
      category: 'Тревожность',
      icon: Brain,
      color: 'bg-yellow-100 text-yellow-700',
      priority: 1
    },
    {
      id: 'stai',
      title: 'STAI (Шкала тревожности)',
      description: 'Оценка ситуативной и личностной тревожности',
      duration: '12 минут',
      category: 'Тревожность',
      icon: Brain,
      color: 'bg-amber-100 text-amber-700',
      priority: 1
    },
    {
      id: 'mmse',
      title: 'MMSE (Когнитивные функции)',
      description: 'Краткая оценка когнитивного статуса',
      duration: '10 минут',
      category: 'Когнитивные функции',
      icon: Brain,
      color: 'bg-green-100 text-green-700',
      priority: 1
    },
    {
      id: 'quality-life',
      title: 'Опросник качества жизни',
      description: 'Комплексная оценка качества жизни и благополучия',
      duration: '8 минут',
      category: 'Качество жизни',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-700',
      priority: 1
    },
    {
      id: 'suicide-risk',
      title: 'Оценка суицидального риска',
      description: 'КРИТИЧЕСКИЙ: Оценка риска самоповреждения',
      duration: '5 минут',
      category: 'Экстренная оценка',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800',
      priority: 1
    },
    {
      id: 'hads',
      title: 'HADS (Тревога и депрессия)',
      description: 'Дифференциальная диагностика тревоги и депрессии',
      duration: '5 минут',
      category: 'Дифференциальная диагностика',
      icon: Heart,
      color: 'bg-indigo-100 text-indigo-700',
      priority: 1
    },
    {
      id: 'coping-strategies',
      title: 'Стратегии совладания',
      description: 'Оценка способов справления со стрессом',
      duration: '6 минут',
      category: 'Копинг-ресурсы',
      icon: Target,
      color: 'bg-green-100 text-green-700',
      priority: 2
    },
    {
      id: 'bhs',
      title: 'Шкала безнадежности Бека',
      description: 'КРИТИЧЕСКИЙ: Ключевой предиктор суицидального риска',
      duration: '5 минут',
      category: 'Суицидальный риск',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800',
      priority: 1
    },
    {
      id: 'bai',
      title: 'Опросник тревоги Бека (BAI)',
      description: 'Оценка соматических проявлений тревоги',
      duration: '7 минут',
      category: 'Специализированная тревога',
      icon: Brain,
      color: 'bg-orange-100 text-orange-700',
      priority: 2
    },
    {
      id: 'das',
      title: 'Шкала дисфункциональных установок',
      description: 'Когнитивные факторы уязвимости к депрессии',
      duration: '8 минут',
      category: 'Когнитивные искажения',
      icon: Brain,
      color: 'bg-purple-100 text-purple-700',
      priority: 2
    }
  ];

  const allTests = [
    ...initialTests,
    {
      id: 'beck',
      title: 'Шкала депрессии Бека (BDI-II)',
      description: 'Детальная оценка депрессивной симптоматики',
      duration: '10 минут',
      category: 'Углубленная диагностика',
      icon: Heart,
      color: 'bg-red-100 text-red-700',
      priority: 2
    },
    {
      id: 'hamilton-depression',
      title: 'Шкала депрессии Гамильтона (HDRS)',
      description: 'Клиническая оценка тяжести депрессии',
      duration: '8 минут',
      category: 'Специализированная диагностика',
      icon: Heart,
      color: 'bg-pink-100 text-pink-700',
      priority: 3
    },
    {
      id: 'hamilton-anxiety',
      title: 'Шкала тревоги Гамильтона (HAM-A)',
      description: 'Оценка соматических и психических симптомов тревоги',
      duration: '10 минут',
      category: 'Специализированная диагностика',
      icon: Brain,
      color: 'bg-yellow-100 text-yellow-700',
      priority: 3
    },
    {
      id: 'stai',
      title: 'STAI (Шкала тревожности)',
      description: 'Оценка ситуативной и личностной тревожности',
      duration: '12 минут',
      category: 'Углубленная диагностика',
      icon: Brain,
      color: 'bg-amber-100 text-amber-700',
      priority: 2
    },
    {
      id: 'mmse',
      title: 'MMSE (Когнитивные функции)',
      description: 'Краткая оценка когнитивного статуса',
      duration: '10 минут',
      category: 'Когнитивная оценка',
      icon: Brain,
      color: 'bg-green-100 text-green-700',
      priority: 2
    },
    {
      id: 'quality-life',
      title: 'Опросник качества жизни',
      description: 'Комплексная оценка качества жизни и благополучия',
      duration: '8 минут',
      category: 'Общая оценка',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-700',
      priority: 2
    }
  ];

  // Функция проверки суицидального риска на основе уже пройденных тестов
  const checkForSuicidalRisk = (): boolean => {
    // Проверяем PHQ-9 (вопрос 9 о суицидальных мыслях)
    const phq9Result = completedTests.find(t => t.testId === 'phq9');
    if (phq9Result && phq9Result.responses) {
      // В PHQ-9 вопрос 9 (индекс 8) касается суицидальных мыслей
      const suicidalThoughtsScore = phq9Result.responses[8];
      if (suicidalThoughtsScore > 0) return true;
    }

    // Проверяем Beck Depression Inventory на высокие баллы
    const beckResult = completedTests.find(t => t.testId === 'beck');
    if (beckResult && beckResult.responses) {
      // Вопросы 2 и 9 в Beck связаны с суицидальными мыслями
      const pessimismScore = beckResult.responses[1]; // Пессимизм
      const suicidalScore = beckResult.responses[8]; // Суицидальные мысли
      if (suicidalScore > 1 || (pessimismScore > 2 && beckResult.severity === 'severe')) {
        return true;
      }
    }

    // Проверяем общую тяжесть депрессии
    const hasSevereDepression = completedTests.some(test => 
      (test.testId === 'phq9' || test.testId === 'beck' || test.testId === 'hamilton-depression') && 
      test.severity === 'severe'
    );

    return hasSevereDepression;
  };

  const getSmartRecommendations = (): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];
    
    // Получаем ID уже пройденных тестов
    const completedTestIds = completedTests.map(t => t.testId);
    
    // Анализируем завершенные тесты для определения приоритетов
    const scl90rResult = completedTests.find(t => t.testId === 'scl90r');
    const phq9Result = completedTests.find(t => t.testId === 'phq9');
    const gad7Result = completedTests.find(t => t.testId === 'gad7');
    const beckResult = completedTests.find(t => t.testId === 'beck');
    const hadsResult = completedTests.find(t => t.testId === 'hads');
    const staiResult = completedTests.find(t => t.testId === 'stai');
    const hamiltonDepResult = completedTests.find(t => t.testId === 'hamilton-depression');
    const hamiltonAnxResult = completedTests.find(t => t.testId === 'hamilton-anxiety');
    const bhsResult = completedTests.find(t => t.testId === 'bhs');
    const baiResult = completedTests.find(t => t.testId === 'bai');
    const dasResult = completedTests.find(t => t.testId === 'das');
    const copingResult = completedTests.find(t => t.testId === 'coping-strategies');
    
    // КРИТИЧЕСКИЙ ПРИОРИТЕТ: Проверка суицидального риска
    const hasSuicidalThoughts = checkForSuicidalRisk();
    if (hasSuicidalThoughts && !completedTestIds.includes('suicide-risk')) {
      recommendations.unshift({ // Добавляем в начало списка
        testId: 'suicide-risk',
        reason: '🚨 ЭКСТРЕННО: Выявлены признаки суицидального риска',
        priority: 'critical'
      });
    }
    
    // ===== СВЯЗКА 1: ОБЩАЯ ОЦЕНКА ПСИХИЧЕСКОГО СОСТОЯНИЯ =====
    // SCL-90-R + HADS (как в научной литературе)
    if (completedTests.length === 0) {
      // Начинаем с SCL-90-R для широкого скрининга по 9 шкалам
      recommendations.push({
        testId: 'scl90r',
        reason: '📋 Широкий скрининг психического состояния (SCL-90-R)',
        priority: 'high'
      });
    } else if (scl90rResult && !hadsResult && !completedTestIds.includes('hads')) {
      // SCL-90-R показал проблемы → HADS для дифференциации тревоги и депрессии
      const hasDepressionAnxiety = (scl90rResult as any).subscaleScores && 
        ((scl90rResult as any).subscaleScores.depression > 8 || 
         (scl90rResult as any).subscaleScores.anxiety > 8);
      
      if (hasDepressionAnxiety || scl90rResult.severity !== 'normal') {
        recommendations.push({
          testId: 'hads',
          reason: '🎯 Дифференциация тревоги и депрессии по результатам SCL-90-R',
          priority: 'high'
        });
      }
    }
    
    // ===== СВЯЗКА 2: УГЛУБЛЕННАЯ ДИАГНОСТИКА ДЕПРЕССИИ + СУИЦИДАЛЬНЫЙ РИСК =====
    // SCL-90-R/HADS → BDI-II + BHS + Suicide Risk (как в научной литературе)
    
    // Проверяем наличие депрессивной симптоматики
    const hasDepressionSymptoms = scl90rResult && (scl90rResult as any).subscaleScores && 
      (scl90rResult as any).subscaleScores.depression > 8;
    const hadsDepression = hadsResult && hadsResult.severity !== 'normal';
    const phq9Depression = phq9Result && phq9Result.severity !== 'normal';
    
    if ((hasDepressionSymptoms || hadsDepression || phq9Depression) && !beckResult && !completedTestIds.includes('beck')) {
      recommendations.push({
        testId: 'beck',
        reason: '🔍 Детальная оценка депрессии (BDI-II) по результатам скрининга',
        priority: scl90rResult?.severity === 'severe' || hadsResult?.severity === 'severe' ? 'high' : 'medium'
      });
    }

    // Beck → BHS (ключевой предиктор суицида)
    if (beckResult && beckResult.severity !== 'normal' && !bhsResult && !completedTestIds.includes('bhs')) {
      recommendations.push({
        testId: 'bhs',
        reason: '🚨 Оценка безнадежности - ключевой предиктор суицидального риска',
        priority: beckResult.severity === 'severe' ? 'critical' : 'high'
      });
    }

    // BHS → Suicide Risk (если высокая безнадежность)
    if (bhsResult && (bhsResult.severity === 'severe' || bhsResult.severity === 'moderate') && 
        !completedTestIds.includes('suicide-risk')) {
      recommendations.push({
        testId: 'suicide-risk',
        reason: '🚨 КРИТИЧНО: Высокая безнадежность требует прямой оценки суицидального риска',
        priority: 'critical'
      });
    }

    // ===== СВЯЗКА 3: ДИАГНОСТИКА ТРЕВОГИ =====
    // SCL-90-R/HADS → STAI + BAI + Hamilton (как в научной литературе)
    
    // Проверяем наличие тревожной симптоматики
    const hasAnxietySymptoms = scl90rResult && (scl90rResult as any).subscaleScores && 
      (scl90rResult as any).subscaleScores.anxiety > 8;
    const hadsAnxiety = hadsResult && hadsResult.severity !== 'normal';
    const gad7Anxiety = gad7Result && gad7Result.severity !== 'normal';
    
    if (hasAnxietySymptoms || hadsAnxiety || gad7Anxiety) {
      // → STAI (разделение состояние/черта)
      if (!staiResult && !completedTestIds.includes('stai')) {
        recommendations.push({
          testId: 'stai',
          reason: '📊 Дифференциация ситуативной и личностной тревожности (STAI)',
          priority: scl90rResult?.severity === 'severe' || hadsResult?.severity === 'severe' ? 'high' : 'medium'
        });
      }
      
      // → BAI (соматические симптомы тревоги)
      if (!baiResult && !completedTestIds.includes('bai')) {
        recommendations.push({
          testId: 'bai',
          reason: '💓 Оценка соматических проявлений тревоги (BAI)',
          priority: scl90rResult?.severity === 'severe' || hadsResult?.severity === 'severe' ? 'high' : 'medium'
        });
      }
    }

    // STAI → Hamilton Anxiety (если высокая личностная тревожность)
    if (staiResult && staiResult.severity !== 'normal' && 
        !hamiltonAnxResult && !completedTestIds.includes('hamilton-anxiety')) {
      recommendations.push({
        testId: 'hamilton-anxiety',
        reason: '⚕️ Клиническая оценка тревожного расстройства по результатам STAI',
        priority: staiResult.severity === 'severe' ? 'high' : 'medium'
      });
    }

    // BAI → Hamilton/PDSS (если высокие соматические симптомы)
    if (baiResult && baiResult.severity !== 'normal' && 
        !hamiltonAnxResult && !completedTestIds.includes('hamilton-anxiety')) {
      recommendations.push({
        testId: 'hamilton-anxiety',
        reason: '⚕��� Углубленная оценка тревоги с соматическими проявлениями',
        priority: baiResult.severity === 'severe' ? 'high' : 'medium'
      });
    }

    // Beck → Hamilton Depression (клиническая оценка)
    if (beckResult && beckResult.severity !== 'normal' && 
        !hamiltonDepResult && !completedTestIds.includes('hamilton-depression')) {
      recommendations.push({
        testId: 'hamilton-depression',
        reason: '⚕️ Клиническая оценка депрессии по результатам BDI-II',
        priority: beckResult.severity === 'severe' ? 'high' : 'medium'
      });
    }
    
    // ===== СВЯЗКА 4: ЭМОЦИОНАЛЬНАЯ СФЕРА + ЛИЧНОСТНЫЕ ОСОБЕННОСТИ =====
    // BDI/HADS + личностные тесты (в нашем случае используем имеющиеся)
    const hasDepressiveSymptoms = phq9Result?.severity !== 'normal' || beckResult?.severity !== 'normal' || 
                                 hadsResult?.severity !== 'normal';
    
    // ===== СВЯЗКА 5: КОГНИТИВНЫЕ ИСКАЖЕНИЯ + КОПИНГ-СТРАТЕГИИ =====
    // BHS + DAS + COPE (как в научной литературе)
    
    // При высокой безнадежности → DAS (когнитивные установки)
    if (bhsResult && bhsResult.severity !== 'normal' && !dasResult && !completedTestIds.includes('das')) {
      recommendations.push({
        testId: 'das',
        reason: '🧠 Оценка дисфункциональных установок при высокой безнадежности',
        priority: bhsResult.severity === 'severe' ? 'high' : 'medium'
      });
    }

    // При депрессии без безнадежности → DAS (профилактика)
    if (hasDepressiveSymptoms && !bhsResult && !dasResult && !completedTestIds.includes('das')) {
      recommendations.push({
        testId: 'das',
        reason: '🧠 Оценка когнитивных факторов уязвимости к депрессии',
        priority: 'medium'
      });
    }

    // DAS + проблемы → Копинг-стратегии
    const hasAnySymptoms = hasDepressiveSymptoms || gad7Result?.severity !== 'normal' || 
                          staiResult?.severity !== 'normal' || hamiltonAnxResult?.severity !== 'normal';
    
    if ((dasResult?.severity !== 'normal' || hasAnySymptoms) && !copingResult && !completedTestIds.includes('coping-strategies')) {
      recommendations.push({
        testId: 'coping-strategies',
        reason: '🛠️ Оценка стратегий совладания (связь с когнитивными установками)',
        priority: 'medium'
      });
    }
    
    // ===== ДОПОЛНИТЕЛЬНЫЕ ОЦЕНКИ =====
    // Когнитивная оценка при множественных проблемах или у пожилых
    if (completedTests.length >= 4) {
      const hasMultipleProblems = hasDepressiveSymptoms && 
                                 (gad7Result?.severity !== 'normal' || staiResult?.severity !== 'normal');
      
      if (!completedTestIds.includes('mmse') && hasMultipleProblems) {
        recommendations.push({
          testId: 'mmse',
          reason: '🧠 Когнитивная оценка при комплексных эмоциональных расстройствах',
          priority: 'medium'
        });
      }
      
      // Качество жизни для полной картины (после основных связок)
      if (!completedTestIds.includes('quality-life') && completedTests.length >= 6) {
        recommendations.push({
          testId: 'quality-life',
          reason: '🌟 Комплексная оценка влияния выявленных проблем на жизнь',
          priority: 'low'
        });
      }
    }
    
    return recommendations.slice(0, 3); // Показываем максимум 3 рекомендации
  };

  const onTestComplete = (testId: string, score: number, severity: 'normal' | 'mild' | 'moderate' | 'severe', aiAnalysis?: string, recommendations?: string[], rawResults?: any) => {
    const localResult: LocalTestResult = {
      testId,
      score,
      severity,
      timestamp: Date.now()
    };
    
    setCompletedTests(prev => [...prev, localResult]);
    setLastCompletedTest(localResult);
    setCurrentTest(null);
    setViewState('results'); // Переходим к показу результатов с рекомендациями

    // Сохраняем результат в общую систему
    const testInfo = allTests.find(t => t.id === testId);
    if (testInfo && user) {
      const testResult: Omit<TestResult, 'id' | 'date' | 'patientId'> = {
        patientName: user.name,
        accessCode,
        testType: testInfo.title,
        score,
        severity,
        aiAnalysis: aiAnalysis || `Результат теста "${testInfo.title}": ${score} баллов. Степень выраженности: ${severity === 'normal' ? 'норма' : severity === 'mild' ? 'легкая' : severity === 'moderate' ? 'умеренная' : 'тяжелая'}.`,
        recommendations: recommendations || [
          'Результаты переданы вашему врачу для анализа',
          'Ожидайте персонализированные рекомендации',
          'При необходимости будут назначены дополнительные тесты'
        ],
        rawResults
      };
      
      onSaveTestResult(testResult);
    }

    // Определяем текущую фазу тестирования
    if (completedTests.length + 1 >= 3 && currentPhase === 'initial') {
      setCurrentPhase('adaptive');
      setPhaseJustChanged('Переход на этап 2: ИИ активирует умные рекомендации!');
      setTimeout(() => setPhaseJustChanged(null), 5000);
    } else if (completedTests.length + 1 >= 5 && currentPhase === 'adaptive') {
      setCurrentPhase('comprehensive');
      setPhaseJustChanged('Переход на этап 3: Комплексная оценка активирована!');
      setTimeout(() => setPhaseJustChanged(null), 5000);
    }
  };

  const onSelectRecommendedTest = (testId: string) => {
    setCurrentTest(testId as TestType);
    setViewState('test');
  };

  const onFinishSession = () => {
    setViewState('dashboard');
    setLastCompletedTest(null);
  };

  const renderTest = () => {
    switch (currentTest) {
      case 'beck':
        return <BeckDepressionInventory onComplete={(result) => onTestComplete('beck', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'gad7':
        return <GAD7Test onComplete={(result) => onTestComplete('gad7', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'phq9':
        return <PHQ9Test onComplete={(result) => onTestComplete('phq9', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'mmse':
        return <MMSETest onComplete={(result) => onTestComplete('mmse', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'hamilton-depression':
        return <HamiltonDepressionTest onComplete={(result) => onTestComplete('hamilton-depression', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'hamilton-anxiety':
        return <HamiltonAnxietyTest onComplete={(result) => onTestComplete('hamilton-anxiety', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'stai':
        return <STAITest onComplete={(result) => onTestComplete('stai', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'quality-life':
        return <QualityOfLifeTest onComplete={(result) => onTestComplete('quality-life', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'suicide-risk':
        return <SuicideRiskAssessment onComplete={(result) => onTestComplete('suicide-risk', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'hads':
        return <HADSTest onComplete={(result) => onTestComplete('hads', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'coping-strategies':
        return <CopingStrategiesTest onComplete={(result) => onTestComplete('coping-strategies', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'bhs':
        return <BeckHopelessnessScale onComplete={(result) => onTestComplete('bhs', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'bai':
        return <BeckAnxietyInventory onComplete={(result) => onTestComplete('bai', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'das':
        return <DysfunctionalAttitudeScale onComplete={(result) => onTestComplete('das', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      case 'scl90r':
        return <SCL90RTest onComplete={(result) => onTestComplete('scl90r', result.totalScore, result.severity, result.aiAnalysis, result.recommendations, result)} onBack={() => { setCurrentTest(null); setViewState('dashboard'); }} />;
      default:
        return null;
    }
  };

  // Show test interface
  if (viewState === 'test' && currentTest) {
    return renderTest();
  }

  // Show results with AI recommendations
  if (viewState === 'results' && lastCompletedTest) {
    const recommendations = getSmartRecommendations();
    return (
      <TestResultsWithRecommendations
        completedTest={lastCompletedTest}
        recommendations={recommendations}
        allTests={allTests}
        onSelectTest={onSelectRecommendedTest}
        onFinishSession={onFinishSession}
        completedTestsCount={completedTests.length}
      />
    );
  }

  const recommendations = getSmartRecommendations();
  const recommendedTestIds = recommendations.map(r => r.testId);
  
  // Определяем доступные тесты: базовые + рекомендованные ИИ
  const baseAvailableTests = currentPhase === 'initial' ? initialTests : allTests;
  const recommendedTests = allTests.filter(test => recommendedTestIds.includes(test.id));
  
  // Объединяем базовые тесты с рекомендованными (исключаем дубли)
  const availableTests = [
    ...baseAvailableTests,
    ...recommendedTests.filter(recTest => !baseAvailableTests.find(baseTest => baseTest.id === recTest.id))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Умное психологическое тестирование</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Пациент: <span className="font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Выйти
              </Button>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Прогресс тестирования</h2>
              <Badge className="bg-blue-100 text-blue-800">
                {currentPhase === 'initial' && 'Базовая диагностика'}
                {currentPhase === 'adaptive' && 'Адаптивная диагностика'}
                {currentPhase === 'comprehensive' && 'Полная оценка'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className={`text-center p-3 rounded-lg ${currentPhase === 'initial' ? 'bg-blue-200 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                <div className="text-sm font-medium">Этап 1</div>
                <div className="text-xs">Базовая диагностика (0-2 теста)</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${currentPhase === 'adaptive' ? 'bg-blue-200 text-blue-800' : currentPhase === 'comprehensive' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="text-sm font-medium">Этап 2</div>
                <div className="text-xs">ИИ-рекомендации (3-4 теста)</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${currentPhase === 'comprehensive' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="text-sm font-medium">Этап 3</div>
                <div className="text-xs">Полная оценка (5+ тестов)</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Пройдено тестов: {completedTests.length} из {initialTests.length}</span>
                <span>{Math.round((completedTests.length / initialTests.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTests.length / initialTests.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Полный охват всех позиций психического статуса • 
              {currentPhase === 'initial' && 'Начальная фаза диагностики'}
              {currentPhase === 'adaptive' && 'Умные рекомендации активны'}
              {currentPhase === 'comprehensive' && 'Комплексная оценка в процессе'}
            </div>
          </CardContent>
        </Card>

        {/* Phase Change Notification */}
        {phaseJustChanged && (
          <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-bounce"></div>
                <div className="text-green-800 font-medium">{phaseJustChanged}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardHeader>
              <div className="flex items-center">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                <CardTitle className="text-orange-900">ИИ-рекомендации</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800 mb-4">
                На основе ваших результатов, ИИ рекомендует приоритетные тесты для углубленной диагностики:
              </p>
              <div className="space-y-3">
                {recommendations.map((rec, index) => {
                  const test = allTests.find(t => t.id === rec.testId);
                  if (!test) return null;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-orange-200">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          rec.priority === 'critical' ? 'bg-red-600 animate-pulse' :
                          rec.priority === 'high' ? 'bg-red-500' : 
                          rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-gray-900">{test.title}</div>
                          <div className="text-sm text-gray-600">{rec.reason}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        rec.priority === 'critical' ? 'border-red-500 text-red-800 bg-red-100 animate-pulse' :
                        rec.priority === 'high' ? 'border-red-300 text-red-700' :
                        rec.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                        'border-green-300 text-green-700'
                      }>
                        {rec.priority === 'critical' ? '🚨 КРИТИЧЕСКИЙ' :
                         rec.priority === 'high' ? 'Высокий' : 
                         rec.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Tests */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {availableTests.map((test) => {
            const IconComponent = test.icon;
            const isCompleted = completedTests.some(t => t.testId === test.id);
            const isRecommended = recommendedTestIds.includes(test.id);
            const recommendation = recommendations.find(r => r.testId === test.id);
            
            return (
              <Card 
                key={test.id} 
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                  isCompleted ? 'bg-green-50 border-green-200' : 
                  isRecommended ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-md' :
                  'bg-white border-gray-200'
                }`}
                onClick={() => { 
                  setCurrentTest(test.id as TestType);
                  setViewState('test');
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl ${test.color} flex items-center justify-center mr-3`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base leading-tight">{test.title}</CardTitle>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant="outline" className="text-xs">{test.category}</Badge>
                          {isCompleted && <Badge className="bg-green-100 text-green-800 text-xs">Пройден</Badge>}
                          {isRecommended && !isCompleted && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              ИИ-рекомендация
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {isRecommended && recommendation && (
                      <div className={`w-3 h-3 rounded-full ${
                        recommendation.priority === 'high' ? 'bg-red-500' : 
                        recommendation.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{test.description}</p>
                  
                  {isRecommended && recommendation && (
                    <div className="bg-orange-100 p-3 rounded-lg mb-4 border border-orange-200">
                      <div className="text-xs text-orange-800 font-medium mb-1">Причина рекомендации:</div>
                      <div className="text-xs text-orange-700">{recommendation.reason}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {test.duration}
                    </div>
                    <Button 
                      variant={isRecommended ? "default" : isCompleted ? "outline" : "secondary"}
                      size="sm"
                      className={isRecommended ? "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700" : ""}
                      onClick={(e) => {
                        e.stopPropagation(); // Предотвращаем всплывание к Card
                        setCurrentTest(test.id as TestType);
                        setViewState('test');
                      }}
                    >
                      {isCompleted ? 'Пройти повторно' : 'Начать тест'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completed Tests Summary */}
        {completedTests.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <CardTitle className="text-green-900">Пр��йденные тесты</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedTests.map((result, index) => {
                  const test = allTests.find(t => t.id === result.testId);
                  if (!test) return null;
                  
                  return (
                    <div key={index} className="bg-white/80 p-4 rounded-lg border border-green-200">
                      <div className="font-medium text-gray-900 mb-1">{test.title}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Балл: {result.score}</span>
                        <Badge className={
                          result.severity === 'severe' ? 'bg-red-100 text-red-800' :
                          result.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          result.severity === 'mild' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {result.severity === 'severe' ? 'Тяжелая' :
                           result.severity === 'moderate' ? 'Умеренная' :
                           result.severity === 'mild' ? 'Легкая' :
                           'Норма'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-green-700 mt-4">
                Все результаты автоматически отправлены вашему врачу для анализа и получения персонализированных рекомендаций.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}