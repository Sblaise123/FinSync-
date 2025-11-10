export const formatCurrency = (v) => `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
export const formatDate = (d) => d ? new Date(d).toLocaleDateString() : ''
export const formatDateTime = (d) => d ? new Date(d).toLocaleString() : ''