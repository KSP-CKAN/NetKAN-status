import React, { PureComponent } from 'react';

/**
 * https://nabilhassein.github.io/blog/unfold/
 * https://raganwald.com/2016/11/30/anamorphisms-in-javascript.html
 * func: (...params) => [[elements], done, ...nextParams]
 *
 * @generator
 * @param {function} func
 * @param  {...any} params
 * @yields {...any} Whatever func returns in its first element
 */
export function *unfold(func, ...params) {
    const [elements, done, ...nextParams] = func(...params);
    yield* elements;
    if (!done)
        yield* unfold(func, ...nextParams);
}

const diacriticRegex = /[\u0300-\u036f]/g;

/**
 * @param {string} s
 * @returns {string} input normalized for searchability
 */
export function casefold(s) {
    return s.normalize('NFD')
            .replace(diacriticRegex, '')
            .toLowerCase();
}

/**
 * @generator
 * @param {string} content
 * @param {string} toHighlight
 * @param {string=} hlClass
 * @param {number=} start
 * @yields {string|JSX.Element} Spans with hlClass for CSS class for highlighted text, in between strings for unhighlighted text
 */
export function *highlightedElements(content, toHighlight, hlClass, start) {
    if (toHighlight.length < 1)
        yield content;
    else
        yield* unfold(
            /**
             * @param {string} whole
             * @param {string} searchFor
             * @param {number} start
             * @returns {[(string|JSX.Element)[], true] | [(string|JSX.Element)[], false, string, string, number]}
             */
            (whole, searchFor, start) => {
                const where = whole.indexOf(searchFor, start);
                return where === -1
                    // No matches left: remainder as plain
                    ? ([[content.substring(start)],
                        true])
                    // Found one: prefix as plain, then match as highlighted
                    : [[content.substring(start, where),
                        (<span key={where}
                               className={hlClass}>
                            {content.substring(where,
                                               where + searchFor.length)}</span>)],
                       false,
                       whole, searchFor, where + searchFor.length];
            },
            casefold(content),
            casefold(toHighlight),
            start || 0);
}

export default class Highlighted extends PureComponent {
    render() {
        const { Content, Search, HighlightClassName } = this.props;
        return <span>
            {[...highlightedElements(Content || '', Search || '', HighlightClassName)]}
        </span>;
    }
}
