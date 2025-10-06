import { useState, useEffect } from 'react';
import { Mail, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { emailService } from '../services/emailService';

interface EmailConfigStatusProps {
  className?: string;
}

export function EmailConfigStatus({ className = '' }: EmailConfigStatusProps) {
  const [config, setConfig] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; error?: string } | null>(null);

  useEffect(() => {
    const configStatus = emailService.checkConfiguration();
    setConfig(configStatus);
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await emailService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
      });
    } finally {
      setTesting(false);
    }
  };

  if (!config) return null;

  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          config.isValid 
            ? 'bg-green-100 text-green-600' 
            : 'bg-amber-100 text-amber-600'
        }`}>
          {config.isValid ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Email Configuration
          </h4>
          
          <p className="text-sm text-gray-600 mb-3">
            {config.message}
          </p>

          {/* Configuration Details */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Service ID:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-mono ${
                  config.details.serviceId === 'demo' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {config.details.serviceId}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Template ID:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-mono ${
                  config.details.templateId === 'demo' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {config.details.templateId}
                </span>
              </div>
              <div>
                <span className="text-gray-500">User ID:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-mono ${
                  config.details.userId === 'demo' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {config.details.userId}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Environment:</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                  {config.details.environment}
                </span>
              </div>
            </div>
          </div>

          {/* Test Connection */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleTestConnection}
              disabled={testing}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {testing ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Тестирование...
                </div>
              ) : (
                <>
                  <Mail className="h-3 w-3 mr-1" />
                  Тест подключения
                </>
              )}
            </Button>

            {!config.isValid && (
              <a
                href="/DEPLOYMENT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
              >
                <Settings className="h-3 w-3 mr-1" />
                Настроить
              </a>
            )}
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`mt-3 p-2 rounded-lg text-xs ${
              testResult.success 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {testResult.success ? (
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Подключение успешно
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Ошибка подключения
                  </div>
                  {testResult.error && (
                    <div className="text-xs text-red-600 font-mono">
                      {testResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          {!config.isValid && (
            <div className="mt-3 text-xs text-gray-500">
              💡 Для реальной отправки email настройте EmailJS на{' '}
              <a 
                href="https://emailjs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                emailjs.com
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}