export const personalInfo = {
  name: 'Axel Socobos',
  title: '3rd Year Information Technology Student',
  bio: 'Aspiring developer who loves building innovative and meaningful solutions through code. Always learning, always improving.',
  email: 'axelsocobos12@gmail.com',
  phone: '0994095075',
  location: 'Philippines',
  github: 'https://github.com/Axlexl',
  messenger: 'https://www.messenger.com/e2ee/t/9923001771077896',
  facebook: 'https://www.facebook.com/axel.socobos',
  instagram: 'https://www.instagram.com/axeee0606',
  linkedin: '',
  quote: "Code is not just what I write, it's how I solve problems.",
}

export const projects = [
  {
    id: 1,
    title: 'EXPAND',
    description: 'EXPAND is an online store that sells high-quality, high-end headphones for music lovers, gamers, and professionals. We offer premium sound, stylish designs, and a simple shopping experience to help you find the perfect headphones.',
    image: '🎧',
    thumbnail: '/expand.jpg',
    tags: ['React.js', 'Next.js', 'Tailwind CSS', 'MySQL'],
    category: 'Web',
    github: 'https://github.com/Axlexl/expand2',
    demo: 'https://youtu.be/DvqNj-QTplc',
    featured: true,
  },
  {
    id: 2,
    title: 'LAY Instruments',
    description: 'LAY Instrument is an online store that offers high-quality musical instruments for beginners and professionals. We provide reliable products at great value to help you enjoy playing and creating music.',
    image: '🎸',
    thumbnail: '/lay.jpg',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'Web',
    github: 'https://github.com/Axlexl/LAY-INSTRUMENTS',
    demo: 'https://youtu.be/2eVTKFG5csY',
    featured: true,
  },
  {
    id: 3,
    title: 'WorkSystem',
    description: 'WorkSystem helps clients build a house without paying the full cost at once. It manages daily worker payments, calculates weekly salaries, and tracks expenses for both labor and construction materials.',
    image: '🏗️',
    thumbnail: '/worksystem.jpg',
    tags: ['Electron', 'Node.js', 'MySQL'],
    category: 'Desktop',
    github: 'https://github.com/Axlexl/worksystem',
    demo: 'https://youtu.be/5HqkFvvos-s',
    featured: true,
  },
  {
    id: 4,
    title: 'AllDayFade',
    description: 'AllDayFad is an online booking platform for AllDayFade Barbershop, making it easy for customers to schedule appointments. It offers a simple and convenient way to book high-quality haircut services.',
    image: '💈',
    thumbnail: '/adf.jpg',
    tags: ['Expo', 'Node.js', 'Firebase'],
    category: 'Mobile',
    github: 'https://github.com/Axlexl/adf',
    demo: '/adf.mp4',
    featured: true,
  },
]

export const skills = [
  {
    category: 'Frontend',
    color: '#6c63ff',
    items: [
      { name: 'React.js',     level: 85 },
      { name: 'HTML & CSS',   level: 90 },
      { name: 'JavaScript',   level: 82 },
      { name: 'Tailwind CSS', level: 80 },
      { name: 'Vite',         level: 78 },
    ],
  },
  {
    category: 'Mobile',
    color: '#a78bfa',
    items: [
      { name: 'React Native Expo', level: 75 },
      { name: 'Kotlin',            level: 60 },
      { name: 'Java (Android)',    level: 65 },
    ],
  },
  {
    category: 'Backend',
    color: '#34d399',
    items: [
      { name: 'Node.js',    level: 78 },
      { name: 'Express.js', level: 75 },
      { name: 'MySQL',      level: 80 },
    ],
  },
  {
    category: 'Desktop',
    color: '#f59e0b',
    items: [
      { name: 'Electron', level: 70 },
      { name: 'C#',       level: 65 },
      { name: 'C++',      level: 60 },
    ],
  },
]

export const experience = [
  {
    id: 1,
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    period: '2023 – Present',
    description: 'Building custom web and desktop applications for clients. Developed EXPAND (headphone store), LAY Instruments (music store), and WorkSystem (construction management).',
    tags: ['React.js', 'Next.js', 'Node.js', 'MySQL', 'Tailwind CSS', 'Electron'],
  },
]

export const education = [
  {
    id: 1,
    degree: 'Bachelor of Science in Information Technology',
    school: 'Holy Cross of Davao College, Inc.',
    period: '2024 – Present',
    description: 'Currently pursuing BSIT with focus on software development, web technologies, and mobile computing.',
    badge: 'Current',
  },
  {
    id: 2,
    degree: 'Senior High School – ABM Strand',
    school: 'Holy Cross Bunawan, Inc.',
    period: '2023 – 2024',
    description: 'Accountancy, Business, and Management strand. Developed strong foundations in business and analytical thinking.',
  },
  {
    id: 3,
    degree: 'Junior High School',
    school: 'Holy Cross Bunawan, Inc.',
    period: '2018 – 2022',
    description: 'Completed junior high school with a strong academic record.',
  },
  {
    id: 4,
    degree: 'Elementary',
    school: 'Daniel M. Perez Central Elementary School',
    period: '2012 – 2018',
    description: 'Completed elementary education with honors.',
  },
]
