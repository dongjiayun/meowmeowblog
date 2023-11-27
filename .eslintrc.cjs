/* eslint-env node */
module.exports = {
    root: true,
    env: {
        "node": true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        './lang-js.eslintrc.js',
        './lang-vue.eslintrc.js'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    "rules": {
        "indent": [
            2,
            4,
            {
                "SwitchCase": 1
            }
        ]
    }
}
