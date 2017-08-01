function Autosuggest(props) {
    if (!props.data && !props.getSuggestions) {
        console.error("could not init autosuggest - please provide either data or getSuggestions method");
        return;
    }

    var emptyFunction = function () {};

    var classNames = {
        suggestion: 'suggestion',
        focused: 'focused'
    };

    var ids = {
        wrapper: 'autosuggest-wrapper',
        input: 'autosuggest-input',
        suggestion: 'suggestion-'
    };

    this.mountSelector = props.mountSelector || '#' + ids.wrapper;
    this.onInput = props.onInput || emptyFunction;
    this.getSuggestions = props.getSuggestions || getSuggestions;
    this.onSuggestionSelection =  props.onSuggestionSelection;
    this.data = props.data;
    this.maxSuggestions = props.maxSuggestions || 20;
    this.renderSuggestion = props.renderSuggestion || renderSuggestion;
    this.displayProperty = props.displayProperty;

    var self = this;

    function createElement(attrs) {
        var element = document.createElement(attrs.tag);
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                element[key] = attrs[key];
            }
        }
        return element;
    }

    function removeChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function isAlphaNumeric (keyCode) {
        var inp = String.fromCharCode(keyCode);
        return (/[a-zA-Z0-9-_ \b]/.test(inp));
    }

    function hasClass(ele,cls) {
        return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }

    function addClass(ele,cls) {
        if (!hasClass(ele,cls)) ele.className += ' '+cls;
    }

    function removeClass(ele,cls) {
        if (hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }

    function getObjectByStringProperty(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

    function suggestionIndexById(id) {
        if (!id) return -1;
        return parseInt(id.split('-')[1]);
    }

    var suggestionsWrapper = createElement(
        {
            tag: 'div',
            id: 'suggestions-wrapper'
        }
    );

    var input = createElement(
        {
            tag: 'input',
            id: ids.input
        }
    );

    var autosuggestWrapper = document.querySelector(self.mountSelector);
    if (!autosuggestWrapper) {
        console.error('could not render autosuggest - no mount element provided for selector ' + self.mountSelector);
        return;
    }

    autosuggestWrapper.appendChild(input);
    self.focusedSuggestionId = undefined;
    self.suggestionsCount = 0;

    function renderSuggestion(suggestion, value) {
        return emphasizeValue(suggestion, value);
    }

    function emphasizeValue(suggestionHtml, value) {
        return suggestionHtml ? suggestionHtml.replace(new RegExp(value, 'ig'), '<strong>' + value + '</strong>') : '';
    }

    function charKeyUp(value) {
        removeChildren(suggestionsWrapper);
        self.suggestions = self.getSuggestions(value);
        self.suggestionsCount = self.suggestions.length;
        self.focusedSuggestionId = undefined;
        for (var i = 0; i < Math.min(self.suggestions.length, self.maxSuggestions); i++) {
            var suggestionElement = createElement(
                {
                    id: ids.suggestion + i,
                    tag: 'div',
                    className: classNames.suggestion
                }
            );
            suggestionElement.innerHTML = self.renderSuggestion(self.suggestions[i], value);
            suggestionsWrapper.appendChild(suggestionElement);
        }
        autosuggestWrapper.appendChild(suggestionsWrapper);
    }

    function upDownKeyUp(isUp) {
        var currentIndex = -1;
        var nextIndex;
        if (self.focusedSuggestionId) {
            currentIndex = suggestionIndexById(self.focusedSuggestionId);
        }
        if (currentIndex === -1) {
            if (isUp) {
                nextIndex = self.suggestionsCount - 1;
            }
            else {
                nextIndex = 0;
            }
        }
        else {
            if (isUp) {
                nextIndex = (currentIndex === 0) ? (self.suggestionsCount - 1) : (currentIndex - 1);
            }
            else {
                nextIndex = (currentIndex === (self.suggestionsCount - 1)) ? 0 : (currentIndex + 1);
            }
        }
        changeFocusedSuggestion(document.getElementById(ids.suggestion + nextIndex));
    }

    function selectSuggestion() {
        var target = document.getElementById(self.focusedSuggestionId);
        var index = suggestionIndexById(self.focusedSuggestionId);
        if (!target) return;
        if (self.onSuggestionSelection) {
            input.value = self.onSuggestionSelection(self.suggestions[index]);
        }
        else {
            input.value = target.innerText;
        }
        removeSuggestions();
    }

    function changeFocusedSuggestion(newTarget) {
        if (!newTarget) return;
        if (newTarget.id.indexOf(ids.suggestion) !== 0) {
            self.focusedSuggestionId = undefined;
            return;
        }
        var focused = suggestionsWrapper.getElementsByClassName(classNames.suggestion + ' ' + classNames.focused);
        for (var i = 0; i < focused.length; i++) {
            removeClass(focused[i], classNames.focused);
        }
        self.focusedSuggestionId = newTarget.id;
        addClass(newTarget, classNames.focused);
    }

    function getSuggestions(value) {
        var result = [];
        if (!value) return result;
        self.data.forEach(function(item) {
            item = self.displayProperty ? getObjectByStringProperty(item, self.displayProperty) : item;
            if (item.toLowerCase().indexOf(value.toLowerCase()) > -1) result.push(item);
        });
        return result;
    }

    function removeSuggestions() {
        if (suggestionsWrapper.parentNode) {
            autosuggestWrapper.removeChild(suggestionsWrapper);
        }
    }

    input.addEventListener('keydown', function(e) {
        if (e.keyCode === 38 || e.keyCode === 40) upDownKeyUp(e.keyCode === 38);
    });

    input.addEventListener('keyup', function(e) {
        if (isAlphaNumeric(e.keyCode)) charKeyUp(e.target.value);
        else if (e.keyCode === 13) selectSuggestion();
    });

    suggestionsWrapper.addEventListener('mouseover', function(e) {
        e.stopPropagation();
        changeFocusedSuggestion(e.target);
    });

    suggestionsWrapper.addEventListener('click', function(e) {
        e.stopPropagation();
        selectSuggestion();
    });

    input.addEventListener('focus', function(e) {
        e.stopPropagation();
        if (!suggestionsWrapper.parent) {
            autosuggestWrapper.appendChild(suggestionsWrapper);
        }
    });

    window.addEventListener('click', function(e) {
        if (!autosuggestWrapper.contains(e.target)) removeSuggestions(e.target);
    });
}