# vanilla-autosuggest

Light-weight, independant & highly customizable autosuggest.
Less than 4k minified.
Less than 1.5k gzipped.

## Getting Started
Download minified JS and styles from /dist.

Clone the repository and use ``` node bundle.js ``` to bundle your customized code.

### Prerequisites
Node JS 6 and up for bundling (written in ES6)

### Include
```
<link rel="stylesheet" href="/dist/vanilla-autosuggest.min.css">

<script type="text/javascript" src="/dist/vanilla-autosuggest.min.js"></script>
```

### Options

Name  | Type | Mandatory | default
------------- | ------------- | ------------- | -------------
mountSelector  | string  | no | ```#autosuggest-wrapper```
data  | string array  | yes if getSuggestions not provided | -
onInput  | function(value)  | no | -
getSuggestions  | function(value)  | yes if data not provided | - 
onSuggestionSelection  | function(suggestion)  | no | -
maxSuggestions  | int  | no | 20
renderSuggestion  | function(suggestion, value)  | no | ```suggestion.replace(new RegExp(value, 'ig'), '<strong>' + value + '</strong>');```
displayProperty  | string  | no | -
inputClasses  | string  | no | -
placeholder  | string  | no | -


### Usage
```
// simple data
new Autosuggest({
    data: data
})

// complex data (display nested property)
var data = [{"country": {"code": "US", "name": "United States"}}]

new Autosuggest({
    data: data,
    displayProperty: 'country.name'
})

// custom render
new Autosuggest({
    getSuggestions: getSuggestions, 
    renderSuggestion: renderSuggestion,
    onSuggestionSelection: onSuggestionSelection
})
```

### Examples
See more examples under /examples

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
