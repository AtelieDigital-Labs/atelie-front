// Formatação de CPF: 000.000.000-00
export function formatCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

// Formatação de telefone: (00) 00000-0000
export function formatPhone(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

// Formatação de CEP: 00000-000
export function formatCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
}

// Formatação de data: 00/00/0000
export function formatDate(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d+?$/, '$1')
}

// Remove formatação (útil antes de enviar para API)
export function unformatCPF(value: string): string {
  return value.replace(/\D/g, '')
}

export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '')
}

export function unformatCEP(value: string): string {
  return value.replace(/\D/g, '')
}