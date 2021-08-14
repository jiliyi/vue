import babel from 'rollup-plugin-babel';
module.exports = {
    input : './src/index.js',
    output : {
        format : 'umd',
        name : 'Vue',//最终导出的结果 , window.Vue可以访问到
        file : 'dist/vue.js',
        sourcemap : "true"
    },
    plugins:[
        babel({
            exclude: 'node_modules/**'
        })
    ]
}