
:warning: | This is experimental tech in very early R&D.
| -- | -- |
# Rive WebGL
A prototype [WebGL renderer for Rive](https://rive-app.github.io/rive-webgl/). This is used as experimentation to find a good technique for rendering Rive content in game engines or wherever a high level vector renderer is not available. 

## Secondary Goals
Improve [rive-cpp](https://github.com/rive-app/rive-cpp) such that the bulk of the work done for a low level renderer can be optionally compiled into [rive-cpp](https://github.com/rive-app/rive-cpp), exposing a **LowLevelRenderer** (TBD) abstraction on top of the traditional high level [Renderer](https://github.com/rive-app/rive-cpp/blob/master/include/renderer.hpp) rive-cpp currently exposes.

## Getting Started
Just clone this repo and run:

```
npm install
npm start
```

Now open your browser to http://localhost:1234

If you want to bundle a build up to host somewhere run:
```
npm run build
```

This will build and bundle everything you need to deploy into [docs](./docs) folder. It's in the docs folder as that's what GitHub pages likes. That way you can [preview it online here](https://rive-app.github.io/rive-webgl/).
