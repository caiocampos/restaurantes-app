export class AppHelper {
  static parseToLowerNormalized(text: string) {
    return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
