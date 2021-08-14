const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的 
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
//           aa  =   "  xxx "  | '  xxxx '  | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'
const startTagClose = /^\s*(\/?)>/; //     />   <div/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

//  <div id="app">{{ msg }}</div>

/**
 * 处理开始标签的token
 * @param {*} tagName 
 * @param {*} attributes 
 */
function start(tagName, attributes) {
    console.log('开始标签', tagName, attributes)
}

function char(text) {
    console.log('文本', text)
}

function end(tagName) { // 处理结束标签
    console.log('结束标签', tagName)
}

function parserHTML(html) {

    function advance(len) {
        html = html.substring(len);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attributes: []
            }
            //删除匹配成功的部分
            advance(start[0].length);

            //下一步，匹配属性
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {

                match.attributes.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length);
            }
            advance(end[0].length); //删除开始标签的 >
            return match;
        }

        return false;
    }




    while (html) {//有html继续解析

        let textEnd = html.indexOf('<');
        if (textEnd === 0) {//step one 开始标签
            let startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attributes)

            }



            let endTagMatch = html.match(endTag); // step three 结束标签
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length);

            }


        }

        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length)
            char(text)
        }

    }
}


export default function (template) {
    parserHTML(template)
}