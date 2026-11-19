export const CONFIG = {
  brand: {
    name: 'Rei do Copo',
    tagline: 'Leve sua marca até onde você não imagina.',
    subtitle: 'Ecopos resistentes e totalmente personalizados. Sua identidade na mão de cada convidado, em cada festa, em cada lugar.',
    experienceBadge: '+10 anos de mercado',
  },
  whatsapp: {
    phone: '5511999999999',
    formatQuoteMessage: (items: { name: string; quantity: number }[]) => {
      if (items.length === 0) {
        return 'Olá! Gostaria de falar com um consultor sobre ecopos personalizados para o meu evento.';
      }
      const itemsList = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
      return `Olá! Quero cotar: ${itemsList}. Pode me ajudar?`;
    },
    getWhatsAppUrl: (items: { name: string; quantity: number }[]) => {
      const msg = CONFIG.whatsapp.formatQuoteMessage(items);
      return `https://wa.me/${CONFIG.whatsapp.phone}?text=${encodeURIComponent(msg)}`;
    }
  },
  navigation: [
    { label: 'Processo', href: '#storytelling' },
    { label: 'Impacto', href: '#impacto' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'FAQ', href: '#faq' },
  ]
};
