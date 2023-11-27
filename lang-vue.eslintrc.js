module.exports = {
    extends: [
        'plugin:vue/recommended'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        'vue/no-side-effects-in-computed-properties': 'off',
        'vue/no-deprecated-v-on-native-modifier': 'off',
        'vue/no-v-model-argument': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-multiple-template-root': 'off',
        'vue/no-v-html': 'off',
        'vue/max-attributes-per-line': [2, {
            singleline: 100,
        }],
        'vue/require-default-prop': 0,
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/name-property-casing': ['off'],
        'vue/html-indent': [2, 4],
        'vue/valid-template-root': [0],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                normal: 'always',
                component: 'always'
            },
            svg: 'always',
            math: 'always'
        }],
        'vue/arrow-spacing': [2, {
            before: true,
            after: true
        }],
        'vue/eqeqeq': [2, 'allow-null'],
        'vue/key-spacing': [2, {
            beforeColon: false,
            afterColon: true
        }],
        'vue/space-infix-ops': [2, { int32Hint: false }],
        'vue/space-unary-ops': [2, {
            words: true,
            nonwords: false
        }],
        'vue/object-curly-spacing': [2, 'always', {
            objectsInObjects: false
        }],
        'vue/array-bracket-spacing': [2, 'never'],
    }
}
