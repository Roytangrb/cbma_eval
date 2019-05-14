## CMBA Evaluation

### Dev
 - view page: ```python3 -m http.server```


### Brief Progress
- added popup select material function, but there is a porblem: not being able to remove old event listener on images in the popup window.
- See Wall.js longPresshandler for details.
- Work arround: when the handler function of image selectoin clicked, check with window.currentWall.name to make sure the code handle the correct event.