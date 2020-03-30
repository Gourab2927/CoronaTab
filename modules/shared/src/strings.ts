import dasherize from 'dasherize'

export class Strings extends String {
  static dasherize (str: string): string {
    // tslint:disable-next-line:ter-no-irregular-whitespace
    return str.replace(/,|\./g, '').replace(/ | /g, '-').toLowerCase()
  }

  static capitalize (s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}
