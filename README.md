# formee
A simple form parser that convert's form inputs into a query string or json.

<a name="install"></a>
## Install

```html
<script type="text/javascript" src="formee.js"></script>
```

<a name="basic"></a>
## Basic Usage

Here's an example on how to use formee. For example we have this form:

```html
<form id="form">
 	<input type="text" value="No Value" />
	<input type="text" name="firstname" value="Charles" />
   	<input type="text" name="lastname" value="Zamora" />
	
	<input type="text" name="categories[]" value="Shoes" />
   	<input type="text" name="categories[]" value="Clothes" />
  	<input type="text" name="categories[]" value="Shorts" />

   	<input type="text" name="index[0]" value="Index 1" />
  	<input type="text" name="index[1]" value="Index 2" />
  	<input type="text" name="index[2]" value="Index 3" />
  	<input type="text" name="index[3][][4]" value="Index 4" />

  	<input type="text" name="mixed[a]" value="1&=1x" />
  	<input type="text" name="mixed[b][c]" value="2" />
   	<input type="text" name="mixed[d][][e]" value="3" />
  	<input type="text" name="mixed[f][][][g]" value="4" />
  	<input type="text" name="mixed[h][][i][]" value="5" />
   	<input type="text" name="mixed[j][][][]" value="6" />  
</form>
```

**Figure 1. Converting form to Query**

```js
// initialize
var formee = new Formee();

// convert to query
var query = formee
	.setForm(document.getElementById('form'))
	.toQuery();
	
console.log(query);
```

the result will be ...

```
firstname=Charles&lastname=Zamora&categories%5B%5D='shoes'&categories%5B%5D=Clothes&categories%5B%5D=Shorts&index%5B0%5D=Index%201&index%5B1%5D=Index%202&index%5B2%5D=Index%203&index%5B3%5D%5B%5D%5B4%5D=Index%204&mixed%5Ba%5D=1%26%3D1x&mixed%5Bb%5D%5Bc%5D=2&mixed%5Bd%5D%5B%5D%5Be%5D=3&mixed%5Bf%5D%5B%5D%5B%5D%5Bg%5D=4&mixed%5Bh%5D%5B%5D%5Bi%5D%5B%5D=5&mixed%5Bj%5D%5B%5D%5B%5D%5B%5D=6&gender=male&text=%20%20%20%20%20%20%20%20%20%20%20%20This%20is%20a%20sample%20textarea%20that%20contains%0A%20%20%20%20%20%20%20%20%20%20%20%20a%20long%20%22text%22%20with%20some%20special%20%26%25%5E%26!%40%23%25%26%5E%25*%0A%20%20%20%20%20%20%20%20%20%20%20%20characeters.%0A%20%20%20%20%20%20%20%20
```

**Figure 2. Converting form to JSON**

```js
// initialize
var formee = new Formee();

// convert to json
var json = formee
	.setForm(document.getElementById('form'))
	.toJson();
	
console.log(json);
```

the result will be ...

```
{
   "firstname":"Charles",
   "lastname":"Zamora",
   "categories":[
      "'shoes'",
      "Clothes",
      "Shorts"
   ],
   "index":[
      "Index 1",
      "Index 2",
      "Index 3",
      [
         [
            null,
            null,
            null,
            null,
            "Index 4"
         ]
      ]
   ],
   "mixed":{
      "a":"1&=1x",
      "b":{
         "c":"2"
      },
      "d":[
         {
            "e":"3"
         }
      ],
      "f":[
         [
            {
               "g":"4"
            }
         ]
      ],
      "h":[
         {
            "i":[
               "5"
            ]
         }
      ],
      "j":[
         [
            [
               "6"
            ]
         ]
      ]
   },
   "gender":"male",
   "text":"            This is a sample textarea that contains\n            a long \"text\" with some special &%^&!@#%&^%*\n            characeters.\n        "
}
```

**Figure 3. Converting form to JSON string**

```js
// initialize
var formee = new Formee();

// convert to json string
var string = formee
	.setForm(document.getElementById('form'))
	.toJsonString();
	
console.log(string);
```

the result will be ...

```
{"firstname":"Charles","lastname":"Zamora","categories":["'shoes'","Clothes","Shorts"],"index":["Index 1","Index 2","Index 3",[[null,null,null,null,"Index 4"]]],"mixed":{"a":"1&=1x","b":{"c":"2"},"d":[{"e":"3"}],"f":[[{"g":"4"}]],"h":[{"i":["5"]}],"j":[[["6"]]]},"gender":"male","text":"            This is a sample textarea that contains\n            a long \"text\" with some special &%^&!@#%&^%*\n            characeters.\n        "}
```
