const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

function genAttr(attributes) {
    let str = '';
    for (const attr of attributes) {

        if (attr.name === 'style') {

            let styleObj = {}
            attr.value.replace(/([^:;]+)\:([^:;]+)/g, function (n1, n2, n3) {
                styleObj[n2] = n3;
            })
            attr.value = styleObj

        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`


    }
    return `{${str.slice(0, -1)}}`;
}

function genChar(char) {

    let text = char.text;
    if (!defaultTagRE.test(text)) {

        return `_v(${text})`;

    } else {

        defaultTagRE.lastIndex = 0;
        let tokens = [];
        let match;
        let lastIndex = 0;
        while (match = defaultTagRE.exec(text)) { // name {{ age }} sex {{a }}

            let index = match.index;
            if (index > lastIndex) {
                
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }

            tokens.push(`_s(${match[1]})`) // 处理可能是对象的情况
            lastIndex = match[0].length + index;
        }

        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${tokens.join('+')})`;
    }
}

function genChildren(el) {
    let str = '';
    for (const child of el.children) {
        if (child.type === 1) {
            str += `${generate(child)},`;
        } else {
            str += `${genChar(child)},`;
        }

    }
    return `${str.slice(0, -1)}`;
}

export default function generate(root) { //_c('div',{id:'app',name : '1'},'text')

    let children = genChildren(root);

    return `_c('${root.tag}',${root.attributes.length ? genAttr(root.attributes) : undefined}${children ? `,${children}` : ''})`
}