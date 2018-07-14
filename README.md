# IPAjs
A MathJax extention that lets you typeset IPA (International
Phonetic Alphabet) on the web in the style of LaTeX's [TIPA](https://ctan.org/pkg/tipa?lang=en) package.

## About TIPA
TIPA is a system for processing IPA symbols in LaTeX with support for powerful composable macros and a wide gamut of phonetic symbols.

### References
* [TIPA documentation](https://www.tug.org/tugboat/tb17-2/tb51rei.pdf)
* [TIPA on CTAN](https://ctan.org/pkg/tipa?lang=en)

## Using IPA.js
After installing and configuring MathJax on your page, you may do something like

```
<script type="text/x-mathjax-config">
	MathJax.Ajax.config.path["ipa"] = "https://cdn.rawgit.com/anumat/IPAjs/79b43ba6/";
	
	MathJax.Hub.Config({
		extensions: ["tex2jax.js", "[ipa]/ipa.js"],
		jax: ["input/TeX","output/HTML-CSS"],
		tex2jax: {inlineMath: [['$','$']]}  
	});
</script>
```

Do note that using the CDN will likely be slower than hosting the file on your own.

## Example
Refer to this post for supported symbols and macros, their usage, and some motivation behind this plugin's aesthetics and existence: <https://anumat.com/blog/ipa-js>

## Contribute
Issue a pull request, open issues, or message me on Github (@anumat). 

I know some symbols are still unsupported due to Unicode playing catchup, and the lower accents could use some raising, but I couldn't figure out how to mess with MathML appropriately to achieve the desired look.

## Author
- Anumat Srivastava <https://anumat.com>

## License
The MIT License