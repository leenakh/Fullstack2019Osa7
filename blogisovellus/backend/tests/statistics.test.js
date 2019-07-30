const statistics = require('../utils/statistics')

const blogit = [
    {
        'title': 'Kissafani',
        'author': 'Katti Matikainen',
        'url': 'http://katti.fi',
        'likes': 989
    },
    {
        'title': 'Koirafani',
        'author': 'Nakkirakki',
        'url': 'http://hauva.fi',
        'likes': 986
    }
]

test('dummy returns one', () => {
    const blogs = []

    const result = statistics.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('totalLikes returns sum of likes', () => {
        const result = statistics.totalLikes(blogit)
        expect(result).toBe(1975)
    })

    test('sum of likes when one blog on list', () => {
        const blog = [
            {
                'title': 'Kissafani',
                'author': 'Katti Matikainen',
                'url': 'http://katti.fi',
                'likes': 989
            }]
        const result = statistics.totalLikes(blog)
        expect(result).toBe(989)
    })

    test('sum of likes when blog list empty', () => {
        const blogs = []
        const result = statistics.totalLikes(blogs)
        expect(result).toBe(0)
    })
})
