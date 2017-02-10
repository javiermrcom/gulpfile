# gulpfile

You can use this *gulpfile* to your projects.

### Installation
```
npm install
```
### Configuration
You only have to change the value of each path.
``` javascript
var path = {
  dist: {
    styles: 'public/css',
    scripts: 'public/js'
  },
  src: {
    styles: 'resources/assets/scss',
    scripts: 'resources/assets/js'
  }
};
```

### Use
#### Development task
Run in command line:
```
gulp dev 
```
#### Production task
Run in command line:
```
gulp build 
```


