'use strict';

/*
 * Dependencies.
 */

var Retext = require('wooorm/retext@0.5.0');
var keywords = require('wooorm/retext-keywords@0.2.1');
var dom = require('wooorm/retext-dom@0.3.2');
var visit = require('wooorm/retext-visit@0.2.6');
var debounce = require('component/debounce@1.0.0');

/*
 * Retext.
 */

var retext = new Retext()
    .use(visit)
    .use(dom)
    .use(keywords);

/*
 * DOM elements.
 */

var $input = document.getElementsByTagName('textarea')[0];
var $output = document.getElementsByTagName('div')[1];

/*
 * State.
 */

var tree;

/*
 * Handlers.
 */

function oninputchange() {
    if (tree) {
        tree.toDOMNode().parentNode.removeChild(tree.toDOMNode());
    }

    retext.parse($input.value, function (err, root) {
        if (err) {
          throw err;
        }

        tree = root;

        var terms = tree.keywords();

        terms.forEach(function (term, n) {
            term.nodes.forEach(function (node) {
                node.toDOMNode().className = 'keyword keyword-' + n;
            });
        });

        $output.appendChild(tree.toDOMNode());
    });
}

/*
 * Listen.
 */

$input.addEventListener('input', debounce(oninputchange, 200, false));

/*
 * Initial answer.
 */

oninputchange();
