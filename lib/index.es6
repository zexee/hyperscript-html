var print = console.log.bind(console)
var printd = console.dir.bind(console)
import {isEmpty, hyperflexible, flattened} from './utils.js'
import {toStyleStr, zenhand} from 'zenhand'


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function HyperScript({tab='\t', nl='\n', attrsNewLine=true, devMode=true,
  flexibleArgs=true, voidElements=true}={}) {
  tab = devMode ? tab : ''
  nl = devMode ? nl : ''  // nl: newline.

  return flexibleArgs ? hyperflexible.bind(null, hyperscript) : hyperscript

  function hyperscript(type, attrs, ...children) {
    // Prep args, make defaults.
    attrs = !attrs ? {} : {...attrs}
    attrs.class = [...(attrs.class || []), ...(attrs.className || [])]
    attrs.style = !attrs.style ? {} : {...attrs.style}

    // Merge all attrs from selector str and 2nd arg obj.
    if (typeof type === 'string') {
      var sh = zenhand(type)

      type = sh.tag

      if (!isEmpty(sh.attrs.class))
        attrs.class = [...sh.attrs.class, ...attrs.class]

      if (!isEmpty(sh.attrs.style))
        attrs.style = {...sh.attrs.style, ...attrs.style}

      attrs = {...sh.attrs, ...attrs, className: null}
    }

    var el = []

    // Start opening tag.
    el.push(`<${type}`)

    // Add attributes to tag.
    for (var i = 0, k, v, keys = Object.keys(attrs); k = keys[i++], v = attrs[k], k;) {
      if (!isEmpty(v)) {
        if (attrsNewLine) el.push(nl)
        el.push(` ${k}="${k == 'class' ? v.join(' ') : k == 'style' ? toStyleStr(v) : v}"`)
      }
    }

    // End opening tag.
    el.push('>')

    // Add children within element.
    if (!isEmpty(children)) {
      if (devMode) {
        // i: index, c: child.
        flattened(children, (i, c) => {
          el.push(nl + tab)
          el.push(c.split(nl).join(nl + tab))
        })
      }
      else {
        flattened(children, (i, c) => el.push(c))
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    // if option `voidElements=true`.
    if (!isEmpty(children) || (!voidElements || special.indexOf(type) == -1))
      el.push(`${nl}</${type}>`)

    return el.join('')
  }
}

function wrap(opts, ...elements) {
  let h = HyperScript(opts)
  let ret = {}

  for (let i = 0, e; e = elements[i++];) {
    ret[e] = h.bind(null, e)
  }

  return ret
}

export {HyperScript, wrap}
