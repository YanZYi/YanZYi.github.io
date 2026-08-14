export interface PostMeta {
  title: string
  slug: string
  date: string
  author?: string
  read?: string
  tags?: string[]
  excerpt?: string
}

export const siteConfig = {
  name: 'Yan Home',
  title: 'Yan Home | 博客',
  author: '严正易',
  subtitle: '全栈开发 · 创意技术 · 算法设计',
  bio: '把复杂的设计转化为优雅的代码，将复杂的功能需求转化为简洁的算法实现。在这里记录学习笔记与技术思考。',
  avatar: '/image/head.jpg',
  location: '中国 · 无锡',
  email: 'yanzhyii@outlook.com',
  baseDomain: 'https://github.com/YanZYi',
  social: {
    github: 'https://github.com/YanZYi',
    linkedin: '#',
    twitter: '#',
    email: 'mailto:yanzhyii@outlook.com'
  },
  skills: [
    'HTML5 / CSS3',
    'JavaScript (ES6+)',
    'C/C++',
    'Python',
    'Agent Engineer',
    '算法设计',
    '性能优化'
  ],
  buildYear: 2026
} as const
