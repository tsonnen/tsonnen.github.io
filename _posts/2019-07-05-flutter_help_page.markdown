---
layout: post
title:  "Flutter Help Page"
date:   2019-07-05 11:00:00 -0800
category: project
tag: [flutter, help, tip]
---

## TL;DR:
I created a help page viewer using Flutter Markdown.

# Flutter Help Page

For almost any non-trivial software project, there comes a point where
documentation needs to be created for the users. This can be anything 
from API documention to help pages for the users.

I recently came to this point in my 
[Initiative Tracker]({{ site.baseurl }}{% link _projects/initiative_tracker.md %}) app. 
So, I did a quick Google search to see what methods other people were
using to solve this problem. But, sadly, be it due to poor Google-Fu or 
some other reason, I was unable to find a widely accepted solution. This
meant that I would have to either give up, unlikely, or forge my own method.

I chose the latter.

So, I embarked on my journey. Before I started though, I had to set-up a
few expectations:
* Easy to maintain
    * Adding more to the help should be a trivial task that can be 
    accomplished with minimal to no technical skills.
* Easy to add in
    * I don't want to try and link to multiple libraries if I don't have to
* Use pre-existing/well established methods
    * It would be very nice to be able to use a WYSIWYG editor for 
    writing the Help, this would ideally mean HTML, markdown, or 
    something of equal recognition.

With these in mind, I embarked down the Google rabbit hole. Luckily, I
was able to find something that appeared pretty promising with relative
ease. [Flutter Markdown](https://github.com/flutter/flutter_markdown) is a
package created by Google for the purpose of creating a Flutter widget
from markdown. The process to do this is also ridiculously easy, see the code snippet below.

```dart
...
appBar: AppBar(
    title: Text('Help'),
),
body: FutureBuilder(
    future:
        DefaultAssetBundle.of(context).
        loadString('assets/data/help.md'),
    builder: (context, snapshot) {
    return Markdown(data: snapshot.data);
    }),
...
```

This code will open the file located in `assets/data/help.md` and convert 
the markdown code to a Flutter widget. This would then mean that I would 
be able to embed links to the relative anchors, thus minimizing the amount 
of code that I would need to write and maintain.

... Or so I thought. As of the time of writing, relative anchors do not 
seem to be supported in flutter markdown. This would mean that I would
need to find a different solution. I decided to use ` onTapLink ` from 
the ` Markdown ` widget. This would allow for me to load in. a markdown file
based on what link is cicked. This does mean that I would need to create 
markdown files for each topic. While this does create a little bit of bloat
in the sheer amont of files, it does force the pages to be easier to read 
and maintain. Adding in the ` onTapLink ` hook was fairly trivial. With a 
little bit of tweaking to the actual markdown files, this method 
worked really well and very smoothly. Thre was just one issue left, users 
had no method to retrace their steps and go back to previous pages.

Luckily, with this method, it was not to difficult to add in a toolbar at 
the bottom with buttons to navigate through the pages. I have put the code 
for this page below.

``` dart
class HelpPageState extends State<HelpPage> {
  String markdown = '';
  String _currentPage;
  Queue backStack = new Queue();
  Queue forwardStack = new Queue();

  @override
  void initState() {
    super.initState();
  
    showHelp("table_contents");
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      ...
      body: new Markdown(
        data: markdown,
        onTapLink: (value) {
          backStack.addLast(_currentPage);
          forwardStack.clear();
          showHelp(value);
        },
      ),
      bottomNavigationBar: BottomAppBar(
        child: new Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              IconButton(
                icon: Icon(Icons.navigate_before),
                onPressed: () {
                  if (backStack.isNotEmpty){
                    forwardStack.addLast(_currentPage);
                    showHelp(backStack.removeLast());
                  }
                },
                color: backStack.isNotEmpty
                    ? Theme.of(context).buttonColor
                    : Theme.of(context).disabledColor,
              ),
              IconButton(
                icon: Icon(Icons.navigate_next),
                onPressed: () {
                  if (forwardStack.isNotEmpty){
                    backStack.addLast(_currentPage);
                    showHelp(forwardStack.removeLast());
                  }
                },
                color: forwardStack.isNotEmpty
                    ? Theme.of(context).buttonColor
                    : Theme.of(context).disabledColor,
              ),
            ]),
      ),
    );
  }

  showHelp(String file) {
    loadHelpFile(file).then((value) {
      setState(() {
        markdown = value;
        _currentPage = file;
      });
    });
  }

  Future<String> loadHelpFile(String file) async {
    return await rootBundle.loadString('assets/help/' + file + '.md');
  }
}
```

This code could probably stand to be split out into seperate functions for 
increased readibility, but I do not think that it is too bad for a first 
draft.

The full code for this application can be found 
[here](https://github.com/tsonnen/InitiativeTracker).