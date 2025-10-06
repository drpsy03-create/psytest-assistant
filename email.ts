// Конфигурация для EmailJS
export const EMAIL_CONFIG = {
  // Демо-настройки (замените на реальные при развертывании)
  SERVICE_ID: 'service_psytest',
  TEMPLATE_ID: 'template_verification', 
  USER_ID: 'your_user_id',
  
  // Проверка настроек
  isConfigured(): boolean {
    return this.SERVICE_ID !== 'service_psytest' && 
           this.TEMPLATE_ID !== 'template_verification' && 
           this.USER_ID !== 'your_user_id';
  },
  
  // Получить статус конфигурации
  getStatus(): { configured: boolean; message: string } {
    if (this.isConfigured()) {
      return {
        configured: true,
        message: '✅ EmailJS настроен и готов к использованию'
      };
    }
    
    return {
      configured: false,
      message: '⚠️ EmailJS использует демо-настройки. Для реальной отправки email настройте конфигурацию в /services/emailService.ts'
    };
  }
};

// Реэкспорт утилит для совместимости
export { getEnvVar, getEnvironmentInfo } from '../utils/envUtils';