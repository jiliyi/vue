import parserHTML from './parser';
import generate from './generate';
export default function (template) {

    let root = parserHTML(template);

    let code = generate(root);

    return new Function(`with(this){return ${code}}`) // 模板引擎
}