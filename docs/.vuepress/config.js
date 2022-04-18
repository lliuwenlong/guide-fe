const path = require('path');
const getFileNames = require('../../scripts/getFileNames');

module.exports = {
    title: 'FE-GUIDE',
    themeConfig: {
        nav: [
            {
                text: '规范实践',
                link: '/standard/index'
            },
            {
                text: '小记总结',
                link: '/blog/asynchronous'
            }
        ],
        sidebar: {
            '/standard/': [
                {
                    title: '规范实践',
                    collapsable: true,
                    children: getFileNames(path.resolve(__dirname, '../standard'), ['index.md'])
                }
            ],
            '/blog/': [
                {
                    title: '小记总结',
                    collapsable: true,
                    children: getFileNames(path.resolve(__dirname, '../blog'), ['best-practice-plan', 'README.md'])
                }
            ]
        }
    },
}