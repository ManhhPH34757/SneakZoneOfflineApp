import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appThousandSeparator]'
})
export class ThousandSeparatorDirective {

  constructor(private el: ElementRef) { }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.el.nativeElement.value = value.replace(/\./g, '').replace(/,/g, '');
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    const formattedValue = this.formatNumber(value);
    this.el.nativeElement.value = formattedValue;

    if (formattedValue) {
      const parsedValue = this.parseFormattedNumber(formattedValue);
      this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      this.el.nativeElement.value = formattedValue;
    }
  }

  private formatNumber(value: string): string {
    const num = parseFloat(value.replace(/,/g, '').replace(/\./g, '.'));
    if (isNaN(num)) return value;

    return num.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  private parseFormattedNumber(value: string): number {
    return parseFloat(value.replace(/,/g, '').replace(/\./g, ''));
  }
}
