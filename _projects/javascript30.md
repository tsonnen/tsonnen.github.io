---
layout: page
title: JavaScript 30
---

This is my code from the JavaScript 30 course. The course can be found <a href="https://javascript30.com/">here</a>. I will link the pages as well as my after thoughts for each day below.


{% assign posts = site.posts | where:"category","JavaScript30" %}
{% assign postSorted = posts | sort:'date' %}

{% if postSorted.size > 0 %}
## Pages
{% for post in postSorted%}
* {{ post.title | remove: "JS 30:"}}
    * <a href = "{{post.url}}">Write-Up</a>
    * <a href = "{{post.demo}}">Demo</a>
{% endfor %}
{% endif %}
