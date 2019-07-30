const blogs = [
  {
    'title': 'Testi',
    'author': 'Testaaja',
    'url': 'http://testi',
    'likes': 4,
    'user':
    {
      'username': 'LeenaH',
      'name': 'Leena',
      'id': '5d1621dabad893170cfd07d5'
    },
    'username': 'LeenaH',
    'id': '5d19fd9955f98d3b346d2931'
  },
  {
    'title': 'Toinen testi',
    'author': 'Toinen Testaaja',
    'url': 'http://toinentesti',
    'likes': 2,
    'user':
    {
      'username': 'ekavekara',
      'name': 'Eka Vekara',
      'id': '5d1b27b4eb6af6081c086185'
    },
    'username': 'ekavekara',
    'id': '5d1b28a0eb6af6081c086186'
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll }